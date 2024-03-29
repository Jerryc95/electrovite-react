import React, { useEffect, useState } from 'react';
import { StripeInvoice } from 'src/models/stripeInvoice';

interface InvoiceInfoBoxProps {
    label: string;
  invoices: StripeInvoice[];
}

const InvoiceInfoBox: React.FC<InvoiceInfoBoxProps> = ({ label, invoices }) => {
  const [percentChange, setPercentChange] = useState(11);
  return (
    <div className='client-overview-container'>
      <div className='overview-row'>
        <h4>{label}: {invoices.length}</h4>
        <div
          className={`client-overview-percent-container ${
            percentChange >= 0 ? 'positive' : 'negative'
          }`}
        >
          <p>
            {percentChange >= 0 ? '+' : ''}
            {percentChange}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceInfoBox;