import React, { ChangeEvent, FormEvent } from 'react'

const AddAccounts = () => {
  return (
      <div className="container">
      <div className="row">
      <div className="col-12">
          <p>
          <button className="net_button_primary" type="button" data-toggle="collapse" data-target="#EpicCollapse" aria-expanded="false" aria-controls="EpicCollapse" id="AddProfile" >Add new account</button>
          </p>
          <div className="collapse" id="EpicCollapse">
          <form className="needs-validation form-inline" name="AddProfile">
              <div className="card card-body">
              <div className="container row g-6" id="NewAddress">
                  <div className="col">
                  <h4 /*htmlFor="profileName"*/ className="form-label">Account name</h4>
                  <input className='net_input' type="text" name="profileName" /* placeholder="Название профиля" */ required />
                  </div>
                  <h4 className="mb-3">Delivery info</h4>
                  <div className="col-6">
                  <label htmlFor="firstName" className="form-label">Name</label>
                  <input className='net_input' type="text" name="firstName"/*  placeholder="Имя"  */required />
                  {/* <div class="invalname-feedback">
                              Valid first name is required.
                          </div> */}
                  </div>
                  <div className="col-6">
                  <label htmlFor="lastName" className="form-label">Surname</label>
                  <input className='net_input' type="text" name="lastName"/*  placeholder="Фамилия" */ required />
                  {/* <div class="invalid-feedback">
                              Valid last name is required.
                          </div> */}
                  </div>
                  <div className="col-12">
                  <label htmlFor="email" className="form-label">Email <span className="text-muted" /></label>
                  <input className='net_input' type="email"  name="email"/*  placeholder="email"  */required />
                  {/* <div class="invalid-feedback">
                              Please enter a valid email address for shipping updates.
                          </div> */}
                  </div>
                  <div className="col-6">
                  <label htmlFor="address1" className="form-label">Address 1</label>
                  <input className='net_input' type="text" name="address1"/*  placeholder="Адрес" */ required />
                  {/* <div class="invalid-feedback">
                              Please enter your shipping address.
                          </div> */}
                  </div>
                  <div className="col-6">
                  <label htmlFor="address2" className="form-label">Address 2 <span className="text-muted" /></label>
                  <input className='net_input' type="text"  name="address2" /* placeholder="Адрес 2" */ required />
                  </div>
                  <div className="col-3">
                  <label htmlFor="city" className="form-label">City <span className="text-muted" /></label>
                  <input className='net_input' type="text"  name="city" /* placeholder="Город" */ required />
                  </div>
                  <div className="col-3">
                  <label htmlFor="phone" className="form-label">Phone number <span className="text-muted" /></label>
                  <input className='net_input' type="text"  name="phone" /* placeholder="Телефон" */ required />
                  </div>
                  <div className="col-3">
                  <label htmlFor="country" className="form-label">Country <span className="text-muted" /></label>
                  <input className='net_input' type="text" name="country" /* placeholder="Страна" */ required />
                  </div>
                  <div className="col-3">
                  <label htmlFor="province" className="form-label"> State / region <span className="text-muted" /></label>
                  <input className='net_input' type="text" name="province" /* placeholder="Область/штат" */ required />
                  </div>
                  <div className="col-md-3">
                  <label htmlFor="postCode" className="form-label">Zip</label>
                  <input  className='net_input' type="text" name="postCode" /* placeholder="Индекс" */ required />
                  {/* <div class="invalid-feedback">
                              Zip code required.
                          </div> */}
                  </div>
                  <div className="row gy-3">
                  <div className="col-12">
                      <h4 className="mb-3">Payment</h4>
                      <label htmlFor="cardNumber" className="form-label">Card number</label>
                      <input className='net_input' type="text" name="cardNumber" placeholder="4276550033333333" required />
                  </div>
                  <div className="col-6">
                      <label htmlFor="cardHolderName" className="form-label">Card placeholder name</label>
                      <input className='net_input' type="text" name="cardHolderName" /* placeholder="Имя на карте" */ required />
                  </div>
                  <div className="col-2">
                      <label htmlFor="month" className="form-label">Card mnth</label>
                      <input className='net_input' type="text" name="month" placeholder="01" required />
                  </div>
                  <div className="col-2">
                      <label htmlFor="year" className="form-label">Card yr</label>
                      <input className='net_input' type="text" name="year" placeholder="2023" required />
                  </div>
                  <div className="col-2">
                      <label htmlFor="cvv" className="form-label">CVV</label>
                      <input className='net_input' type="text" name="cvv" placeholder="111" required />
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

export default AddAccounts
