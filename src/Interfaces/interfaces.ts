// import { ShopifyTask } from "./AddTask/AddTaskShopify";

export interface ActionInterface {
  type: string;
  payload: any;
}
export interface SettingsInterface {
  captchaKey: string;
  licenseKey: string;
}
export interface ProxyProfileInterface {
  profileName: string | 'noProxy';
  proxy: string[];
}
export interface ShopifyTaskInterface {
  isCustomSizes?: boolean;
  sizes: any;
  __taskNumber: number;
  profile: string;
  mode: '24/7' | 'release';
  checked: boolean;
  positive: string[];
  negative: string[];
  taskId: string;
  checkouts: {
    [checkoutId: string]: any;
    /* edit type to checkout type */
  };
  checkoutsBypass: {
    [shopUrl: string]: {
      [checkoutBypassId: string]: {
        bypass: any;
        used: boolean;
      };
    };
  };
  currentCheckoutState?: {
    state: string;
    level: 'LOW' | 'ERROR' | 'SUCCESS';
  };
  isRun: boolean;
  retryOnFailure: boolean;
  checkoutsAmount: 1 | number;
  shop: 'shopify';
  proxyProfile?: string;
}

export interface ProfileInterface {
  profileName: string;
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  province: string;
  postCode: string;
  cardNumber: string;
  cardHolderName: string;
  month: string;
  year: string;
  cvv: string;
  phone: string;
}
// export interface ContextPattern {
//   profiles?: {
//     profileName?: string;
//     firstName?: string;
//     lastName?: string;
//     email?: string;
//     address1?: string;
//     address2?: string;
//     city?: string;
//     country?: string;
//     province?: string;
//     postCode?: string;
//     cardNumber?: string;
//     cardHolderName?: string;
//     month?: string;
//     year?: string;
//     cvv?: string;
//   };
//   tasks?: { string: ShopifyTaskInterface };
// }
