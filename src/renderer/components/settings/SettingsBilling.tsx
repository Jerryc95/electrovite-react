import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faChevronUp,
  faChevronDown,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../services/store';

const SettingsBilling: React.FC = () => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [editingPlan, setEditingPlan] = useState(false);
  const [editingBilling, constEditingBilling] = useState(false);
  const [showingAllHistory, setShowingAllHistory] = useState(false);
  // const [planClass, setPlanClass] = useState("starter")

  const toggleEdit = (
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setEditing((value) => !value);
  };

  const planClass = 'starter';

  // switch (sub info here) {
  //   case 'starter':
  //     planClass = 'starter';
  //     break;
  //   case 'plus':
  //     planClass = 'plus';
  //     break;
  //   case 'pro':
  //     planClass = 'pro';
  //     break;
  //   default:
  //     planClass = '';
  // }

  return (
    <div className='sub-settings-container'>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Subscription</h4>
          {/* <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingPlan)}
          >
            {editingPlan ? <span>Cancel</span> : <span>Edit</span>}
            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div> */}
        </div>
        <h5>
          Current Plan: <span className={planClass}>STARTER</span>
          <button className='button-brand-purple'>Upgrade</button>
        </h5>
        <div className='settings-section-row'>
          <div className='settings-section-column'>
            <p className='header'>Cost</p>
            <p>$0.00</p>
          </div>
          <div className='settings-section-column'>
            <p className='header'>Term</p>
            <p>Monthly</p>
          </div>
          <div className='settings-section-column'>
            <p className='header'>Next Billing Date</p>
            <p>Jan 1st, 2024</p>
          </div>
        </div>
        <h5>What You're Getting:</h5>
        <div className='settings-section-row margin-top'>
          <div className='settings-section-column'>
            <p className='plan-highlight'>
              <FontAwesomeIcon icon={faCircleCheck} className='check-icon' />
              Up to 3 Projects
            </p>
          </div>
          <div className='settings-section-column'>
            <p className='plan-highlight'>
              <FontAwesomeIcon icon={faCircleCheck} className='check-icon' />
              Unlimited Tasks & subtasks
            </p>
          </div>
          <div className='settings-section-column'>
            <p className='plan-highlight'>
              <FontAwesomeIcon icon={faCircleCheck} className='check-icon' />
              Kanban Board
            </p>
          </div>
        </div>
      </div>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Billing Info</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingPlan)}
          >
            {editingPlan ? <span>Cancel</span> : <span>Update</span>}
            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <div className='settings-section-row'>
          <div className='setttings-section-column'>
            <h5>Billing Address</h5>
            <form className='settings-form'>
              <label className='edit-settings-label'>
                Address
                <input
                  className='edit-settings-long-input'
                  type='text'
                  name='first_name'
                  placeholder='Enter Street'
                  value=''
                  // onChange={}
                />
              </label>
            </form>
          </div>
          <div className='settings-section-column'>
            <h5>Payment Method</h5>
            <form className='settings-form'>
            <label className='edit-settings-label'>
                Card Holder
                <input
                  className='edit-settings-long-input'
                  type='text'
                  name='card_holder'
                  placeholder='John Smith'
                  value=''
                  // onChange={}
                />
              </label>
              <label className='edit-settings-label'>
                Credit Card Number
                <input
                  className='edit-settings-long-input'
                  type='text'
                  name='credit_number'
                  placeholder='0123 XXXX XXXX XXXX'
                  value=''
                  // onChange={}
                />
              </label>
            </form>
          </div>
        </div>
      </div>
      <div className='settings-section'>
        <div className='settings-section-header'>
          <h4>Payment History</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingPlan)}
          >
            {editingPlan ? <span>Close</span> : <span>Show All</span>}
            {editingPlan ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                className='edit-icon'
                size='sm'
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                className='edit-icon'
                size='sm'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBilling;
