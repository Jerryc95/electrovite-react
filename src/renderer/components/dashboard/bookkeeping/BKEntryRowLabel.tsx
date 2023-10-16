import React from 'react';

const BKEntryRowLabel: React.FC = () => {
  return (
    <div className='bookkeeping-row-label-container'>
      <p className='bookkeeping-label-name'>Name</p>
      <p className='bookkeeping-label-total'>Total</p>
      <p className='bookkeeping-label-type'>Type</p>
      <p className='bookkeeping-label-category'>Category</p>
      <p className='bookkeeping-label-contact'>Contact</p>
      <p className='bookkeeping-label-date'>Date</p>
      {/* <p className='label-proposal'>Proposal</p>
      <p className='lable-contract'>Contract</p> */}
    </div>
  );
};

export default BKEntryRowLabel;
