import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import '../../../styles/documents.scss';
import DocumentRowLabel from './DocumentRowLabel';
import NewDocument from './NewDocument';
import { getUser } from '../../../../services/accountSlice';


const Documents: React.FC = () => {
  const user = useSelector(getUser)
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [addingDocument, setAddingDocument] = useState(false)

  const filterOptions = ['All', 'Invoices', 'Contracts', 'Proposals'];

  return (
    <div className='documents-container'>
      <div className='documents-header'>
        <h2>Documents</h2>
        <button className='button-brand-light-blue' onClick={()=> setAddingDocument(true)}>Create</button>
      </div>
      <h3>Recently Viewed</h3>
      <p className='label-text'>Recently viewed documents will appear here</p>
      <div className='documents-overview'>

        
      </div>
      <div className='documents-bottom-container'>
        <div className='documents-filters'>
          {filterOptions.map((option, index) => (
            <div
              className={`sort-capsule ${option} ${
                selectedFilter === option ? 'selected' : ''
              }`}
              key={index}
              onClick={() => setSelectedFilter(option)}
            >
              {option}
            </div>
          ))}
        </div>
        <DocumentRowLabel />
      </div>

      {addingDocument && (
        <NewDocument setAddingDocument={setAddingDocument} id={user.account?.id} />
      )}
    </div>
  );
};

export default Documents;
