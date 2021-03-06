export const SITES:{[site:string]:{
    checkoutGateway:number,
    extraHeaders?:any,
    available?:boolean,
    special?:any
}} = {  "https://www.shoepalace.com":{
    "checkoutGateway":39578599470,

    },
          
        "https://nrml.ca":{
            "extraHeaders":{
                "checkout[pick_up_in_store][selected]":false,
                "checkout[id]": "delivery-shipping"
                },
            "checkoutGateway":75922051,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://kith.com":{
            "extraHeaders":{},
            "checkoutGateway":128707719,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://eu.kith.com":{
            "extraHeaders":{},  
            "checkoutGateway":11,
            "available":false,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 2"
            }
        },
        "https://www.deadstock.ca":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":8308339,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://packershoes.com":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":3723727,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 2"
            }
        },
        "https://sneakerpolitics.com":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":6692225,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://shopnicekicks.com":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":6735901,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"kicks"
            }
        },
        "https://bdgastore.com":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":3923843,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://www.a-ma-maniere.com":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":26102467,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://www.jimmyjazz.com":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":37105762413,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://cncpts.com":{
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":24945229893,
            "available":false,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://www.apbstore.com":{ 
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":9556131876,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://www.socialstatuspgh.com":{ 
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":18736001,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://shop-us.doverstreetmarket.com":{ 
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":58262978712,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://www.onenessboutique.com":{ 
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":3919159,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://www.saintalfred.com":{ 
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":3953145,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        },
        "https://extrabutterny.com":{ 
            "extraHeaders":{
                "checkout[shipping_address][company]":""
            },
            "checkoutGateway":18505281,
            "available":true,
            "special":{
                "productsJson":"/products.json?limit=99999",
                "timeout":2000,
                "profileName":"profile 1"
            }
        }

    }
export const webhook = "https://discord.com/api/webhooks/872866569393414186/TZeXP92KMryC9dFFFSXqqRu9FscN4OI9rFIbf62Tc5F_jsMOogR1OMGn93MdnPirayL_"