import React from 'react';

const InvoiceRowLabel: React.FC = () => {
  return (
    <div className='invoice-row-label-container'>
      <p className='invoice-description'>Item Description</p>
      <p className='invoice-amount'>Amount</p>
      <p className='invoice-start'>Period Starting</p>
      <p className='invoice-end'>Period Ending</p>
      <p className='download-button'>Download</p>
    </div>
  );
};

export default InvoiceRowLabel;
