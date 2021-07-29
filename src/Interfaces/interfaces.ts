// import { ShopifyTask } from "./AddTask/AddTaskShopify";

import { BypassQueueLink, Checkout } from "../scripts/shopify/shopify";

export interface ActionInterface{
    type:string,
    payload:any
}

export interface ProxyProfileInterface{
    profileName:string|"noProxy",
    proxy:string[]
}
export interface ShopifyTaskInterface{
    isCustomSizes?:boolean,
    sizes:any,
    __taskNumber:number,
    profile?:string,
    mode?:string,
    checked?:boolean,
    positive?:string[],
    negative?:string[],
    id?:string,
    checkouts?:{
        [id:string]:Checkout
    },
    checkoutsBypass?:{
        [url:string]:{
            [id:string]:{
                bypass:BypassQueueLink,
                used:boolean
            }

        }
    },
    currentCheckoutState?:{
        state:string,
        level:  "LOW"|"ERROR"|"SUCCESS"
    }
    isRun:false,
    retryOnFailure:boolean,
    checkoutsAmount:1|number,
    shop:"shopify",
    proxyProfile?:string
}

export interface SoleboxTaskInterface{
    isCustomSizes?:boolean,
    sizes:any,
    __taskNumber:number,
    profile?:string,
    mode?:string,
    checked?:boolean,
    url?:string
    id?:string,
    checkouts?:{},
    currentCheckoutState?:{
        state:string,
        level:  "LOW"|"ERROR"|"SUCCESS"
    }
    isRun:false,
    retryOnFailure:boolean,
    checkoutsAmount:1|number,
    shop:"solebox",
    proxyProfile?:string
}

export interface ProfileInterface{
    profileName?:string,
    firstName?:string,
    lastName?:string,
    email?:string,
    address1?:string,
    address2?:string,
    city?:string,
    country?:string,
    province?:string,
    postCode?:string,
    cardNumber?:string,
    cardHolderName?:string,
    month?:string,
    year?:string,
    cvv?:string,
    phone?:string,
}
export interface ContextPattern{
    profiles?:{
        profileName?:string,
        firstName?:string,
        lastName?:string,
        email?:string,
        address1?:string,
        address2?:string,
        city?:string,
        country?:string,
        province?:string,
        postCode?:string,
        cardNumber?:string,
        cardHolderName?:string,
        month?:string,
        year?:string,
        cvv?:string
    }
    tasks?:{string:ShopifyTaskInterface}
}
