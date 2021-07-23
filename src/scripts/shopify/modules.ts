import { store } from "../../store";

const ac = require("@antiadmin/anticaptchaofficial");
const AntiCaptchaApiKey = store.getState().settings.captchaKey
const cheerio = require('cheerio');
ac.setAPIKey(AntiCaptchaApiKey);

export const checkForCaptcha = async (response:any)=>{
    let respBody = cheerio.load(await response.body)
    let htmlString = respBody.html()
    let websitekey
    switch (true) {
        case htmlString.includes('g-recaptcha'):
            websitekey = htmlString.split("api/fallback?k=")[1].split('"')[0]
            return {"g-recaptcha-response":await ac.solveRecaptchaV2Proxyless(response.request.href, websitekey)
            .then((gresponse:any) => {
                console.log("Recaptcha solved");
                return gresponse
            })
            .catch((error:any) => {
                console.log('test received error '+error)
                return null
            })}
        case htmlString.includes("hcaptcha"):
            let scripts = [...respBody('script')]
            websitekey = scripts.filter((element:any)=>element.children[0]?.data.includes('sitekey'))[0].split("sitekey")[1].split(",")[0].replace(/ |"|:|`|'/g,"")
            let hcaptcha_data = respBody('input#hcaptcha_data').attr('value')
            let answ1 = ac.solveHCaptchaProxyless(response.request.href, websitekey)
            .then((hresponse:any) => {
                console.log("Hcaptcha solved");
                return hresponse
            })
            .catch((error:any) => {
                console.log('test received error '+error)
                return null
            });
            let answ2 = ac.solveHCaptchaProxyless(response.request.href, websitekey)
            .then((hresponse:any) => {
                console.log("Hcaptcha solved");
                return hresponse
            })
            .catch((error:any) => {
                console.log('test received error '+error)
                return null
            });
            return {
                "h-captcha-response": await answ1,
                "hcaptcha_challenge_response_token": await answ2,
                "hcaptcha_data":hcaptcha_data
            }
        default:
            return {}
    }
}


