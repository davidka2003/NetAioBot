import React  from 'react'
import AddAccounts from './AddAccounts'


const Accounts = () => {

    return (
    <div className="tab-pane fade" id="v-pills-accounts" role="tabpanel" aria-labelledby="v-pills-accounts-tab">
      <div className="container">
        <h4 className="mb-3 mt-3">Saved Accounts</h4>
        <table className="table table-striped col">
          <thead>
              <tr>
              {/* <th>№</th> */}
              <th>Account</th>
              <th>Country</th>
              <th>Actions</th>
              </tr>
          </thead>
          <tbody id="accountsTable">
              <tr className="">
              <td></td>
              <td></td>
              <td>
                  <div className="btn-group">
                  <button className="delete_icon_button" id="DeleteProfile" >
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                      </svg>
                  </button>
                  <button className="edit_icon_button" data-bs-toggle="modal" data-bs-target="#editProfile" >
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} className="bi bi-pencil" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                      </svg>
                  </button>
                  </div>
              </td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className="modal fade" id="editProfile" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
              <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Редактирование</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
              <form className="needs-validation">
                <div className="card card-body">
                  <div className="container row g-6" id="profileName">
                      {/* <h5 class="form-label">Название профиля</h5>
                              <input onChange={handleChange} type="text" class="form-control" id="ProfileName" placeholder="" value="" required> */}
                      <div className="col-12">
                        <label htmlFor="profileName" className="form-label">Название профиля</label>
                        <input type="profileName" className="net_input" id="profileName"  required />
                      </div>
                  </div>
                </div>
                <br />
                <div className="card card-body">
                  <div className="container row g-6" id="Address">
                    <h5 className="form-label">Адрес</h5>
                    <div className="col-6">
                      <label htmlFor="firstName" className="form-label">Имя</label>
                      <input type="text" className="net_input" id="firstName" required />
                    </div>
                    <div className="col-6">
                      <label htmlFor="lastName" className="form-label">Фамилия</label>
                      <input type="text" className="net_input" id="lastName" required />
                      {/* <div class="invalid-feedback">
                                  Valid last name is required.
                              </div> */}
                    </div>
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">Email <span className="text-muted" /></label>
                      <input type="email" className="net_input" id="email" required />
                    {/* <div class="invalid-feedback">
                                Please enter a valid email address for shipping updates.
                            </div> */}
                    </div>
                    <div className="col-6">
                      <label htmlFor="address1" className="form-label">Адрес</label>
                      <input type="text" className="net_input" id="address1" required />
                    {/* <div class="invalid-feedback">
                                Please enter your shipping address.
                            </div> */}
                    </div>
                    <div className="col-6">
                      <label htmlFor="address2" className="form-label">Адрес 2 <span className="text-muted" /></label>
                      <input type="text" className="net_input" id="address2" required />
                    </div>
                    <div className="col-3">
                      <label htmlFor="city" className="form-label">Город <span className="text-muted" /></label>
                      <input type="text" className="net_input" id="city" required />
                    </div>                            <div className="col-3">
                      <label htmlFor="phone" className="form-label">Телефон <span className="text-muted" /></label>
                      <input type="text" className="net_input" id="phone" required />
                    </div>
                    <div className="col-3">
                      <label htmlFor="country" className="form-label">Страна <span className="text-muted" /></label>
                      <input type="text" className="net_input" id="country" required />
                    </div>
                    <div className="col-3">
                      <label htmlFor="province" className="form-label"> Область / Штат <span className="text-muted" /></label>
                      <input type="text" className="net_input" id="province" required />
                    </div>
                    <div className="col-3">
                      <label htmlFor="postCode" className="form-label">Zip</label>
                      <input type="text" className="net_input" id="postCode" required />
                    {/* <div class="invalid-feedback">
                                Zip code required.
                            </div> */}
                    </div>
                  </div>
                </div>
                <br />
                <div className="card card-body">
                  <div className="container row g-6" id="Cart">
                    <h5 className="form-label">Карта</h5>
                    <div className="col-12">
                      <label htmlFor="cardNumber" className="form-label">Номер карты</label>
                      <input type="text" className="net_input" id="cardNumber" required />
                    </div>
                    <div className="col-6">
                      <label htmlFor="cardHolderName" className="form-label">Имя на карте</label>
                      <input type="text" className="net_input" id="cardHolderName" required />
                    </div>
                    <div className="col-2">
                      <label htmlFor="month" className="form-label">mnth</label>
                      <input type="text" className="net_input" id="month" required />
                    </div>
                    <div className="col-2">
                      <label htmlFor="year" className="form-label">card yr</label>
                      <input type="text" className="net_input" id="year" required />
                    </div>
                    <div className="col-2">
                      <label htmlFor="cvv" className="form-label">CVV</label>
                      <input type="text" className="net_input" id="cvv" required />
                    </div>
                  </div>
                </div>
                <br />
                <button className="net_button_primary" type="submit" id="editProfileButton">Сохранить</button>
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
      <AddAccounts/>
    </div>
    )
}

export default Accounts
