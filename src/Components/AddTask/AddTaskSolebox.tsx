import React from 'react'
import {useState} from 'react'
import {sizes} from './AddTask'
const AddTaskSolebox = () => {
    return (
        <div className="container row">
        <div className="container col-1" />
        <div className="container col-10">
        <form className="needs-validation" id="createTaskForm">
            <div className="row g-6">
            <h2 className=" text-center">Solebox</h2>
            <div className="col">
                <label htmlFor="positive" className="form-label ">Product Link</label>
                <input type="text" className="net_input" id="positive" required />
            </div>
            </div>
            <br />
            <div className="col ">
            <div className="form-check">
                <input className="net_radio" type="radio" name="flexRadioDefault" id="allSizesSolebox" defaultChecked />
                <label className="form-check-label" htmlFor="allSizesSolebox">
                All sizes
                </label>
            </div>
            <div className="form-check">
                <input className="net_radio" type="radio" name="flexRadioDefault" id="customSizesSolebox" data-bs-toggle="collapse" href="#collapseSolebox" role="button" aria-expanded="false" aria-controls="collapseExample" />
                <label className="form-check-label" htmlFor="customSizesSolebox">
                Custom sizes
                </label>
            </div>
            <div>
                <div className="collapse text-dark" id="collapseSolebox">
                <div className="card card-body">
                {
                        sizes.map((size,index)=>{
                            return (
                                <div className="form-check" key={index}>
                                <input className="form-check-input" type="checkbox" id="4us" />
                                <label className="form-check-label" htmlFor="4us">
                                    {size} us
                                </label>
                                </div>
                            )
                        })
                    }
                </div>
                </div>
            </div>
            </div>
            <br />
            <div className="row g-3">
            <div className="col">
                <label htmlFor="number" className="form-label ">Кол-во тасков</label>
                <input type="text" className="net_input" id="number" required />
            </div>
            <div className="col">
                <label htmlFor="profile" className="form-label ">Profile</label>
                <select className="net_select" id="profile" required>
                <option >Выбрать...</option>
                {/* <option>Профиль 1</option> */}
                </select>
            </div>
            <div className="col">
                <label htmlFor="mode" className="form-label ">Mode</label>
                <select className="net_select" id="mode" required>
                  <option >Выбрать...</option>
                  <option>release</option>
                  <option>24/7</option>
                </select>
            </div>
            <div className="col">
                <label htmlFor="proxyProfile" className="form-label ">Proxy</label>
                <select className="net_select" id="proxyProfile" required>
                <option >Выбрать...</option>
                <option>Профиль 1</option>
                <option>Профиль 2</option>
                </select>
            </div>
            </div>
            <br />
            <button className="net_button_primary" id="newSoleboxTaskButton">Save</button>
            <br />
        </form>
        </div>
        <div className="container col-1" />
    </div>

    )
}

export default AddTaskSolebox
