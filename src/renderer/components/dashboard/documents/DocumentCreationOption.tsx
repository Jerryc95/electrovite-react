import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface DocumentCreationOptionProps {
  document: string;
  icon: IconDefinition;
  onSelect: (option: string) => void;
}

const DocumentCreationOption: React.FC<DocumentCreationOptionProps> = ({
  document,
  icon,
  onSelect,
}) => {
  return (
    <div
      className={`document-creation-option-card ${document}-border`}
      onClick={() => onSelect(document)}
    >
      <h3>{document}</h3>
      <FontAwesomeIcon
        icon={icon}
        className={`document-creation-option-icon ${document}-icon`}
        size='2xl'
      />
    </div>
  );
};

export default DocumentCreationOption;
