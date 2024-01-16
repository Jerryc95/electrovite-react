import React, { useEffect, useState } from 'react';
import { StripeInvoice } from 'src/models/stripeInvoice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

interface InvoiceRowProps {
  invoice: StripeInvoice;
}

const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice }) => {
  const [startingPeriod, setStartingPeriod] = useState('');
  const [endingPeriod, setEndingPeriod] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    setIsDownloading(true);
    const anchorElement = document.createElement('a');
    const fileName = `flowplanr-invoice-${startingPeriod}.pdf`;
    const formattedFileName = fileName.replace(/ /g, '_');
    anchorElement.href = invoice.invoice_pdf;
    anchorElement.download = formattedFileName;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    // document.body.removeChild(anchorElement);
    setTimeout(() => {
        document.body.removeChild(anchorElement);
        setIsDownloading(false);
      }, 700)
  };

  useEffect(() => {
    const startingDate = new Date(invoice.period_start * 1000);
    const endingDate = new Date(invoice.period_end * 1000);

    const formattedStartingDate = startingDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const formattedEndingDate = endingDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    setStartingPeriod(formattedStartingDate);
    setEndingPeriod(formattedEndingDate);
  }, []);
  return (
    <div className='invoice-row-container'>
      <p className='invoice-description'>{invoice.description}</p>
      <p className='invoice-amount'>${invoice.amount_due / 100}</p>
      <p className='invoice-start'>{startingPeriod}</p>
      <p className='invoice-end'>{endingPeriod}</p>
      <div className='download-button' onClick={handleDownloadClick}>
        {isDownloading ? (
          <div className='spinner-container'>
            <div className='spinner'></div>
         </div>
        ) : (
          <div>
            <FontAwesomeIcon size='xl' icon={faFileArrowDown} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceRow;
