import React, { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ProfileInterface,
  ShopifyTaskInterface,
} from '../../Interfaces/interfaces';
import { sizes } from './AddTask';
import { useAppDispatch, useAppSelector } from '../../store';

const AddTaskShopify = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector((state) => state.profiles);
  const proxyProfiles = useSelector((state: any) => state.proxy);
  const [task, settask] = useState<ShopifyTaskInterface>({
    isCustomSizes: false,
    sizes: {},
    __taskNumber: 1,
    checkoutsAmount: 1,
    isRun: false,
    retryOnFailure: true,
    shop: 'shopify',
    profile: '',
    mode: '24/7',
    checked: false,
    positive: [],
    negative: [],
    taskId: '',
    checkouts: {},
    checkoutsBypass: {},
  });
  let handleChange = (
    event: ChangeEvent<HTMLInputElement & /* | */ HTMLSelectElement>
  ) => {
    let currentTask = { ...task };
    switch (event.target.id) {
      case 'positive':
        currentTask.positive = event.target.value.split('|');
        break;

      case 'negative':
        currentTask.negative = event.target.value.split('|');
        break;
      case 'isCustomSizes':
        currentTask.isCustomSizes = event.target.checked;
        break;
      case 'mode':
        (event.target.value == '24/7' || event.target.value == 'release') &&
          (currentTask.mode = event.target.value);
        break;
      case 'profile':
        currentTask.profile = event.target.value;
        break;
      case 'proxyProfile':
        currentTask.proxyProfile = event.target.value;
        break;
      case '__taskNumber':
        currentTask.__taskNumber = parseInt(event.target.value);
        break;
      case 'retryOnFailure':
        currentTask.retryOnFailure = event.target.checked;
        break;
      case 'checkoutsAmount':
        currentTask.checkoutsAmount = parseInt(event.target.value);
        break;
      default:
        event.target.name == 'sizes'
          ? (currentTask.sizes[event.target.id] = event.target.checked)
          : null;
        break;
    }
    console.log(currentTask);
    settask(currentTask);
  };
  let handlerCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({
      type: 'ADD_TASK',
      payload: {
        ...task,
        shop: 'shopify',
        currentCheckoutState: { level: 'LOW', state: 'not started' },
      },
    });
  };
  return (
    <div className="container row">
      <div className="container col-1" />
      <div className="container col-10">
        <form
          onSubmit={handlerCreate}
          className="needs-validation"
          id="createTaskForm"
        >
          <div className="row g-6">
            <h2 className=" text-center">Shopify</h2>
            <h4 className="">Filters</h4>
            <div className="col">
              <label htmlFor="positive" className="form-label ">
                Positive
              </label>
              <input
                onChange={handleChange}
                value={task?.positive?.join('|')}
                type="text"
                className="net_input"
                id="positive"
                required
              />
            </div>
            <div className="col">
              <label htmlFor="negative" className="form-label ">
                Negative
              </label>
              <input
                onChange={handleChange}
                value={task?.negative?.join('|')}
                type="text"
                className="net_input"
                id="negative"
                required
              />
            </div>
          </div>
          <div className="col mb-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={task?.isCustomSizes}
                onChange={handleChange}
                name="flexRadioDefault"
                id="isCustomSizes"
                data-bs-toggle="collapse"
                /* @ts-ignore */
                href="#collapseExample"
                aria-expanded="false"
                aria-controls="collapseExample"
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                Use preferred sizes
              </label>
            </div>
            <div>
              <div className="collapse text-dark" id="collapseExample">
                <div className="card card-body">
                  {sizes?.map((size: string, index) => {
                    return (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          onChange={handleChange}
                          checked={task.sizes[size]?.checked}
                          id={size}
                          name="sizes"
                          type="checkbox"
                        />
                        <label
                          className="form-check-label"
                          htmlFor={size + 'us'}
                        >
                          {size} us
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="row g-3">
            <h4 className="">Settings</h4>
            <div className="col-4">
              <label htmlFor="number" className="form-label ">
                Number of tasks
              </label>
              <input
                onChange={handleChange}
                value={task?.__taskNumber}
                type="number"
                min="1"
                max="100"
                className="net_input"
                id="__taskNumber"
                required
              />
            </div>
            <div className="col-4">
              <label htmlFor="profile" className="form-label ">
                Profile
              </label>
              <select
                value={task?.profile}
                onChange={handleChange}
                className="net_select"
                id="profile"
                required
              >
                <option value="">Выбрать...</option>
                {Object.keys(profiles || {})?.map((profile, index) => {
                  return (
                    <option value={profile} key={index}>
                      {profile}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-4">
              <label htmlFor="mode" className="form-label ">
                Mode
              </label>
              <select
                value={task?.mode}
                onChange={handleChange}
                className="net_select"
                id="mode"
                required
              >
                <option disabled={true}>Выбрать...</option>
                <option>release</option>
                <option>24/7</option>
              </select>
            </div>
            <div className="col-4">
              <label htmlFor="proxyProfile" className="form-label ">
                Прокси
              </label>
              <select
                value={task?.proxyProfile}
                onChange={handleChange}
                className="net_select"
                id="proxyProfile"
                required
              >
                <option value="">Выбрать...</option>
                {Object.keys(proxyProfiles).map((profile: string, index) => (
                  <option key={index} value={profile}>
                    {profile}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <label htmlFor="checkoutsAmount" className="form-label ">
                Checkouts per task amount
              </label>
              <input
                onChange={handleChange}
                value={task?.checkoutsAmount}
                type="number"
                min="1"
                max="100"
                className="net_input"
                id="checkoutsAmount"
                required
              />
            </div>
            <div className="col-4"></div>
          </div>
          <div className="">
            <input
              onChange={handleChange}
              checked={task?.retryOnFailure}
              type="checkbox"
              className="net_checkbox"
              id="retryOnFailure"
            />
            <label htmlFor="retryOnFailure" className="form-label ">
              Retry on failure
            </label>
          </div>
          <br />
          <button className="net_button_primary" id="saveNewTaskButton">
            Save
          </button>
          <br />
        </form>
      </div>
      <div className="container col-1" />
    </div>
  );
};

export default AddTaskShopify;
