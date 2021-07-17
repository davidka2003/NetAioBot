import React from 'react'

const Settings = () => {
    return (
        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
          <br />
          <div className="container row">
            <div className="col-3">
              <img src="./images/logo 150px .jpg" className="rounded" alt="..." />
            </div>
            <div className="col-8">
              <h4 className="text-light">Настройки</h4>
              <br />
              <label htmlFor="capthaKey" className="form-label text-light">Ключ от капчи</label>
              <input type="text" className="form-control" id="capthaKey" required />
              <br />
              <button className="btn btn-primary btn-md col-4" id="saveSettings">Сохранить</button>
            </div>
            <br />
            <div className="footer">
              <button className="btn btn-danger btn-sm col-2" id="logout">Logout</button>
            </div>
          </div>
        </div>
      )
    }
export default Settings