const RELEASE = "release"
const MODE_24_7 = "24/7"
import { store } from "../../store";
import {v4 as id} from 'uuid'
import { ProfileInterface, ShopifyTaskInterface } from "../../Interfaces/interfaces";
import { ADD_CHECKOUT, ADD_CHECKOUT_BYPASS, EDIT_CHECKOUT_STATE, USE_CHECKOUT_BYPASS } from "../../store/tasksReducer";
import { checkForCaptcha } from "./modules";
const cheerio = require('cheerio')
const { SITES } = require('./shopifyConfig.json');
const request = require('cloudscraper')
// request.debug = true
const getProxy = (proxyProfile:string):string[]=>store.getState().proxy[proxyProfile].proxy
const changeProxy = ()=>{
    let proxyHandler=<any>{}
    for(let item of Object.keys(SITES)) {
        proxyHandler[item] = 0
    }
    // console.log(proxyHandler,getProxy(/* proxyProfile */"noProxy"))
    
    return (url:string,proxyProfile:string)=>{
        // console.log(proxyHandler)
        const proxies = getProxy(proxyProfile||"noProxy")
        proxyHandler[url]>proxies.length?proxyHandler[url]=0:null
        const proxy = proxies[proxyHandler[url]%proxies.length]
        proxyHandler[url]+=1
        return proxy
    }
    // return getProxy
}
const Change = changeProxy()
const getTasks = ():{[key:string]:ShopifyTaskInterface}=>{
    let tasks = store.getState().tasks
    let shopifyTasks = {}
    Object.keys(tasks).filter(task=>tasks[task].shop=='shopify').forEach(taskId=>shopifyTasks = {...shopifyTasks,[taskId]:tasks[taskId]})
    return shopifyTasks
}
// const getSettings = ()=>store.getState().settings
const getProfile = (profile:string):ProfileInterface=>store.getState().profiles[profile]
const editCheckoutState = (taskId:string,state:{level: "LOW" | "ERROR" | "SUCCESS",state:string})=>store.dispatch({type:EDIT_CHECKOUT_STATE,payload:{taskId,message:state}})
const KeySwap = (response:any)=>{
    try {
        let Items = <any>{}
        // response = response.products
        for (let item of response.products){
            const id = item.id;
            const variants = item.variants;
            let Variants = <any>{};
            Items[id] = item;
            for (let size of variants){
                Variants[size.id] = size
            }
            Items[id].variants = Variants
        }
        return Items
    } catch (error) {
        return {}
    }
}
const getRandomInt = (min:number, max:number)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

class BypassQueueLink{
    public cookieJar = request.jar()
    protected __checkoutUrl = ''
    public checkoutUrl = ''
    protected stop = false
    constructor(private url:string,public products:any,private proxyProfile:string = "noProxy"){
        this.AddToCart()
    }
    getRandomSize(){
        let sizes = this.products.products.map((item:any)=>Object.keys(item.variants).filter((size)=>item.variants[size].available)).flat()
        return sizes[Math.floor(Math.random()*sizes.length)]
    }
    get getBypass(){
        console.log("bypass",this)
        return this
    }
    set setStop(value:boolean){
        console.log('bypass stop',value)
        this.stop = value
    }
    async AddToCart(){
        if (this.stop) return/*dispatch error state */
        await request.post(`${this.url}/cart/add.js`, {
            headers: {
                ...request.defaultParams.headers,
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
              },
              proxy:Change(this.url,this.proxyProfile),
              resolveWithFullResponse:true,
            jar:this.cookieJar,
            body: `form_type=product&utf8=%E2%9C%93&id=${this.getRandomSize()}&quantity=1`,
            }).then((r:any)=>r.statusCode).catch(console.log);
        if (this.stop) return//**dispatch error state */
        if (!(await request.get(`${this.url}/cart.json`,{headers:request.defaultParams.headers,json:true,jar:this.cookieJar}).catch(console.log))/* .catch(()=>{}) */?.item_count) return this.AddToCart
        return this.GoToCheckout();
    }
    async GoToCheckout(){
        if (this.stop) return//**dispatch error state */
        await request.get(`${this.url}/checkout.json`, {
            headers: request.defaultParams.headers,
            jar:this.cookieJar,
            proxy:Change(this.url,this.proxyProfile),
            followRedirect:true,
            followAllRedirects:true,
            resolveWithFullResponse: true 
            })
            .then(async(resp:any)=>{
                if(["checkpoint","queue","cart","throttle"].some(string=>resp.request.href.includes(string))){
                    this.cookieJar = request.jar()
                    return this.AddToCart()
                }
                this.__checkoutUrl = resp.request.href
            }).catch(console.log)/* .catch((e:any)=>console.log(e)) */
        return this.RemoveFromCart()
    }
    async RemoveFromCart():Promise<any>{
        request.post(`${this.url}/cart/change.js`,{
            headers: {
            ...request.defaultParams.headers,
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
            },
            proxy:Change(this.url,this.proxyProfile),
            body:"quantity=0&line=1",
            jar:this.cookieJar,
    }).catch(console.log)
    if (this.stop) return//**dispatch error state */
    if ((await request.get(`${this.url}/cart.json`,{headers:request.defaultParams.headers,            proxy:Change(this.url,this.proxyProfile),
        json:true,jar:this.cookieJar}).catch(console.log))/* .catch(()=>{}) */?.item_count) return this.RemoveFromCart()
    this.checkoutUrl=this.__checkoutUrl
    return this
    }


} 

class Checkout{
    protected stop = false
    protected totalPrice = 0
    protected cookieJar = request.jar()
    public checkoutUrl = `${this.url}/checkout.json`
    protected shippingOption = ''
    protected authenticity_token = ''
    protected checkoutGateway = SITES[this.url].checkoutGateway || 128707719
    protected captchaHeader = {}
    constructor(private url:string,private id:string,private profile:string='',private proxyProfile:string='noProxy',protected taskId:string,public title:string){
        let bypasses = getTasks()[taskId].checkoutsBypass?./*  */[url]
        console.log(getTasks()[taskId])
        for (let bypass in bypasses){
            if(!bypasses[bypass].used&&bypasses[bypass].bypass.getBypass.checkoutUrl.length){
                this.checkoutUrl = bypasses[bypass].bypass.getBypass.checkoutUrl
                this.cookieJar = bypasses[bypass].bypass.getBypass.cookieJar
                store.dispatch({type:USE_CHECKOUT_BYPASS,payload:{checkoutBypassId:bypass,taskId}})
                break
            }
        }
        this.AddToCart()
    }
    set setStop(value:boolean){
        this.stop = value
    }
    async AddToCart(){
        if (this.stop) return//**dispatch error state */
        await request.post(`${this.url}/cart/add.js`, {
            headers: {
                ...request.defaultParams.headers,
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
              },
            body: `form_type=product&utf8=%E2%9C%93&id=${this.id}&quantity=1`,
            proxy:Change(this.url,this.proxyProfile),
            jar:this.cookieJar
            }).catch((e:any)=>{
                if (e.statusCode == 422){
                    console.log(JSON.parse(e.error).description)
                    /* Dispatch this error */
                    editCheckoutState(this.taskId,{level:"LOW",state:JSON.parse(e.error).description})
                }
                else {
                    console.log(JSON.parse(e.error).description)
                    /* Dispatch this error */
                    editCheckoutState(this.taskId,{level:"ERROR",state:JSON.parse(e.error).description})
                    if (getTasks()[this.taskId].retryOnFailure) return this.AddToCart()
                    this.setStop=true
                }
        });
        editCheckoutState(this.taskId,{level:"LOW",state:`${this.title}\nsuccesfully added to cart`})

        if (this.stop) return//**dispatch error state */

        this.totalPrice = request.get(`${this.url}/cart.json`,{
            headers:request.defaultParams.headers,
            proxy:Change(this.url,this.proxyProfile),
            json:true,
            jar:this.cookieJar
            }).then((r:{items_subtotal_price?:string|number})=>r.items_subtotal_price).catch(console.log)
        return await this.CheckoutRedirect();
    }
    async CheckoutRedirect(){
        if (this.stop) return//**dispatch error state */
        await request.get(this.checkoutUrl, {
            headers: {
                ...request.defaultParams.headers
            },
            jar:this.cookieJar,
            proxy:Change(this.url,this.proxyProfile),
            followRedirect:true,
            followAllRedirects:true,
            resolveWithFullResponse: true 
            }).then(async(response:any)=>{
                this.checkoutUrl  = await response.request.href;
                let $ = cheerio.load(response.body)
                this.authenticity_token = $('input[name="authenticity_token"][type="hidden"]')?.attr('value')
                console.log(this.authenticity_token)
                switch (true) {
                    case this.checkoutUrl.includes("stock_problems"):
                        console.log("stock_problems")
                        if (getTasks()[this.taskId].retryOnFailure) return this.AddToCart()
                        return
                        // return await this.AddToCart()
                        // break;
                    case this.checkoutUrl.includes("login"):
                        console.log("login")
                        return
                    case this.checkoutUrl.includes("checkpoint"):
                        console.log("checkpoint")
                        let captchaHeader = await checkForCaptcha(response)
                        if (Object.keys(captchaHeader).length) {
                            let form = {
                                "authenticity_token":this.authenticity_token,
                                "data_via":"cookie",
                                "commit":"",
                                ...captchaHeader
                            }
                            await request.post(response.request.href,{
                                headers: {
                                    ...request.defaultParams.headers,
                                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                                    "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                                    "cache-control": "max-age=0",
                                    "content-type": "application/x-www-form-urlencoded",
                                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Microsoft Edge\";v=\"90\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-fetch-dest": "document",
                                    "sec-fetch-mode": "navigate",
                                    "sec-fetch-site": "same-origin",
                                    "sec-fetch-user": "?1",
                                    "upgrade-insecure-requests": "1",
                                    "Referrer": response.request.referrer,
                                  },
                                  jar:this.cookieJar,
                                  form:form,
                                  proxy:Change(this.url,this.proxyProfile),
                                  followAllRedirects:true,
                                  resolveWithFullResponse: true               
                            }).then((r:any)=>{console.log(r.statusCode);this.checkoutUrl = r.request.href})
                            .catch((e:any)=>console.log(e))
                        }
                        break;                    
                    case this.checkoutUrl.includes("throttle"):
                        console.log("queue")
                        await request.get(`${this.url}/throttle/queue`,{
                            headers: request.defaultParams.headers,
                            followRedirect:true,
                            proxy:Change(this.url,this.proxyProfile),
                            followAllRedirects:true,
                            jar:this.cookieJar,
                            resolveWithFullResponse: true                        
                        }).then(async (response:any)=>{
                            this.checkoutUrl  = await response.request.href;
                            if(this.checkoutUrl.includes("stock_problems")) return await this.AddToCart()
                            this.authenticity_token = $('input[name="authenticity_token"][type="hidden"]')?.attr('value')
                            let captchaHeader = await checkForCaptcha(response)
                            if (Object.keys(captchaHeader).length) this.captchaHeader = captchaHeader
                            })    
                        break;                    
                    case this.checkoutUrl.includes("cart"):
                        console.log("cart")
                        if (getTasks()[this.taskId].retryOnFailure) return this.AddToCart()
                        return
               
                    default:
                        console.log(this.checkoutUrl)
                        return await this.ShippingConfirm()
                }
                let captchaHeader = await checkForCaptcha(response)
                if (Object.keys(captchaHeader).length) this.captchaHeader = captchaHeader

            }).catch(console.log)
            if (this.stop) return//**dispatch error state */
            return await this.ShippingConfirm()

    }
    async ShippingConfirm():Promise<any>{
        if (this.stop) return//**dispatch error state */
        const profile = getProfile(this.profile)
        let form = {
            '_method':'patch',
            'authenticity_token':this.authenticity_token,
            'previous_step':'contact_information',
            'step':'shipping_method',
            'checkout[email]':profile?.email,
            'checkout[buyer_accepts_marketing]': 1,
            'checkout[shipping_address][first_name]':profile?.firstName,
            'checkout[shipping_address][last_name]':profile?.lastName,
            'checkout[shipping_address][address1]':profile?.address1,
            'checkout[shipping_address][address2]':profile?.address2,
            'checkout[shipping_address][city]':profile?.city,
            'checkout[shipping_address][country]':profile?.country,
            'checkout[shipping_address][province]':profile?.province,
            'checkout[shipping_address][zip]':profile?.postCode,
            'checkout[shipping_address][phone]':profile?.phone,
            'checkout[client_details][browser_width]': getRandomInt(500,2000),
            'checkout[client_details][browser_height]': getRandomInt(300,1000),
            'checkout[client_details][javascript_enabled]': 1,
            'checkout[client_details][color_depth]': 24,
            'checkout[client_details][java_enabled]':false,
            'checkout[client_details][browser_tz]': -180,
            ...this.captchaHeader
        }
        // for (let ext in this.extraHeaders){
        //     form[ext] = this.extraHeaders[ext]
        // }
        // form = Object.assign(form, this.captchaHeader)
        // console.log(form);
        // console.log(478,this.checkoutUrl);
        await request.post(this.checkoutUrl, {
                "headers": {
                    ...request.defaultParams.headers,
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "Referrer": `${this.checkoutUrl}?step=contact_information`,
                },
                proxy:Change(this.url,this.proxyProfile),
                jar:this.cookieJar,
                form: form,
                followAllRedirects:true,
                // resolveWithFullResponse: true 
                }).catch(console.log)
        if (this.stop) return//**dispatch error state */
        let ship = await request.get(`${this.url}/cart/shipping_rates.json?shipping_address[zip]=${profile?.postCode?.replace(" ","+")}&shipping_address[country]=${profile?.country?.replace(" ","+")}&shipping_address[province]=${profile?.province}`, {
            "headers": {
                ...request.defaultParams.headers,               
                "Referrer": `${this.url}/`,
            },
            proxy:Change(this.url,this.proxyProfile),
            json:true,
            jar:this.cookieJar,
        }).catch(console.log)
        // ship = JSON.parse(ship);
        if(!ship?.shipping_rates.length){
            console.log("Unavailable to ship")
            if (getTasks()[this.taskId].retryOnFailure) return this.ShippingConfirm()
            return
        }
        let ship_opt = ship["shipping_rates"][0]["name"]
        let ship_prc:string = ship["shipping_rates"][0]["price"]
        let ship_src = ship["shipping_rates"][0]["source"]
        this.totalPrice = parseInt((await this.totalPrice).toString()) + parseInt((100*parseFloat(ship_prc)).toString());
        this.shippingOption = (encodeURIComponent((ship_src+"-" + ship_opt + "-" + ship_prc).replace(/ /g,"%20"))).replace("(","%28").replace(")","%29");
        console.log(this.shippingOption)
        if (this.stop) return//**dispatch error state */
        await request.post(this.checkoutUrl, {
            "headers": {
                ...request.defaultParams.headers,               
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referrer": `${this.checkoutUrl}?previous_step=contact_information&step=shipping_method`,
            },
            body: `_method=patch&authenticity_token=${this.authenticity_token}&previous_step=shipping_method&step=payment_method&checkout%5Bshipping_rate%5D%5Bid%5D=${this.shippingOption}&checkout%5Bclient_details%5D%5Bbrowser_width%5D=1349&checkout%5Bclient_details%5D%5Bbrowser_height%5D=600&checkout%5Bclient_details%5D%5Bjavascript_enabled%5D=1&checkout%5Bclient_details%5D%5Bcolor_depth%5D=24&checkout%5Bclient_details%5D%5Bjava_enabled%5D=false&checkout%5Bclient_details%5D%5Bbrowser_tz%5D=-180`,
            proxy:Change(this.url,this.proxyProfile),
            followAllRedirects:true,
            jar:this.cookieJar
            }).catch(console.log)
            return await this.ConfirmPayment();
    }
    async ConfirmPayment(){
        if (this.stop) return//**dispatch error state */
        const profile = getProfile(this.profile)
        let paymentToken = (await request.post("https://deposit.us.shopifycs.com/sessions", {
            headers: {
                ...request.defaultParams.headers,
                "accept": "application/json",
                "accept-language": "ru-RU,ru;q=0.9",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "referrer": "https://checkout.shopifycs.com/",
            },
            form:{
                "credit_card":{
                    "number":profile?.cardNumber,
                    "name":profile?.cardHolderName,
                    "month":profile?.month,
                    "year":profile?.year,
                    "verification_value":profile?.cvv
                },
                "payment_session_scope":this.url.split("//")[1]
            },
            proxy:Change(this.url,this.proxyProfile),
            followAllRedirects:true,
            json:true,
            jar:this.cookieJar
            }).catch(console.log))?.id;
        console.log(paymentToken) 
        if (this.stop) return//**dispatch error state */
        await request.post(this.checkoutUrl, {
            "headers": {
                ...request.defaultParams.headers,
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "ru-RU,ru;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referrer": `${this.checkoutUrl}?previous_step=shipping_method&step=payment_method`,
            },
            proxy:Change(this.url,this.proxyProfile),
            body: `_method=patch&authenticity_token=${this.authenticity_token}&previous_step=payment_method&step=&s=${paymentToken}&checkout%5Bpayment_gateway%5D=${this.checkoutGateway}&checkout%5Bcredit_card%5D%5Bvault%5D=false&checkout%5Bdifferent_billing_address%5D=false&checkout%5Btotal_price%5D=${await this.totalPrice}&complete=1&checkout%5Bclient_details%5D%5Bbrowser_width%5D=1349&checkout%5Bclient_details%5D%5Bbrowser_height%5D=600&checkout%5Bclient_details%5D%5Bjavascript_enabled%5D=1&checkout%5Bclient_details%5D%5Bcolor_depth%5D=24&checkout%5Bclient_details%5D%5Bjava_enabled%5D=false&checkout%5Bclient_details%5D%5Bbrowser_tz%5D=-180`,
            followAllRedirects:true,
            jar:this.cookieJar,
            resolveWithFullResponse: true 
            }).then((_r:any)=>editCheckoutState(this.taskId,{level:"SUCCESS",state:"Transaction completed"})).catch(console.log)
        // console.log(await request.get(this.checkoutUrl+'/processing',{
        //     proxy:Change(this.url,this.proxyProfile),
        //     headers:request.defaultParams.headers,
        //     followAllRedirects:true,
        //     jar:this.cookieJar,
        //     resolveWithFullResponse: true 
        // }).catch(console.log))
    }
    

    
}


export class ShopifyMonitor{
    constructor(
        public url = 'https://kith.com',
        
    ){
    }
    Parse = async ()=>{
        try {
            let response = await request.get(this.url+'/products.json?limit=99999',{json:true,proxy:Change(this.url,"noProxy")}).catch(()=>null)
            let products = KeySwap(response)
            console.log(this.url, Object.keys(products).length)
            let tasks =  getTasks()
            if(!Object.keys(tasks).map(task=>tasks[task].isRun).filter(isRun=>isRun).length) return
            for (let item in products){
                let variants = products[item]["variants"];
                let Include = (name:string) => products[item]["title"].toLocaleLowerCase().includes(name);
                // console.log(products[item].title)
                    for(let task in tasks){
                        // console.log(tasks[task])
                        /* Generating bypass block */
                        // !tasks[task].checkoutsBypass?.[this.url]?tasks[task]?.checkoutsBypass[this.url]={}:null
                        if (
                            tasks[task].isRun&&
                            Object.keys(tasks[task].checkoutsBypass?.[this.url]||{}).length<tasks[task].checkoutsAmount
                            ){
                                /* generate bypass */
                                store.dispatch({type:ADD_CHECKOUT_BYPASS,payload:{
                                    url:this.url,/*  */
                                    checkoutBypassId:id(),
                                    taskId:tasks[task].id,
                                    checkoutBypass:new BypassQueueLink(this.url,
                                    response,tasks[task].proxyProfile
                                    ),
                                    used:false
                                }
                                })
                        }
                        /* Generating bypass block end*/
                        if(
                            tasks[task].positive?.every(Include)&&
                            !tasks[task].negative?.some(Include)&&
                            tasks[task].isRun){
                                switch (tasks[task].mode) {
                                    case RELEASE:
                                        for(let size in variants){
                                            if (variants[size].available&&
                                               (tasks[task].sizes[variants[size].title]||
                                                !Object.keys(tasks[task].sizes).length
                                                )&&
                                                Object.keys(tasks[task].checkouts||{}).length<tasks[task].checkoutsAmount
                                                ){
                                                    // console.log(store.getState(),id())
                                                    store.dispatch({type:ADD_CHECKOUT,payload:{
                                                        checkoutId:id(),
                                                        // isRun:true,
                                                        taskId:tasks[task].id,
                                                        checkout:new Checkout(this.url,
                                                        size,
                                                        tasks[task].profile,
                                                        tasks[task].proxyProfile,
                                                        task,
                                                        products[item].title)}
                                                    })
                                                    console.log(store.getState())
                                                }
                                            // new Checkout(this.url,size,products[id].handle,SITES[this.url].special.profileName)
                                            // break
                                        }        
                                        break;
                                    case MODE_24_7:
                                        for(let size in variants){
                                            if (variants[size].available&&
                                                (tasks[task].sizes[variants[size].title]||
                                                    !Object.keys(tasks[task].sizes).length
                                                    )&&
                                                    Object.keys(tasks[task].checkouts||{}).length<tasks[task].checkoutsAmount
                                                    ){
                                                        console.log(tasks[task])
                                                            store.dispatch({type:ADD_CHECKOUT,payload:{
                                                            checkoutId:id(),
                                                            taskId:tasks[task].id,
                                                            checkout:new Checkout(this.url,
                                                                size,
                                                                tasks[task].profile,
                                                                tasks[task].proxyProfile,
                                                                task,
                                                                products[item].title)}
                                                            })
                                                                console.log(getTasks())
                                                        break
    
                                                    }
                                        }        
                                        break
                                    default:
                                        break;
                                }
                        }
                    }   
    
            }
        } catch (error) {
            console.log(error)
        }
        return setTimeout(this.Parse,5000)
    }

}
