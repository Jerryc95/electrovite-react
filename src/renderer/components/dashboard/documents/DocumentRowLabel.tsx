import React from "react";


const DocumentRowLabel: React.FC = () => {
    return (
        <div className='document-row-label-container'>
          <p className='label-name'>Name</p>
          <p className='label-contact'>Contact</p>
          <p className='label-category'>Type</p>
          <p className='label-added'>Date Added</p>
          <p className='label-download'>Download</p>
        </div>
      );
}

export default DocumentRowLabel;