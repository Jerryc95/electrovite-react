import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// import { BKEntry } from 'src/models/BKEntry';
import { Contact } from 'src/models/contact';
import BKEntryRowLabel from '../../bookkeeping/BKEntryRowLabel';
import BKEntryRow from '../../bookkeeping/BKEntryRow';
import useToggleEntry from '../../../../../hooks/useToggleEntry';
import BlurredOverlay from '$renderer/components/BlurredOverlay';
import { getSubscription } from '../../../../../services/subscriptionSlice';
import ConnectDataModal from '$renderer/components/ConnectDataModal';
import Spinner from '$renderer/components/Spinner';
import useConnectEntry from '../../../../../hooks/useConnectEntry';

interface ContactBKProps {
  contact: Contact;
}

const ContactBK: React.FC<ContactBKProps> = ({ contact }) => {
  const subscription = useSelector(getSubscription);
  // const [entries, setEntries] = useState<BKEntry[]>([]);
  const [showingConnectEntryModal, setShowingConnectEntryModal] =
    useState(false);

  const toggleEntry = useToggleEntry();

  const { entries, isLoading, entryNames, getEntryNames, setSelectedEntry, handleConnectEntry } =
    useConnectEntry(contact);

  // useEffect(() => {
  //   const url = `http://localhost:3000/bookkeeping/contact?accountID=${contact.account_id}&contactID=${contact.id}`;
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((data: BKEntry[]) => {
  //       setEntries(data);
  //     });
  // }, [contact.account_id, contact.id]);

  return (
    <div>
      <BlurredOverlay
        blur={subscription!.tier > 2 ? 0 : 8}
        allowed={subscription!.tier > 2 ? true : false}
        text='Subscribe to Flowplanr Pro to unlock Finances'
      >
        <div className='contact-component-page-heading'>
          <h3>Bookkeeping</h3>
          <button
            className='button-brand-lighter-blue'
            onClick={() => setShowingConnectEntryModal(true)}
          >
            Connect
          </button>
        </div>
        <BKEntryRowLabel />
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            {entries.length === 0 ? (
              <div className='bk-contacts-empty'>
                <p>Connected Entries will appear here.</p>
              </div>
            ) : (
              <div>
                {entries.map((entry) => (
                  <div
                    key={entry.bookkeeping_id}
                    onClick={() => toggleEntry(entry)}
                  >
                    <BKEntryRow entry={entry} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </BlurredOverlay>
      {showingConnectEntryModal && (
        <ConnectDataModal
          onSubmit={handleConnectEntry}
          onLoad={getEntryNames}
          setShowingModal={setShowingConnectEntryModal}
          currentItem='entry'
          connectingItem='contact'
          data={entryNames}
          setData={setSelectedEntry}
          height='225px'
          width='450px'
        />
      )}
    </div>
  );
};

export default ContactBK;
