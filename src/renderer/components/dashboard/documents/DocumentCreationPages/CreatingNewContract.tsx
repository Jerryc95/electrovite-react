import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';

// interface CreatingNewContractProps {
//   documentType: string;
//   documentOption: string;
// }

interface IContractSection {
    title: string;
    section: string;
}

const CreatingNewContract: React.FC = () => {
  const [testText, setTestText] = useState('test');

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });

  return (
    <div className='document-creation-section-container'>
      <h3>New Contract Details</h3>
      <div className='document-creation-row'>
        <div className='new-document-form-field'>
          <label className='new-document-form-label'>
            Contact
            <input
              className='new-document-form-input'
              type='text'
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
            />
          </label>
          <label className='new-document-form-label'>
            Section Title
            <input
              className='new-document-form-input'
              type='text'
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
            />
            {/* <textarea
              className='new-document-form-input'
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
            /> */}
            {/* <><ReactQuill value={testText} onChange={setTestText} /></> */}
           
          </label>
          
          <button className='button-brand-light-blue'>Add New Section</button>
        </div>
        <div className='new-document-preview'>
          <PDFViewer
            style={{ width: '100%', height: '422px' }}
            showToolbar={false}
          >
            <Document>
              <Page size='A4' style={styles.page}>
                <View style={styles.section}>
                  <Text>{testText}</Text>
                </View>
              </Page>
            </Document>
          </PDFViewer>
          <FontAwesomeIcon size='lg' icon={faRotateRight} className='refresh-icon'/>
        </div>
      </div>
    </div>
  );
};

export default CreatingNewContract;
