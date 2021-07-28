import React, { ChangeEvent, FormEvent } from 'react'
import {useState} from 'react'
import { useDispatch } from 'react-redux'
import { ProfileInterface } from '../../Interfaces/interfaces'
import '../../scss/input.global.scss'
import '../../scss/buttons.global.scss'
import { ADD_PROFILE } from '../../store/profilesReducer'
import { Dispatch } from 'redux'


const AddProfiles = () => {
    // const [context, setcontext] = useContext<any>(Context)
    const [profile, setprofile] = useState<ProfileInterface>({})
    const dispatch:(arg:{type:string,payload:any})=>Dispatch<typeof arg> = useDispatch()

    let handleSubmit = (event:FormEvent)=>{
        event.preventDefault()
        dispatch({type:ADD_PROFILE,payload:{
            ...profile
        }})
        // let currentprofile = {...profile}
        // setprofile(currentprofile)
        // let currentcontext = {...context}
        // let profiles = {...currentcontext.profiles,[currentprofile.profileName!]:currentprofile}
        // currentcontext['profiles'] = profiles
        // setcontext(currentcontext)
        // localStorage.setItem('profiles',JSON.stringify(profiles))
    }
    let handleChange = (event:ChangeEvent<HTMLInputElement>)=>{
        let currentprofile = {...profile}
        setprofile({...currentprofile,[event.target.name]:event.target.value})
    }
    return (
        <div className="container">
        <div className="row">
        <div className="col-12">
            <p>
            <button className="net_button_primary" type="button" data-toggle="collapse" data-target="#EpicCollapse" aria-expanded="false" aria-controls="EpicCollapse" id="AddProfile" >Add new profile</button>
            </p>
            <div className="collapse" id="EpicCollapse">
            <form onSubmit={handleSubmit} className="needs-validation form-inline" name="AddProfile">
                <div className="card card-body">
                <div className="container row g-6" id="NewAddress">
                    <div className="col">
                    <h4 /*htmlFor="profileName"*/ className="form-label">Название профиля</h4>
                    <input onChange={handleChange} value={profile.profileName} className='net_input' type="text" name="profileName" placeholder="Название профиля" required />
                    </div>
                    <h4 className="mb-3">Адрес доставки</h4>
                    <div className="col-6">
                    <label htmlFor="firstName" className="form-label">Имя</label>
                    <input onChange={handleChange} value={profile.firstName} className='net_input' type="text" name="firstName" placeholder="Имя" required />
                    {/* <div class="invalname-feedback">
                                Valid first name is required.
                            </div> */}
                    </div>
                    <div className="col-6">
                    <label htmlFor="lastName" className="form-label">Фамилия</label>
                    <input onChange={handleChange} value={profile.lastName} className='net_input' type="text" name="lastName" placeholder="Фамилия" required />
                    {/* <div class="invalid-feedback">
                                Valid last name is required.
                            </div> */}
                    </div>
                    <div className="col-12">
                    <label htmlFor="email" className="form-label">Email <span className="text-muted" /></label>
                    <input onChange={handleChange} value={profile.email} className='net_input' type="email"  name="email" placeholder="email" required />
                    {/* <div class="invalid-feedback">
                                Please enter a valid email address for shipping updates.
                            </div> */}
                    </div>
                    <div className="col-6">
                    <label htmlFor="address1" className="form-label">Адрес</label>
                    <input onChange={handleChange} value={profile.address1} className='net_input' type="text" name="address1" placeholder="Адрес" required />
                    {/* <div class="invalid-feedback">
                                Please enter your shipping address.
                            </div> */}
                    </div>
                    <div className="col-6">
                    <label htmlFor="address2" className="form-label">Адрес 2 <span className="text-muted" /></label>
                    <input onChange={handleChange} value={profile.address2} className='net_input' type="text"  name="address2" placeholder="Адрес 2" required />
                    </div>
                    <div className="col-3">
                    <label htmlFor="city" className="form-label">Город <span className="text-muted" /></label>
                    <input onChange={handleChange} value={profile.city} className='net_input' type="text"  name="city" placeholder="Город" required />
                    </div>
                    <div className="col-3">
                    <label htmlFor="phone" className="form-label">Телефон <span className="text-muted" /></label>
                    <input onChange={handleChange} value={profile.phone} className='net_input' type="text"  name="phone" placeholder="Телефон" required />
                    </div>
                    <div className="col-3">
                    <label htmlFor="country" className="form-label">Страна <span className="text-muted" /></label>
                    <input onChange={handleChange} value={profile.country} className='net_input' type="text" name="country" placeholder="Страна" required />
                    </div>
                    <div className="col-3">
                    <label htmlFor="province" className="form-label"> Область / Штат <span className="text-muted" /></label>
                    <input onChange={handleChange} value={profile.province} className='net_input' type="text" name="province" placeholder="Область/штат" required />
                    </div>
                    <div className="col-md-3">
                    <label htmlFor="postCode" className="form-label">Zip</label>
                    <input onChange={handleChange} value={profile.postCode} className='net_input' type="text" name="postCode" placeholder="Индекс" required />
                    {/* <div class="invalid-feedback">
                                Zip code required.
                            </div> */}
                    </div>
                    <div className="row gy-3">
                    <div className="col-12">
                        <h4 className="mb-3">Оплата</h4>
                        <label htmlFor="cardNumber" className="form-label">Номер карты</label>
                        <input onChange={handleChange} value={profile.cardNumber} className='net_input' type="text" name="cardNumber" placeholder="Номер карты без пробелов" required />
                    </div>
                    <div className="col-6">
                        <label htmlFor="cardHolderName" className="form-label">Имя на карте</label>
                        <input onChange={handleChange} value={profile.cardHolderName} className='net_input' type="text" name="cardHolderName" placeholder="Имя на карте" required />
                    </div>
                    <div className="col-2">
                        <label htmlFor="month" className="form-label">card mnth</label>
                        <input onChange={handleChange} value={profile.month} className='net_input' type="text" name="month" placeholder="Месяц" required />
                    </div>
                    <div className="col-2">
                        <label htmlFor="year" className="form-label">card yr</label>
                        <input onChange={handleChange} value={profile.year} className='net_input' type="text" name="year" placeholder="Год" required />
                    </div>
                    <div className="col-2">
                        <label htmlFor="cvv" className="form-label">CVV</label>
                        <input onChange={handleChange} value={profile.cvv} className='net_input' type="text" name="cvv" placeholder="cvv" required />
                        {/* <div class="invalid-feedback">
                                Security code required
                                </div> */}
                    </div>
                    {/* <button onChange={handleChange} className="net_button_primary" id="submitProfile" type="submit" value="Сохранить">Save</button> */}
                    <button className="net_button_primary" id="submitProfile" type="submit" value="Сохранить">Save</button>
                    </div>
                </div>
                </div>
            </form>
            </div>
        </div>
        </div>
    </div>
)
}

export default AddProfiles
