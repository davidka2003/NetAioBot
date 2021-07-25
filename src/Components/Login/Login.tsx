
import { ipcRenderer } from 'electron'
import { remote } from 'electron'
import React, { ChangeEvent, FormEvent, useEffect,useState } from 'react'
const Login = () => {
    const [key, setkey] = useState(localStorage.getItem("key")||'')
    // let windows = remote.BrowserWindow.getAllWindows()
    // windows.forEach((window,id)=>window.show())

    const login = ()=> 
    fetch("http://localhost:5000/auth/login", {
        "headers": {
            "accept": "*/*",
            "accept-language": "ru",
            "content-type": "application/json",
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": JSON.stringify({
            key
          }),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
        }).then((r:any)=>r.json()).then(r=>{
        if (r.success) {/* reverse */
            localStorage.setItem("key",key)
            ipcRenderer.send('setKey',key)
            console.log("logged in")
            let currentWindow = remote.BrowserWindow.getFocusedWindow()
            let windows = remote.BrowserWindow.getAllWindows()
            windows.forEach((window,id)=>id==currentWindow?.id?null:window.show())
            currentWindow?.hide()

            // main()
        }
        else throw new Error("Failed to log in")
    }).catch((e:any)=>console.log(e))
    const loginHandler = (event:FormEvent)=>{
        event.preventDefault()
        login()
    }
    return (
        <div>
            <form onSubmit={loginHandler}>
                <div className='container'>
                <h2>NetAio</h2>
                  <input className='net_input' placeholder='your key' value={key} onChange={(event:ChangeEvent<HTMLInputElement>)=>setkey(event?.target.value)} id="key" type="text" />
                  <div className='text-center'>
                    <button className='net_button_primary' type="submit">Login</button>
                  </div>
                </div>
            </form>
        </div>
    )
}

export default Login
