import React from 'react';
import {
  faFileInvoiceDollar,
  faFileContract,
  faFileSignature,
} from '@fortawesome/free-solid-svg-icons';
import DocumentCreationOption from './DocumentCreationOption';

interface NewDocumentSelectionProps {
  onSelect: (option: string) => void;
}

const NewDocumentSelection: React.FC<NewDocumentSelectionProps> = ({
  onSelect,
}) => {
  const documentCreationOptions = [
    { document: 'Contract', icon: faFileContract },
    { document: 'Invoice', icon: faFileInvoiceDollar },
    { document: 'Proposal', icon: faFileSignature },
  ];

  return (
    <div className='document-creation-section-container'>
      <h3>Choose The Document You Need To Create</h3>
      <div className='document-creation-options-row'>
        {documentCreationOptions.map((option, index) => (
          <DocumentCreationOption
            key={index}
            document={option.document}
            icon={option.icon}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default NewDocumentSelection;
