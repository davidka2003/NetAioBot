import React, { useEffect,useState } from 'react'


const Raffles = () => {

    return (
    <div className="tab-pane fade" id="v-pills-raffles" role="tabpanel" aria-labelledby="v-pills-raffles-tab">
      <div className='container'>
        <h2>Travis Scott</h2>
        <div className='row'>
          <div className='col-6'>
            <div >Number of registered applications:</div>
            <h1 id=''>30000</h1>
            <div>Number of emails</div>
            <h3>30000</h3>
            <div> Errors:</div>
            <h3>20</h3>
            <button className='net_button_primary'>Start</button>
            <button className='net_button_primary'>Stop</button>
          </div>
          <div className='col-6'>
            <div className='row'>
              <div className='col-3'>
                <label htmlFor="profile">Profile</label>
                <select className='net_select' id="Profile">
                  <option value="">Select...</option>
                  <option ></option>
                </select>
              </div>
              <div className='col-3'>
                <label htmlFor="profile">Proxy profile</label>
                <select className='net_select' id="proxyProfile">
                  <option value="">Select...</option>
                  <option ></option>
                </select>
              </div>
              <div className='col-3'>
                <label htmlFor="profile">Profile</label>
                <select className='net_select'>
                  <option value="">Select...</option>
                  <option ></option>
                </select>
              </div>
            </div>
            <button className='net_button_primary'>Save</button>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Raffles
