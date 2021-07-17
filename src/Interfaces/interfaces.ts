// import { ShopifyTask } from "./AddTask/AddTaskShopify";

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
    checkouts?:{},
    checkoutsBypass?:{},
    currentCheckoutState?:{
        state:string,
        level:  "LOW"|"ERROR"|"SUCCESS"
    }
    isRun:false,
    retryOnFailure:boolean,
    checkoutsAmount:1|number,
    shop:"shopify"
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
    phone?:string
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
