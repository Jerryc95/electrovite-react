import React, { useState } from 'react';
import {
  faFileCirclePlus,
  faCopy,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import DocumentCreationOption from '../DocumentCreationOption';

// interface IDocumentOption {
//     document: string;
//     icon: IconDefinition
// }

interface CreatingDocumentOptionsProps {
  option: string;
  onSelect: (option: string) => void;
}

const CreatingDocumentOptions: React.FC<CreatingDocumentOptionsProps> = ({
  option,
  onSelect,
}) => {
  const documentOptions = [
    { document: 'New', icon: faFileCirclePlus },
    { document: 'Template', icon: faCopy },
  ];

  return (
    <div className='document-creation-section-container'>
      <h3>Creating {option}</h3>
      <div className='document-creation-options-row'>
        {documentOptions.map((option, index) => (
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

export default CreatingDocumentOptions;
