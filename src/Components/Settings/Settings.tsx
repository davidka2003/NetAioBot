import React from 'react'
import '../../scss/buttons.global.scss'
import '../../scss/input.global.scss'
import '../../scss/background.global.scss'
import './scss/settings.global.scss'

const Settings = () => {
    return (
        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
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
            <div className="col-8">
              <h2 className="">Settings</h2>
              <h6 className="">Captha Key</h6>
              <input className="net_input" type="text"  id="capthaKey" required />
              <button className="net_button_primary" id="saveSettings">Сохранить</button>
            </div>
            <div className="footer">
              <button className="net_button_danger" id="logout">Logout</button>
            </div>
          </div>
        </div>
      )
    }
export default Settings
