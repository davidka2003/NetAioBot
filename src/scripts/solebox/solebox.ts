let cloudscraper = require('cloudscraper');
const jsdom = require('jsdom')        
let headers = {...cloudscraper.defaultParams.headers,
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
// cloudscraper.debug = false;


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



class SoleBoxCheckout{
    constructor({
        data,
        url,
        size,
        account
    }){
        this.data = data
        this.url = url,
        this.size = size
        this.account = account
        const jar = cloudscraper.jar()
        cloudscraper = cloudscraper.defaults({jar,headers})//  defaultParams.jar;
    }
    async Login({email,password}){
        let doc = new jsdom.JSDOM(await cloudscraper.get('https://www.solebox.com/de_DE/login').catch(e=>ee)).window.document
        let {scrf,id,idValue} = {
            scrf:doc.querySelector('input[name="csrf_token"]').value,
            id:doc./*querySelector('#main').*/querySelector('span[data-id]').getAttribute('data-id'),
            idValue:doc./*querySelector('#main').*/querySelector('span[data-id]').getAttribute('data-value')
        }
        headers = {...headers,'Referer': "https://www.solebox.com/de_DE/login"}
        return 'Login success: '+await cloudscraper.post("https://www.solebox.com/authentication?rurl=1&format=ajax", {
            headers,
            formData:{
                [id]:idValue,
                dwfrm_profile_customer_email:email,
                dwfrm_profile_login_password:password,
                dwfrm_profile_login_rememberme:'true',
                csrf_token:scrf
            },
            json:true,
            followAllRedirects:true,
            resolveWithFullResponse:true
        }).then(r=>r.body.success);
    }
    async AddToCart({url,size}){
        let sizes = {}
        let doc = new jsdom.JSDOM(await cloudscraper.get(url)).window.document
        let pid = doc.querySelector('button[data-pid]').getAttribute('data-pid')
        sizes[pid] = {}
        doc.querySelectorAll('.b-swatch-value-wrapper').forEach(element=>{
            let url = element.querySelector('a')?.getAttribute('data-href')
            const [id,size]= [url?.split('&dwvar_')[1].split('_')[1].split('=')[0],url?.split('&dwvar_')[1].split('_')[1].split('=')[1]]
            sizes[pid][size]=[[{'optionId':id,'selectedValueId':size}],url]
            console.log(id,size)
        })
        let sizeId = (await cloudscraper.get(`https://www.solebox.com${sizes[pid][size][1]}&format=ajax`, {
            headers: headers,
            json:true
        }).catch(e=>e))?.product.id
        headers = {...headers,'Referer': url}
        return 'Size added successfully: '+!await cloudscraper.post("https://www.solebox.com/de_DE/add-product?format=ajax", {
            headers,
            json:true,
            formData:{
                pid:sizeId,
                options:JSON.stringify(sizes[pid][size][0]),
                quantity:1
            },
            followRedirect: true,
            followAllRedirects: true, 
            simple: false 
        }).then(r=>r.error).catch(e=>e);    
    }
    async Checkout(data){
        let doc = new jsdom.JSDOM(await cloudscraper.get('https://www.solebox.com/de_DE/checkout?')).window.document
        let {originalShipmentUUID,shipmentUUID,scrf,selector,addressId} = {
            originalShipmentUUID:doc.querySelector('input[name="originalShipmentUUID"]').value,
            shipmentUUID: doc.querySelector('input[name="shipmentUUID"]').value,
            scrf: doc.querySelector('input[name="csrf_token"]').value,
            //**селектор работает, если уже есть сохраненный адрес */
            selector: doc.querySelector('input[name="address-selector"]').value,
            addressId: doc.querySelector('input[type="radio"][name="address-selector"]').getAttribute('data-id'),
        }
        let useBilling = true
        headers = {...headers,'Referer': "https://www.solebox.com/de_DE/checkout?stage=shipping"}
        let formData={
            originalShipmentUUID,
            shipmentUUID,
            dwfrm_shipping_shippingAddress_shippingMethodID:'home-delivery_europe',
            'address-selector':selector,
            dwfrm_shipping_shippingAddress_addressFields_title:'Herr',
            dwfrm_shipping_shippingAddress_addressFields_firstName:data.shipping.firstName,
            dwfrm_shipping_shippingAddress_addressFields_lastName:data.shipping.lastName,
            dwfrm_shipping_shippingAddress_addressFields_postalCode:data.shipping.zip,
            dwfrm_shipping_shippingAddress_addressFields_city:data.shipping.city,
            dwfrm_shipping_shippingAddress_addressFields_street:data.shipping.address1,
            dwfrm_shipping_shippingAddress_addressFields_suite:data.shipping.address2,
            dwfrm_shipping_shippingAddress_addressFields_address1:[data.shipping.address1,data.shipping.address2].join(', '),
            dwfrm_shipping_shippingAddress_addressFields_address2:data.shipping.address2,
            dwfrm_shipping_shippingAddress_addressFields_phone:data.shipping.phone,
            dwfrm_shipping_shippingAddress_addressFields_countryCode:data.shipping.country,
            dwfrm_shipping_shippingAddress_addressFields_carrier:'dhl',
            dwfrm_shipping_shippingAddress_shippingAddressUseAsBillingAddress:JSON.stringify(useBilling),
            dwfrm_billing_billingAddress_addressFields_title:'Herr',
            dwfrm_billing_billingAddress_addressFields_firstName:useBilling?data.billing.firstName:data.shipping.firstName,
            dwfrm_billing_billingAddress_addressFields_lastName:useBilling?data.billing.lastName:data.shipping.lastName,
            dwfrm_billing_billingAddress_addressFields_postalCode:useBilling?data.billing.zip:data.shipping.zip,
            dwfrm_billing_billingAddress_addressFields_city:useBilling?data.billing.city:data.shipping.city,
            dwfrm_billing_billingAddress_addressFields_street:useBilling?data.billing.address1:data.shipping.address1,
            dwfrm_billing_billingAddress_addressFields_suite:useBilling?data.billing.address2:data.shipping.address2,
            dwfrm_billing_billingAddress_addressFields_address1:[useBilling?data.billing.address1:data.shipping.address1,useBilling?data.billing.address2:data.shipping.address2].join(', '),
            dwfrm_billing_billingAddress_addressFields_address2:useBilling?data.billing.address2:data.shipping.address2,
            dwfrm_billing_billingAddress_addressFields_countryCode:useBilling?data.billing.country:data.shipping.country,
            dwfrm_billing_billingAddress_addressFields_phone:useBilling?data.billing.phone:data.shipping.phone,
            'dwfrm_contact-de_email':data.shipping.email,
            'dwfrm_contact-de_phone':data.shipping.phone,
            csrf_token:scrf
        }
        Object.keys(formData).forEach(key=>formData[key]=formData[key].replace(/ /g,'+'))
        try {
            await cloudscraper.post(`https://www.solebox.com/on/demandware.store/Sites-solebox-Site/de_DE/CheckoutShippingServices-SubmitShipping?region=europe&country=undefined&addressId=${addressId}f&format=ajax`, {
                headers,
                formData
            }).catch(e=>console.log("Shipping submit error"));
        
        } catch (error) {

            console.log("Shipping submit error");
        }
        headers = {...headers,'Referer': "https://www.solebox.com/de_DE/checkout?stage=placeOrder"}
        await cloudscraper.post("https://www.solebox.com/on/demandware.store/Sites-solebox-Site/de_DE/CheckoutServices-SubmitPayment?format=ajax", {
            headers: headers,
            formData: {
                dwfrm_billing_paymentMethod:'CREDIT_CARD',
                csrf_token:scrf
                },
        }).catch();
        return await cloudscraper.post("https://www.solebox.com/on/demandware.store/Sites-solebox-Site/de_DE/CheckoutServices-PlaceOrder?format=ajax", {
            headers,
            json:true
        }).then(r=>{
            if (!r.error){
                return r.continueUrl
            }
            return 'error'
        }).catch();
    
    

    }

    async Start(){
        console.log(await this.Login({...this.account}))
        console.log(await this.AddToCart({url:this.url,size:this.size}))
        console.log(await this.Checkout(this.data))
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
