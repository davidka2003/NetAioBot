import { ipcRenderer } from 'electron';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import '../../scss/buttons.global.scss';
import '../../scss/input.global.scss';
import '../../scss/background.global.scss';
import './scss/settings.global.scss';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_SETTINGS, SettingsDispatcher } from '../../store/settingsReducer';
import { Dispatch } from 'redux';
import { AUTHSERVER } from '../../index';
import { useAppSelector } from '../../store';

export const logout = () => console.log(AUTHSERVER);
// fetch(`${AUTHSERVER}/auth/logout`, {
//     "headers": {
//         "accept": "*/*",
//         "accept-language": "ru",
//         "content-type": "application/json",
//     },
//     "referrerPolicy": "no-referrer-when-downgrade",
//     "body": JSON.stringify({
//         key:localStorage.getItem("key")
//     }),
//     "method": "POST",
//     "mode": "cors",
//     "credentials": "omit"
//     }).then((r:any)=>r.json()).then(r=>{
//     if (r.success) {
//         localStorage.removeItem("key")
//         // ipcRenderer.send('deleteKey')
//         // ipcRenderer.send('logout')
//         console.log("logged out")
//     }
//     else throw new Error("Failed to log out")
// }).catch((e:any)=>console.log(e))

const Settings = () => {
  const dispatch: (arg: {
    type: string;
    payload: any;
  }) => Dispatch<typeof arg> = useDispatch();
  const settingsStorage = useAppSelector((state) => state.settings);
  const [settings, setSettings] = useState(settingsStorage);
  const logoutHandler = (event: FormEvent) => {
    event.preventDefault();
    logout();
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let currentSettings = { ...settings };
    event.target.id == 'captchaKey' || event.target.id == 'licenseKey'
      ? (currentSettings[event.target.id] = event.target.value)
      : null;
    setSettings(currentSettings);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(
      SettingsDispatcher('EDIT_SETTINGS', { ...settings })
      /* { type: EDIT_SETTINGS, payload: { ...settings } } */
    );
  };
  // dispatch({type:EDIT_TASK,payload:{...edit}})
  return (
    <div
      className="tab-pane fade"
      id="v-pills-settings"
      role="tabpanel"
      aria-labelledby="v-pills-settings-tab"
    >
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <br />
      <div className="container row">
        <div className="col-3">
          <img src="./images/logo 150px .jpg" className="rounded" alt="..." />
        </div>
        <form onSubmit={handleSubmit} className="col-8">
          <h2 className="">Settings</h2>
          <h6 className="">Captha Key</h6>
          <input
            onChange={handleChange}
            value={settings?.captchaKey}
            className="net_input"
            type="text"
            id="captchaKey" /* required */
          />
          <button
            type="submit"
            className="net_button_primary"
            id="saveSettings"
          >
            Save
          </button>
        </form>
        <div className="footer">
          <button
            onClick={logoutHandler}
            className="net_button_danger logout_button"
            id="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
