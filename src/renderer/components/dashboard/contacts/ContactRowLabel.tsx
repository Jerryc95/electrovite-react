import React from 'react';

const ContactRowLabel: React.FC = () => {
  return (
    <div className='contact-row-label-container'>
      <p className='label-name'>Name</p>
      <p className='label-email'>Email</p>
      <p className='label-number'>Number</p>
      <p className='label-last-contact'>Last Contacted</p>
      <p className='label-next-contact'>Next Contact</p>
      <p className='label-date-added'>Date Added</p>
      {/* <p className='label-proposal'>Proposal</p>
      <p className='lable-contract'>Contract</p> */}
    </div>
  );
};

export default ContactRowLabel;
