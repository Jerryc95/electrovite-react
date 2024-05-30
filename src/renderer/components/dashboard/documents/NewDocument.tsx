import React, { useState } from 'react';

import NewDocumentSelection from './NewDocumentSelection';
// import CreatingContractDoc from './DocumentCreationPages/CreatingContractDoc';
// import CreatingInvoiceDoc from './DocumentCreationPages/CreatingInvoiceDoc';
// import CreatingProposalDoc from './DocumentCreationPages/CreatingProposalDoc';
import CreatingDocumentOptions from './DocumentCreationPages/CreatingDocumentOption';
import CreatingNewContract from './DocumentCreationPages/CreatingNewContract';

interface NewDocumentProps {
  setAddingDocument: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | undefined;
}

const NewDocument: React.FC<NewDocumentProps> = ({ setAddingDocument, id }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [documentType, setDocumentType] = useState('');
  const [selectedDocumentOption, setSelectedDocumentOption] = useState('New');
  //   const [lineItems, setLineItems] = useState([]);

  // Handles which type of document is going to be create: invoice, contract or proposal
  const handleSelectDocumentType = (option: string) => {
    setDocumentType(option);
    setCurrentStep(1);
  };

  // Handles if the document is going to be a created from a new document or template
  const handleSelectedDocumentOption = (option: string) => {
    setSelectedDocumentOption(option);
    setCurrentStep(2);
  };

  const handleNavigationButtonClicks = (option: string) => {
    if (option == 'next') {
      setCurrentStep(currentStep + 1);
    }
    if (option == 'back') {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderComponent = () => {
    switch (currentStep) {
      case 0:
        return <NewDocumentSelection onSelect={handleSelectDocumentType} />;
    //   case 1:
    //     return (
    //       <CreatingDocumentOptions
    //         option={documentType}
    //         onSelect={handleSelectedDocumentOption}
    //       />
    //     );
      case 1:
        switch (documentType) {
          case 'Contract':
            if (selectedDocumentOption == 'New') {
              return <CreatingNewContract />;
            } else return <CreatingNewContract />;

          case 'Invoice':
            if (selectedDocumentOption == 'New') {
              return <CreatingNewContract />;
            } else return <CreatingNewContract />;
          case 'Proposal':
            if (selectedDocumentOption == 'New') {
              return <CreatingNewContract />;
            } else return <CreatingNewContract />;
        }
    }
  };

  return (
    <div className='new-document-container'>
      <div className='new-document-form'>
        <div className='new-document-heading'>
          <h2>Creating New Document</h2>
          <button
            className='button-brand-magenta'
            onClick={() => setAddingDocument(false)}
          >
            Cancel
          </button>
        </div>
        <div className='document-creation-section'>{renderComponent()}</div>
        <div className='document-navigation-button'>
          {currentStep != 0 && (
            <>
              <button
                className='button-brand-pink'
                onClick={() => handleNavigationButtonClicks('back')}
              >
                Back
              </button>
              {/* <button
                className='button-brand-dark-blue'
                onClick={() => handleNavigationButtonClicks('next')}
              >
                Next
              </button> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDocument;
