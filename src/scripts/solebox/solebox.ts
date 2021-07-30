const request = require('cloudscraper');
import cheerio from 'cheerio';

import { ProfileInterface, SoleboxTaskInterface } from "../../Interfaces/interfaces";
import { store } from "../../store";
import { EDIT_CHECKOUT_STATE } from '../../store/tasksReducer';
const getProxy = (proxyProfile:string):string[]=>store.getState().proxy[proxyProfile].proxy
const getTasks = ():{[key:string]:SoleboxTaskInterface}=>{
    let tasks = store.getState().tasks
    let soleboxTasks = {}
    Object.keys(tasks).filter(task=>tasks[task].shop=='shopify').forEach(taskId=>soleboxTasks = {...soleboxTasks,[taskId]:tasks[taskId]})
    return soleboxTasks
}
const getProfile = (profile:string):ProfileInterface=>store.getState().profiles[profile]
const editCheckoutState = (taskId:string,state:{level: "LOW" | "ERROR" | "SUCCESS",state:string})=>store.dispatch({type:EDIT_CHECKOUT_STATE,payload:{taskId,message:state}})
let headers = {...request.defaultParams.headers,
    'Accept':"application/json, text/javascript, */*; q=0.01",
    'Accept-Language':'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Sec-fetch-dest": "empty",
    "Sec-fetch-mode": "cors",
    "Sec-fetch-site": "same-origin",
    "ReferrerPolicy": "strict-origin-when-cross-origin",
    "Mode": "cors",
    'X-Requested-With': 'XMLHttpRequest'
}
// request.debug = true;


let data = {
    shipping:{
        address1:'LOAD GmbH',
        address2:'Gartenfelder Str',
        firstName:'David',
        lastName:'Paley',
        zip:'13371',
        phone:'89119606989',
        email:'d4v1ds0n.p@gmail.com',
        country:'DE',
        city:'Berlin'
    },
    billing:{
        address1:'LOAD GmbH',
        address2:'Gartenfelder Str',
        firstName:'David',
        lastName:'Paley',
        zip:'13371',
        phone:'89119606989',
        email:'d4v1ds0n.p@gmail.com',
        country:'DE',
        city:'Berlin'
    }
}

interface dataInterface{
    address1:string,
    address2:string,
    firstName:string,
    lastName:string,
    postCode:string,
    phone:string,
    email:string,
    country:string,
    city:string
}

export class SoleboxCheckout{
    private stop = false
    private jar = request.jar()
    public checkoutUrl = ''
    readonly data:dataInterface=getProfile(this.profile)
    constructor(
        readonly taskId:string,
        readonly profile:string,
        readonly account:{
            email:string,
            password:string
        },
        readonly url:string,
        readonly size:string
    ){
        
        this.Login()
    }
    set setStop(value:boolean){
        this.stop=value

    }
    async Login(){
        if (this.stop) return
        let $ = cheerio.load(await request.get('https://www.solebox.com/de_DE/login',{headers,jar:this.jar}).catch(console.log)||'')
        let {scrf,id,idValue} = {
            scrf:$('input[name="csrf_token"]').attr('value'),
            id:$/*querySelector('#main').*/('span[data-id]').attr('data-id')||'',
            idValue:$/*querySelector('#main').*/('span[data-id]').attr('data-value')||''
        }
        if (this.stop) return
        headers = {...headers,'Referer': "https://www.solebox.com/de_DE/login"}
        console.log('Login success: '+
        await request.post("https://www.solebox.com/authentication?rurl=1&format=ajax", {
            headers,
            formData:{
                [id]:idValue,
                dwfrm_profile_customer_email:this.account.email,
                dwfrm_profile_login_password:this.account.password,
                dwfrm_profile_login_rememberme:'true',
                csrf_token:scrf
            },
            jar:this.jar,
            json:true,
            followAllRedirects:true,
            resolveWithFullResponse:true
        }).then((r:any)=>r.body.success).catch(console.log));
        return this.AddToCart()
    }
    async AddToCart(){
        let sizes:{[pid:string]:any} = {}
        let $ = cheerio.load(await request.get(this.url))
        let pid = $('button[data-pid]').attr('data-pid')||''
        sizes[pid] = {}
        $('.b-swatch-value-wrapper').toArray().forEach(element=>{
            const url = $(element).find('a')?.attr('data-href')
            const [id,size]= [url?.split('&dwvar_')[1].split('_')[1].split('=')[0]||'',url?.split('&dwvar_')[1].split('_')[1].split('=')[1]||'']
            sizes[pid][size]=[[{'optionId':id,'selectedValueId':size}],url]
            console.log(id,size)
        })
        let sizeId = (await request.get(`https://www.solebox.com${sizes[pid][this.size][1]}&format=ajax`, {
            headers,
            jar:this.jar,
            json:true
        }).catch(console.log))?.product.id
        headers = {...headers,'Referer': this.url}
        console.log('Size added successfully: '+!await request.post("https://www.solebox.com/de_DE/add-product?format=ajax", {
            headers,
            json:true,
            formData:{
                pid:sizeId,
                options:JSON.stringify(sizes[pid][this.size][0]),
                quantity:1
            },
            jar:this.jar,
            followRedirect: true,
            followAllRedirects: true, 
            simple: false 
        }).then((r:any)=>r.error).catch());
        return this.Checkout()    
    }
    async Checkout(){
        const $ = cheerio.load(await request.get('https://www.solebox.com/de_DE/checkout?',{headers,jar:this.jar}).catch(console.log))
        const {originalShipmentUUID,shipmentUUID,scrf,selector,addressId} = {
            originalShipmentUUID:$('input[name="originalShipmentUUID"]').val(),
            shipmentUUID: $('input[name="shipmentUUID"]').val(),
            scrf: $('input[name="csrf_token"]').val(),
            //**селектор работает, если уже есть сохраненный адрес */
            selector: $('input[name="address-selector"]')?.val(),
            addressId: $('input[type="radio"][name="address-selector"]').attr('data-id'),
        }
        const useBilling = true
        headers = {...headers,'Referer': "https://www.solebox.com/de_DE/checkout?stage=shipping"}
        let formData:{[key:string]:string}={
            originalShipmentUUID,
            shipmentUUID,
            dwfrm_shipping_shippingAddress_shippingMethodID:'home-delivery_europe',
            'address-selector':selector,
            dwfrm_shipping_shippingAddress_addressFields_title:'Herr',
            dwfrm_shipping_shippingAddress_addressFields_firstName:this.data.firstName,
            dwfrm_shipping_shippingAddress_addressFields_lastName:this.data.lastName,
            dwfrm_shipping_shippingAddress_addressFields_postalCode:this.data.postCode,
            dwfrm_shipping_shippingAddress_addressFields_city:this.data.city,
            dwfrm_shipping_shippingAddress_addressFields_street:this.data.address1,
            dwfrm_shipping_shippingAddress_addressFields_suite:this.data.address2,
            dwfrm_shipping_shippingAddress_addressFields_address1:[this.data.address1,this.data.address2].join(', '),
            dwfrm_shipping_shippingAddress_addressFields_address2:this.data.address2,
            dwfrm_shipping_shippingAddress_addressFields_phone:this.data.phone,
            dwfrm_shipping_shippingAddress_addressFields_countryCode:this.data.country,
            dwfrm_shipping_shippingAddress_addressFields_carrier:'dhl',
            dwfrm_shipping_shippingAddress_shippingAddressUseAsBillingAddress:'true'||'false',
            dwfrm_billing_billingAddress_addressFields_title:'Herr',
            dwfrm_billing_billingAddress_addressFields_firstName:useBilling?this.data.firstName:this.data.firstName,
            dwfrm_billing_billingAddress_addressFields_lastName:useBilling?this.data.lastName:this.data.lastName,
            dwfrm_billing_billingAddress_addressFields_postalCode:useBilling?this.data.postCode:this.data.postCode,
            dwfrm_billing_billingAddress_addressFields_city:useBilling?this.data.city:this.data.city,
            dwfrm_billing_billingAddress_addressFields_street:useBilling?this.data.address1:this.data.address1,
            dwfrm_billing_billingAddress_addressFields_suite:useBilling?this.data.address2:this.data.address2,
            dwfrm_billing_billingAddress_addressFields_address1:[useBilling?this.data.address1:this.data.address1,useBilling?this.data.address2:this.data.address2].join(', '),
            dwfrm_billing_billingAddress_addressFields_address2:useBilling?this.data.address2:this.data.address2,
            dwfrm_billing_billingAddress_addressFields_countryCode:useBilling?this.data.country:this.data.country,
            dwfrm_billing_billingAddress_addressFields_phone:useBilling?this.data.phone:this.data.phone,
            'dwfrm_contact-de_email':this.data.email,
            'dwfrm_contact-de_phone':this.data.phone,
            csrf_token:scrf
        }
        Object.keys(formData).forEach((key:string)=>formData[key]!=formData[key].replace(/ /g,'+'))
        await request.post(`https://www.solebox.com/on/demandware.store/Sites-solebox-Site/de_DE/CheckoutShippingServices-SubmitShipping?region=europe&country=${this.data.country}&addressId=${addressId}f&format=ajax`, {
            headers,
            formData,
            jar:this.jar
        }).catch(console.log);
        headers = {...headers,'Referer': "https://www.solebox.com/de_DE/checkout?stage=placeOrder"}
        await request.post("https://www.solebox.com/on/demandware.store/Sites-solebox-Site/de_DE/CheckoutServices-SubmitPayment?format=ajax", {
            headers: headers,
            formData: {
                dwfrm_billing_paymentMethod:'CREDIT_CARD',
                csrf_token:scrf
                },
            jar:this.jar
        }).catch(console.log);
        return await request.post("https://www.solebox.com/on/demandware.store/Sites-solebox-Site/de_DE/CheckoutServices-PlaceOrder?format=ajax", {
            headers,
            jar:this.jar,
            json:true
        }).then((r:any)=>{
            if (!r.error){
                this.checkoutUrl = r.continueUrl
                editCheckoutState(this.taskId,{level:'SUCCESS',state:r.continueUrl})
                return r.continueUrl
            }
            return 'error'
        }).catch(console.log);
    
    }

    // async Start(){
    //     console.log(await this.Login({...this.account}))
    //     console.log(await this.AddToCart({url:this.url,size:this.size}))
    //     console.log(await this.Checkout(this.data))
    // }
    
}



export class SoleBoxMonitor{
    constructor (
        readonly url:string
    ){

    }
    async Parse(){
        const tasks = getTasks()
        const sizes = await request.get(this.url,{headers}).then(
            (response:string)=>{
                let sizes:{[pid:string]:any} = {}
                const $ = cheerio.load(response)
                const pid = $('button[data-pid]').attr('data-pid')||''
                sizes[pid] = {}
                $('.b-swatch-value-wrapper').toArray().forEach(element=>{
                    const url = $(element).find('a')?.attr('data-href')
                    const [id,size]= [url?.split('&dwvar_')[1].split('_')[1].split('=')[0]||'',url?.split('&dwvar_')[1].split('_')[1].split('=')[1]||'']
                    size?sizes[pid][size]=[[{'optionId':id,'selectedValueId':size}],url]:null
                })
                return sizes     
            }
        )
        for (const task of Object.keys(tasks)) {
            const taskSizes = Object.keys(tasks[task].sizes).filter(size=>tasks[task].sizes[size])
            if (tasks[task].url==this.url) {
                for (const size of Object.keys(sizes)) {
                    if (taskSizes.includes(size)) {
                        /* new checkout */
                    }
                }
            }
        }
        console.log(sizes)
        return sizes
    }
}


// new SoleBoxCheckout({
//     data,
//     url:'https://www.solebox.com/de_DE/p/nike-off-white_rubber_dunk_%28td%29-white%2Funiversity_blue-white-02007884.html',
//     size:'17',
//     account:{
//         email:'d4v1ds0n.p@gmail.com',
//         password:'Dav20030204'
//     }
// }).Start()

// debugger
// cloudscraper.debug = false;
// const headers = Object.assign({}, cloudscraper.defaultParams.headers);


// let Register = async ({firstName,lastName,email,password})=>{
//     let doc = await cloudscraper.get('https://www.solebox.com/de_DE/registration?rurl=1',{
//         headers
//     })
//     doc = new jsdom.JSDOM(doc).window.document
//     let scrf = doc.querySelector('input[name="csrf_token"]').value
//     let id = doc.querySelector('#main').querySelector('span[data-id]').getAttribute('data-id')
//     let idValue = doc.querySelector('#main').querySelector('span[data-id]').getAttribute('data-value')
//     Object.assign(headers, {
//         'Referer': "https://www.solebox.com/de_DE/registration?rurl=1",
//         "x-requested-with": "XMLHttpRequest"
//     })    
//     return 'Success: ' + await cloudscraper.post('https://www.solebox.com/on/demandware.store/Sites-solebox-Site/de_DE/Account-SubmitRegistration?rurl=1&format=ajax',{
//         headers,
//         formData:{
//             [id]:idValue,
//             dwfrm_profile_register_title: 'Herr',
//             dwfrm_profile_register_firstName:firstName,
//             dwfrm_profile_register_lastName:lastName,
//             dwfrm_profile_register_email:email,
//             dwfrm_profile_register_emailConfirm:email,
//             dwfrm_profile_register_password:password,
//             dwfrm_profile_register_passwordConfirm:password,
//             dwfrm_profile_register_phone:'',
//             dwfrm_profile_register_birthday:'',
//             dwfrm_profile_register_acceptPolicy:'true',
//             csrf_token:scrf
//         },
//         json:true,
//         followAllRedirects:true,
//         resolveWithFullResponse:true

//     }).then(r=>r.body.success)


// }
