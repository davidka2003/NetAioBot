// import { ShopifyTask } from "./AddTask/AddTaskShopify";

import { BypassQueueLink, Checkout } from "../scripts/shopify/shopify";
import { SoleboxCheckout } from "../scripts/solebox/solebox";
import { SITES } from "../scripts/shopify/shopifyConfig";
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
    sizes:{
        [size:string]:boolean
    },
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
    shopType:"shopify",
    shopUrl?:string
    proxyProfile?:string
}

export interface SoleboxTaskInterface{
    isCustomSizes?:boolean,
    sizes:{
        [size:string]:boolean
    },
    __taskNumber:number,
    profile?:string,
    mode?:string,
    checked?:boolean,
    url?:string
    id?:string,
    checkoutsBypass?:/* no need */never,
    checkouts?:{
        [id:string]:SoleboxCheckout
    },
    currentCheckoutState?:{
        state:string,
        level:  "LOW"|"ERROR"|"SUCCESS"
    }
    isRun:false,
    retryOnFailure:boolean,
    checkoutsAmount:1|number,
    shopType:"solebox",
    proxyProfile?:string
}

export interface ProfileInterface{
    profileName:string,
    firstName:string,
    lastName:string,
    email:string,
    address1:string,
    address2:string,
    city:string,
    country:string,
    province:string,
    postCode:string,
    cardNumber:string,
    cardHolderName:string,
    month:string,
    year:string,
    cvv:string,
    phone:string,
}/* Removed ? */
export interface SettingsInterface{
    captchaKey?:string,
    discordWebhook?:string,
    monitorsDelay:number,
    monitorProxyProfile:string
}