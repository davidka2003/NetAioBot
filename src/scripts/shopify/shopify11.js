const fetch = require('node-fetch');
// const fs = require('fs')
const jsdom =require("jsdom")
const agent =require("random-useragent")
// const {SendMessage} = require('../renderModules');
//Личный кабинет антикапчи
const SolveCaptcha= require("./modules.js")
const { useContext }= require('react')
const {Context}= require('../../js/Context')
const {request} =require('request-promise')

// globalThis.SITES = require("../Settings/Setup.json").sites;
// // globalThis.filter = require("../../setup/Setup.json").filter;
// globalThis.proxy = require("../Settings/Setup.json").proxy;
// globalThis.bypassStorageAmount = require("../Settings/Setup.json").bypassStorageAmount;
// globalThis.releaseMode = require("../../setup/Setup.json").releaseMode;
// window.startShopifyMonitor = false
window.queue={}
let proxyQueue = {}
//310
const [context, setcontext] = useContext(Context)
// const checkForStop = (taskID)=>{
//     let task = JSON.parse(localStorage.getItem('tasks'))[taskID]
//     if(task){
//         if(!task.stop){
//             return false
//         }
//     }    
//     return true   
// }
const getAgent = ()=>{
    let ag=agent.getRandom(ua=>ua.browserName === 'Chrome')
    if(ag.length<100){
        return ag
    }
    else return getAgent()
}
// module.exports.ControlSettings = async ()=>{
//     let i =setInterval(()=>{
//         window.startShopifyMonitor?clearInterval(i):null;
//         let set = JSON.parse(fs.readFileSync("./NetAioModules/shopify/Setup.json","utf-8",(e)=>{console.log(e);}))
//         SITES = set.sites
//         filter = set.filter
//         proxy = set.proxy
//         bypassStorageAmount = set.bypassStorageAmount
//         releaseMode = set.releaseMode
//     },2000)
// }
// ControlSettings();

const KeySwap = (response)=>{
    let Items = {}
    response = response["products"]
    for (let item in response){
        let id = response[item].id;
        let variants = response[item]["variants"];
        let Variants = {};
        Items[id] = response[item];
        for (let size in variants){
            Variants[variants[size]["id"]]=variants[size];
        }
        Items[id]["variants"] = Variants
    }
    return Items
}


const proxySwitch = (url)=>{
    let current = proxyQueue[url]["current"]
    proxyQueue[url]["current"] ++
    proxyQueue[url]["current"] %=proxyQueue[url].proxies.length
    return proxyQueue[url].proxies[(current+1)%proxyQueue[url].proxies.length]
}


const GetCheckoutPassLink= (url)=>{
    let minExp={"expiration":999999999999999}
    try{
        for(let checkout in queue[url]){
            queue[url][checkout].expiration <minExp.expiration?minExp = queue[url][checkout]:null
        delete queue[url][minExp.checkoutUrl]
        }
    }
    catch{}
    if(!Object.keys(queue[url]).length){
        return false
    }
    else return minExp

}

const getRandomInt = (min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

class BypassQueueLink{
    constructor(url,id,handle,taskID){
        this.url = url
        this.id = id
        this.taskID = taskID
        this.handle = handle
        // this.request = require("request-promise");
        this.cookieJar = this.request.jar();
        this.request = this.request.defaults({jar:this.cookieJar,proxy:proxySwitch(url)});
        this.userAgent = getAgent()
        this.deadEnd = false
        // this.AddToCart()
    }
    async AddToCart(){
        await this.request.post(`${this.url}/cart/add.js`, {
            headers: {
                "User-Agent": this.userAgent,
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
              },
            
            "referrer": `${this.url}/products/${this.handle}?variant=${this.id}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `form_type=product&utf8=%E2%9C%93&id=${this.id}&quantity=1`,
            "mode": "cors",
            "credentials": "include",
            }).then(r=>{}).catch(e=>this.deadEnd=true);
        if (this.deadEnd||checkForStop(this.taskID)||!window.startShopifyMonitor)return

        this.request.get(`${this.url}/cart.json`,{
            "headers": {
                "User-Agent":this.userAgent,                
                },
            }).then(r =>{/*console.log("Item added successfully")*/}).catch(e=>this.deadEnd=true)
        return await this.GoToCheckout();
    }
    async GoToCheckout(){
        if (this.deadEnd||checkForStop(this.taskID)||!window.startShopifyMonitor)return
        await this.request.get(`${this.url}/checkout.json`, {
            "headers": {
                "User-Agent":this.userAgent,                
            },
            "referrer": `${this.url}/`,
            "referrerPolicy": "origin",
            "method": "GET",
            "mode": "cors",
            "credentials": "include",
            followRedirect:true,
            followAllRedirects:true,
            resolveWithFullResponse: true 
            })
            .then(async(resp)=>{
                this.checkoutUrl  = resp.request.href;
            /*console.log(this.checkoutUrl)*/}).catch(()=>this.deadEnd=true)
                // console.log(this.request.jar());
                return await this.RemoveFromCart()

    }
    async RemoveFromCart(){
        if (this.deadEnd||checkForStop(this.taskID)||!window.startShopifyMonitor)return
        this.request.post(`${this.url}/cart/change.js`,{
            headers: {
            "User-Agent":this.userAgent,
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
        
        "referrer": `${this.url}/products/${this.handle}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `quantity=0&line=1`,
        "mode": "cors",
        "credentials": "include"
    }).then(r=>{}).catch(e=>this.deadEnd=true)
    if (this.deadEnd||checkForStop(this.taskID)||!window.startShopifyMonitor)return
    return {"site":this.url,
    "checkoutUrl":this.checkoutUrl,"jar":this.cookieJar, "expiration":parseInt(Date.now()/1000+3600)}


    }


} 

class BypassQueue{
    constructor(url,taskID){
        this.url = url
        this.taskID = taskID
        this.timeout = 5000
        this.deleteAvailable = true
        // queue[this.url]={}
        // this.numLinks = numLinks
        //**ADD localstorage jar of links */
    }
    /**Make push */
    async QueuePush(){
        if(!window.startShopifyMonitor||checkForStop(this.taskID)) return
        let d = await this.GetTrialItem()
        if(!d) return;
        let queueData = await new BypassQueueLink(this.url,d[0],d[1],this.taskID ).AddToCart()
        if (!queueData) {return}
        if (!queueData.checkoutUrl){return}
        if (queueData.checkoutUrl.includes("cart")){return}
        //Не меняется кью
        if (queueData.checkoutUrl.includes("checkout.json")
        ||queueData.checkoutUrl.includes("checkpoint")
        ||queueData.checkoutUrl.includes("undefined")){
            this.timeout = 600000
            this.deleteAvailable = false
            return
        }
        else{
            this.timeout = 5000
            this.deleteAvailable = true
        }
        queue[this.url][queueData.checkoutUrl] = {
            "site":this.url,
            "jar":queueData.jar,
            "expiration":queueData.expiration,
            "checkoutUrl":queueData.checkoutUrl
        }
        console.log(`Created Bypass link ${queueData.checkoutUrl} #${Object.keys(queue[this.url]).length}`);
    }
    async Control(){
        try {
            // console.log(12);
            // console.log(!window.startShopifyMonitor||checkForStop(this.taskID));
            if(!window.startShopifyMonitor||checkForStop(this.taskID)) return setTimeout(()=> this.Control(),this.timeout)
            /**return timeuot if stop */
            if(!Object.keys(queue).includes(this.url)){
                queue[this.url] = {}
                this.QueuePush()}
            else if (Object.keys(queue[this.url]).length < bypassStorageAmount) this.QueuePush()
            for (let checkout in queue[this.url]){
                if(queue[this.url][checkout].expiration < parseInt(Date.now()/1000)&&checkout.includes("checkouts")&&this.deleteAvailable){
                    delete queue[this.url][checkout];
                    console.log(`Bypass link expired ${this.url}`);
                    console.log(`Creating new Bypass link ${this.url}`);
                    this.QueuePush();
                }
            }
            
        } catch (error) {
            console.log(error);
        }
        finally{
            setTimeout(()=>this.Control(),this.timeout)}

    }
    async GetTrialItem(){
        if(!window.startShopifyMonitor||checkForStop(this.taskID)) return null
        let products;
        try{
            let items = {}
            let resp = await fetch(this.url+'/products.json?limit=99999', {
                "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
                },
            }).catch(e=>e);
            products = KeySwap(await resp.json());
            for (let item in products){
                let variants = products[item]["variants"];
                items[products[item].handle] = []
                for (let size in variants){
                    if (variants[size]["available"]){
                        // console.log([size, products[item].handle]);
                        items[products[item].handle].push(size)
                        // return [size, products[item].handle]
                    }
                }
                products[item].length?null:delete products[item]

            }
            let prod = Object.keys(items)[parseInt(Math.random()*Object.keys(items).length-0.01)]
            let size = items[prod][parseInt(Math.random()*items[prod].length-0.01)]
            return [size,prod]

        }
        catch(e){
            // console.log(e);
            return null

        }

    }

}

class Checkout{
    constructor(url,id,handle,profile,taskID){
        this.url = url
        this.id = id
        this.handle = handle
        this.userAgent = getAgent()
        this.taskID = taskID
        /**Checkout  */
        // JSON.parse(localStorage.getItem('tasks'))[this.taskID].stop
        this.profile //= require("../../setup/Setup.json").profiles[profile];
        this.extraHeaders //= require("../../setup/Setup.json").sites[this.url]["extraHeaders"]
        this.checkoutGateway //= require("../../setup/Setup.json").sites[this.url]["checkoutGateway"]
        this.request = request
        this.deadEnd = false
        let q
        let cookieJar
        if(Object.keys(queue).length&&Object.keys(queue[url]).length){
            this.bypassAvailable = true
            q = GetCheckoutPassLink(url)
            cookieJar = q.jar
            this.checkoutUrl = q.checkoutUrl && q.checkoutUrl!="undefined"?q.checkoutUrl:this.url+"/checkout.json"
        }
        else{
            this.bypassAvailable = false
            cookieJar = this.request.jar();}
        this.request = this.request.defaults({jar:cookieJar,proxy:proxySwitch(url)});
        this.AddToCart();
    /*class captcha solver*/
    }
    /**
     * ADD captcha checker to login
     */
    async Login(){
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        await this.request.post(`${this.url}/account/login`, {
            "headers": {
                "User-Agent":this.userAgent,
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            "referrer": `${this.url}/account/login?checkout_url=${encodeURIComponent(this.checkoutUrl)}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `form_type=customer_login&utf8=%E2%9C%93&customer%5Bemail%5D=${encodeURIComponent(this.profile.email)}&customer%5Bpassword%5D=${encodeURIComponent(this.profile.email)}&checkout_url=${encodeURIComponent(this.checkoutUrl)}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include",
            followAllRedirects:true,
            resolveWithFullResponse: true 
        }).then(async r => {
            if (!r.request.href.includes("challenge")){
                console.log("Login successful");
                await this.Checkout()}
            else if(r.request.href.includes("challenge")){
                await this.Login()
            }
        }).catch(e=>console.log("Login Failed",e.statusCode));
    }
    async AddToCart(){
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        await this.request.post(`${this.url}/cart/add.js`, {
            headers: {
                "User-Agent":this.userAgent,
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
              },
            
            "referrer": `${this.url}/products/${this.handle}?variant=${this.id}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `form_type=product&utf8=%E2%9C%93&id=${this.id}&quantity=1`,
            "mode": "cors",
            "credentials": "include",

            }).then(r => {console.log("Size successfully added");SendMessage(this.taskID, 'Size successfully added','yellow');this.CheckCartStock()}).catch(e=>{console.log("Add to cart problems");this.deadEnd=true});
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        this.request.get(`${this.url}/cart.json`,{
            "headers": {
                "User-Agent":this.userAgent,                
                },
            }).then(r=>this.totalPrice = JSON.parse(r).items_subtotal_price).catch(()=>{console.log("Add to cart problems");this.deadEnd=true;clearInterval(this.inter)})
        return await this.GoToCheckout();
    }
    async GoToCheckout(){
        /* Checkout */ 
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        this.checkoutUrl = this.bypassAvailable?this.checkoutUrl:`${this.url}/checkout.json`
        console.log("Bypass: "+this.bypassAvailable, this.checkoutUrl);
        SendMessage(this.taskID, 'Bypass: '+this.bypassAvailable,'yellow');
        await this.request.get(this.checkoutUrl, {
            "headers": {
                "User-Agent":this.userAgent,                
            },
            "referrer": `${this.url}/`,
            "referrerPolicy": "origin",
            "method": "GET",
            "mode": "cors",
            "credentials": "include",
            followRedirect:true,
            followAllRedirects:true,
            resolveWithFullResponse: true 
            }).then(async(resp)=>{
                // console.log(resp)
                this.checkoutUrl  = resp.request.href;
                // console.log(368, this.checkoutUrl);
                if(this.checkoutUrl.includes("stock_problems")) {this.deadEnd=true;clearInterval(this.inter)};
                if (resp.request.href.includes("login")){await this.Login()}
                if (resp.request.href.includes("checkpoint")){
                    /*Check for capthca function would be later */
                    this.authenticity_token = new jsdom.JSDOM(resp.body).window.document;
                    this.authenticity_token = encodeURIComponent(await this.authenticity_token.getElementsByName("authenticity_token")[0].value);
                    this.captchaHeader = await new SolveCaptcha(resp,this.url,this.taskID).checkForCaptcha();
                    if (this.captchaHeader)
                    {
                        let form = {
                            "authenticity_token":this.authenticity_token,
                            "data_via":"cookie",
                            "commit":""
                        }
                        form = Object.assign(form, this.captchaHeader)
                        await this.request.post(resp.request.href,{
                            "headers": {
                                "User-Agent":this.userAgent,
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
                                "upgrade-insecure-requests": "1"
                              },
                              "referrer": resp.request.referrer,
                              "referrerPolicy": "strict-origin-when-cross-origin",
                              "method": "POST",
                              "mode": "cors",
                              "credentials": "include",
                              form:form,
                              followAllRedirects:true,
                              resolveWithFullResponse: true               
                        }).then(r=>{console.log(r.statusCode);this.checkoutUrl  = r.request.href})
                        .catch(e=>{this.deadEnd=true;clearInterval(this.inter)})
                    }
                }
                if (resp.request.href.includes("throttle")){
                    console.log("You are in queue")
                    SendMessage(this.taskID, 'You are in queue','yellow');
                    await this.request.get(`${this.url}/throttle/queue`,{
                        "headers": {
                            "User-Agent":this.userAgent,                
                        },
                        "referrer": `${this.url}/`,
                        "referrerPolicy": "origin",
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include",
                        followRedirect:true,
                        followAllRedirects:true,
                        resolveWithFullResponse: true                        
                    }).then(async resp=>{
                        this.checkoutUrl  = await resp.request.href;
                        // console.log(426);
                        if(await this.checkoutUrl.includes("stock_problems")){console.log("out of stock");SendMessage(this.taskID, 'out of stock');this.deadEnd=true;clearInterval(this.inter)}
                        this.authenticity_token = new jsdom.JSDOM(resp.body).window.document;
                        this.authenticity_token = encodeURIComponent(await this.authenticity_token.getElementsByName("authenticity_token")[0].value);
                        this.captchaHeader = await new SolveCaptcha(resp,this.url,this.taskID).checkForCaptcha(); 
                    })
                }
                if (resp.request.href.includes("cart")){
                    console.log("Problems with add to cart");
                    SendMessage(this.taskID, 'Problems with add to cart')
                    this.deadEnd=true;
                    clearInterval(this.inter)
                }
                else{
                    this.captchaHeader = await new SolveCaptcha(resp,this.url,this.taskID).checkForCaptcha();
                    this.authenticity_token = new jsdom.JSDOM(resp.body).window.document;
                    this.authenticity_token = encodeURIComponent(await this.authenticity_token.getElementsByName("authenticity_token")[0].value);
                }
              }).catch(e=>{this.deadEnd=true;clearInterval(this.inter)});
        // console.log(this.checkoutUrl);
        await this.ShippingConfirm();
    }
    async ShippingConfirm(){
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        let form = {
            '_method':'patch',
            'authenticity_token':await this.authenticity_token,
            'previous_step':'contact_information',
            'step':'shipping_method',
            'checkout[email]':this.profile.email,
            'checkout[buyer_accepts_marketing]': 0,
            'checkout[buyer_accepts_marketing]': 1,
            'checkout[shipping_address][first_name]':this.profile.firstName,
            'checkout[shipping_address][last_name]':this.profile.lastName,
            'checkout[shipping_address][address1]':this.profile.address1,
            'checkout[shipping_address][address2]':this.profile.address2,
            'checkout[shipping_address][city]':this.profile.city,
            'checkout[shipping_address][country]':this.profile.country,
            'checkout[shipping_address][province]':this.profile.province,
            'checkout[shipping_address][zip]':this.profile.postCode,
            'checkout[shipping_address][phone]':this.profile.phone,
            'checkout[client_details][browser_width]': getRandomInt(500,2000),
            'checkout[client_details][browser_height]': getRandomInt(300,1000),
            'checkout[client_details][javascript_enabled]': 1,
            'checkout[client_details][color_depth]': 24,
            'checkout[client_details][java_enabled]':false,
            'checkout[client_details][browser_tz]': -180,
        }
        for (let ext in this.extraHeaders){
            form[ext] = this.extraHeaders[ext]
        }
        form = Object.assign(form, this.captchaHeader)
        // console.log(form);
        // console.log(478,this.checkoutUrl);
        await this.request.post(this.checkoutUrl, {
                "headers": {
                    "User-Agent":this.userAgent,                
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1"
                },
                "referrer": `${this.checkoutUrl}?step=contact_information`,
                "referrerPolicy": "origin-when-cross-origin",
                form: form,
                "method": "POST",
                "mode": "cors",
                "credentials": "include",
                followAllRedirects:true,
                // resolveWithFullResponse: true 
                }).then(resp => resp)
                    .catch(e =>{console.log("Stock problems");SendMessage(this.taskID, 'Stock problems');this.deadEnd=true;clearInterval(this.inter)})
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        let ship = await this.request.get(`${this.url}/cart/shipping_rates.json?shipping_address[zip]=${this.profile.postCode.replace(" ","+")}&shipping_address[country]=${this.profile.country.replace(" ","+")}&shipping_address[province]=${this.profile.province}`, {
            "headers": {
                "User-Agent":this.userAgent,                
            },
            "referrer": `${this.url}/`,
            "referrerPolicy": "origin",
            "mode": "cors",
            "credentials": "include",
        }).catch(()=>{console.log("Stock problems");SendMessage(this.taskID, 'Stock Problems');this.deadEnd=true;clearInterval(this.inter)});
        ship = JSON.parse(ship);

        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        // console.log(await ship)
        if(ship.shipping_rates.length == 0){console.log("Unavailable to ship");SendMessage(this.taskID, 'Unavailable to ship');return};
        let ship_opt = ship["shipping_rates"][0]["name"]
        let ship_prc = ship["shipping_rates"][0]["price"]
        this.totalPrice = parseInt(await this.totalPrice) + parseInt(100*parseFloat(ship_prc));
        this.shippingOption = (encodeURIComponent(("shopify-" + ship_opt + "-" + ship_prc).replace(/ /g,"%20"))).replace("(","%28").replace(")","%29");
        // console.log(this.shippingOption)
        await this.request.post(this.checkoutUrl, {
            "headers": {
                "User-Agent":this.userAgent,                
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
            },
            "referrer": `${this.checkoutUrl}?previous_step=contact_information&step=shipping_method`,
            "referrerPolicy": "origin-when-cross-origin",
            "body": `_method=patch&authenticity_token=${this.authenticity_token}&previous_step=shipping_method&step=payment_method&checkout%5Bshipping_rate%5D%5Bid%5D=${this.shippingOption}&checkout%5Bclient_details%5D%5Bbrowser_width%5D=1349&checkout%5Bclient_details%5D%5Bbrowser_height%5D=600&checkout%5Bclient_details%5D%5Bjavascript_enabled%5D=1&checkout%5Bclient_details%5D%5Bcolor_depth%5D=24&checkout%5Bclient_details%5D%5Bjava_enabled%5D=false&checkout%5Bclient_details%5D%5Bbrowser_tz%5D=-180`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include",
            followAllRedirects:true,
            // resolveWithFullResponse: true 
            }).then(r=>{console.log("Shipping confirmed");SendMessage(this.taskID, 'Shipping confirmed','yellow');}).catch(e=>{console.log("out of stock",538);this.deadEnd=true;clearInterval(this.inter)});
            return await this.ConfirmPayment();
        }
    async ConfirmPayment(){
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        let paymentToken = await this.request.post("https://deposit.us.shopifycs.com/sessions", {
            "headers": {
                "User-Agent":this.userAgent,                
                "accept": "application/json",
                "accept-language": "ru-RU,ru;q=0.9",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://checkout.shopifycs.com/",
            "referrerPolicy": "origin-when-cross-origin",
            "body": `{\"credit_card\":{\"number\":\"${this.profile.cardNumber}\",\"name\":\"${this.profile.cardHolderName}\",\"month\":${this.profile.month},\"year\":${this.profile.year},\"verification_value\":\"${this.profile.cvv}\"},\"payment_session_scope\":\"${this.url.split("//")[1]}\"}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include",
            followAllRedirects:true,
            // resolveWithFullResponse: true 
            }).catch(e =>{console.log(e);this.deadEnd=true;clearInterval(this.inter)}); 
        if (!window.startShopifyMonitor || 
            this.deadEnd||
            checkForStop(this.taskID)){console.log("Some problems has been occurred");SendMessage(this.taskID, 'Some problems has been occurred');clearInterval(this.inter); return}
        paymentToken = JSON.parse(paymentToken)["id"] ;   
        // console.log(await paymentToken);
        // let transactionBody = {
        //     '_method':'patch',
        //     'authenticity_token':await this.authenticity_token,
        //     'previous_step':'payment_method',
        //     'step':'',
        //     's':await paymentToken,
        //     'checkout[payment_gateway]':this.checkoutGateway,
        //     'checkout[credit_card][vault]':false,
        //     'checkout[different_billing_address]':false,//Биллинг
        //     'checkout[remember_me]':false,
        //     'checkout[remember_me]':0,
        //     'checkout[shipping_address][phone]':`+${this.profile.phone}`,
        //     'checkout[total_price]':await this.totalPrice,
        //     'complete':1,
        //     'checkout[client_details][browser_width]': getRandomInt(1000,2000),
        //     'checkout[client_details][browser_height]': getRandomInt(600,1000),
        //     'checkout[client_details][javascript_enabled]': 1,
        //     'checkout[client_details][color_depth]': 24,
        //     'checkout[client_details][java_enabled]':false,
        //     'checkout[client_details][browser_tz]': -180,
        // }
        await this.request.post(this.checkoutUrl, {
            "headers": {
                "User-Agent":this.userAgent,                
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "ru-RU,ru;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            "referrer": `${this.checkoutUrl}?previous_step=shipping_method&step=payment_method`,
            "referrerPolicy": "origin-when-cross-origin",
            // 'form':transactionBody,
            "body": `_method=patch&authenticity_token=${this.authenticity_token}&previous_step=payment_method&step=&s=${paymentToken}&checkout%5Bpayment_gateway%5D=${this.checkoutGateway}&checkout%5Bcredit_card%5D%5Bvault%5D=false&checkout%5Bdifferent_billing_address%5D=false&checkout%5Bremember_me%5D=false&checkout%5Bremember_me%5D=0&checkout%5Bvault_phone%5D=%2B${this.profile.phone}&checkout%5Btotal_price%5D=${await this.totalPrice}&complete=1&checkout%5Bclient_details%5D%5Bbrowser_width%5D=1349&checkout%5Bclient_details%5D%5Bbrowser_height%5D=600&checkout%5Bclient_details%5D%5Bjavascript_enabled%5D=1&checkout%5Bclient_details%5D%5Bcolor_depth%5D=24&checkout%5Bclient_details%5D%5Bjava_enabled%5D=false&checkout%5Bclient_details%5D%5Bbrowser_tz%5D=-180`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include",
            followAllRedirects:true,
            // resolveWithFullResponse: true 
          }).then(()=>{console.log("Transaction completed");SendMessage(this.taskID, 'Transaction completed','green');clearInterval(this.inter)}).catch((e)=>{console.log("There is some problems with the transaction");SendMessage(this.taskID, 'Transaction problems');clearInterval(this.inter)});
    }
    async CheckCartStock(){
        this.inter = setInterval(async ()=>{
            let c= await this.request.get(`${this.url}/cart.json`,{
                "headers": {
                    "User-Agent":this.userAgent,
                }                
            }).then(r=>{
                return JSON.parse(r).item_count
            }).catch(()=>{})
            if (!c){
                this.deadEnd = true;
                clearInterval(this.inter)
            }
        },1000)
    }
    
}

class ShopifyMonitor {
    constructor(url,special){
        proxyQueue[url] = {
            "current":0,
            "proxies":proxy
        }
        this.url = url;
        this.special = special;
        // this.request = require("request-promise")
        // console.log(fs.existsSync(`./NetAioModules/shopify/OldData/OldData_${this.url.split("//")[1]}.json`));
        if (!fs.existsSync(`./OldData/OldData_${this.url.split("//")[1]}.json`) || fs.readFileSync(`./OldData/OldData_${this.url.split("//")[1]}.json`)==''){
            fetch(this.url+this.special.productsJson, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    // proxy:proxySwitch(url)
                },
            }).then(async r => {
                let text = await r.text()
                fs.writeFileSync(`./NetAioModules/shopify/OldData/OldData_${this.url.split("//")[1]}.json`,text);
                this.OldItems = KeySwap(JSON.parse(text))}).catch(e=>console.log(e))
        }
        else{
            this.OldItems = KeySwap(JSON.parse(fs.readFileSync(`./OldData/OldData_${this.url.split("//")[1]}.json`)))
            // this.OldItems = require(`./OldData/OldData_${this.url.split("//")[1]}.json`)
        }
    }
    async Parse(){
        // console.log(this.url);
        // if (!window.startShopifyMonitor) {console.warn("monitor stopped");return}
        // let tasks =JSON.parse(localStorage.getItem('tasks'))
        // for(let task in tasks){
        //     // console.log(tasks[task].stop,tasks[task].bypassIsRun[this.url]);
        //     if(!tasks[task].stop&&!tasks[task].bypassIsRun[this.url]){
        //         tasks[task].bypassIsRun[this.url]=true
        //         console.log("bypass");
        //         new BypassQueue(this.url,task).Control();
        //         localStorage.setItem('tasks',JSON.stringify(tasks))
        //     }

        // }
        let NewItems = {};
        let NewSizes = {};
        let products;
        // if(!SITES[this.url].available)return this.WaitingRoom()
        try{
            let resp = await fetch(this.url+this.special.productsJson, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
            }).catch(e=>console.log(e));
            // console.log(resp);
            // console.log(this.url);
            /**Udalil etu xalupu dobavit logger */
            products = KeySwap(await resp.json())
            // products = KeySwap(JSON.parse(resp));
            // const tasks = JSON.parse(localStorage.getItem('tasks'))
            /**CONSTANT ATTENTION */
            for (let item in products){
                let id = item
                let variants = products[id]["variants"];
                let Include = (name) => products[id]["title"].toLocaleLowerCase().includes(name);
                if (!Object.keys(this.OldItems).includes(id)){
                    /*New Arrival*/
                    NewItems[id] = products[item];
                    console.log(products[id].title)
                    let rndmSize=[]
                    // let tasks =JSON.parse(localStorage.getItem('tasks'))
                    for(let task in tasks){
                        const taskId = task
                        task = tasks[task]
                        if(!task.stop && 
                            task.filter.positive.every(Include)&&
                            !task.filter.negative.some(Include)){
                                SendMessage(taskId,products[id].title,'orange')
                                for (let size in variants){
                                    variants[size]["available"]?rndmSize.push(size):null;
                                }
                                if (task.mode == 'release'){
                                    for(let size in variants){
                                        // new Checkout(this.url,size,products[id].handle,SITES[this.url].special.profileName)
                                        new Checkout(this.url,
                                            size,
                                            products[id].handle,
                                            task.profile,
                                            taskId)
                                    }    
                                }
                                else{
                                    new Checkout(this.url,
                                        rndmSize[Math.floor(Math.random() * rndmSize.length)],
                                        products[id].handle,
                                        task.profile,
                                        taskId)
                                }
                        }
                    }

                }else if(Object.keys(this.OldItems).includes(id)){
                    for(let task in tasks){
                        const taskId = task
                        task = tasks[task]
                        if(!task.stop && 
                            task.filter.positive.every(Include)&&
                            !task.filter.negative.some(Include)){
                            for (let size in variants){

                                if ((!Object.keys(this.OldItems[id]["variants"]).includes(size) && variants[size]["available"])||
                                (Object.keys(this.OldItems[id]["variants"]).includes(size) && !this.OldItems[id]["variants"][size]["available"] && variants[size]["available"])){
                                    /*Restock*/
                                    SendMessage(taskId,products[id].title,'orange')
                                    NewSizes[id] = products[item];
                                    console.log(products[id].title);
                                    if (task.mode == 'release') {
                                        for(let size in variants){
                                            // variants[size]["available"]?new Checkout(this.url,size,products[id].handle,SITES[this.url].special.profileName):null;
                                            variants[size]["available"]?new Checkout(this.url,
                                                size,
                                                products[id].handle,
                                                task.profile,
                                                taskId):null;

                                        }            
                                    }
                                    else{
                                        // new Checkout(this.url,size,products[id].handle,SITES[this.url].special.profileName)
                                        new Checkout(this.url,
                                            size,
                                            products[id].handle,
                                            task.profile,
                                            taskId)
                                    }
                                }

                            }
                        }
                    }

                };
            }

        }
        catch(e){
            console.log(e);
        }
        finally{
            this.OldItems = products;
            try{
                if(this.OldItems){
                    fs.writeFile(`./NetAioModules/shopify/OldData/OldData_${this.url.split("//")[1]}.json`,JSON.stringify(this.OldItems),e=>e?console.log(e):null);}
                }
            catch{}
            setTimeout(async()=> await this.Parse(),SITES[this.url].special.timeout)

        }

    }    
    async WaitingRoom(){
        let i = setInterval(()=>{
            if (SITES[this.url].available){
                clearInterval(i);
                return this.Parse()
            }
        },1000)
    }
}

const Start = ()=>{
    for(let site in SITES){
        let special = SITES[site].special
        SITES[site].available?new ShopifyMonitor(site,special).Parse():null;
    }
}

/**
 * "https://Seld4v1ds0np:O1u2PlB@134.202.33.23:45785",
        "https://Seld4v1ds0np:O1u2PlB@181.215.217.212:45785",
        "https://Seld4v1ds0np:O1u2PlB@185.33.85.137:45785",
        "https://Seld4v1ds0np:O1u2PlB@191.101.148.187:45785",
        "https://Seld4v1ds0np:O1u2PlB@64.137.80.162:45785",
        "https://Seld4v1ds0np:O1u2PlB@102.129.240.104:45785",
        "https://Seld4v1ds0np:O1u2PlB@50.114.84.243:45785",
        "https://Seld4v1ds0np:O1u2PlB@154.16.87.102:45785",
        "https://Seld4v1ds0np:O1u2PlB@181.214.203.171:45785",
        "https://Seld4v1ds0np:O1u2PlB@191.96.58.241:45785"
    
 * 
 * 
 */

module.exports = {ShopifyMonitor, proxyQueue, Start}

