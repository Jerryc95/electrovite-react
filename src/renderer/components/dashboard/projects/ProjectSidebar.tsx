import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/components/ProjectSidebar.scss';
import { Project } from 'src/models/project';
import { BKEntry } from 'src/models/BKEntry';
import ConnectDataModal from '$renderer/components/ConnectDataModal';
import { getUser } from '../../../../services/accountSlice';
import { useUpdateEntryMutation } from '../../../../services/bookkeepingAPI';
import ProjectEntryItem from './ProjectEntryItem';
import useToggleContact from '../../../../hooks/useToggleContact';
import BlurredOverlay from '$renderer/components/BlurredOverlay';
import { getSubscription } from '../../../../services/subscriptionSlice';
import useConnectContact from '../../../../hooks/useConnectContact';

interface ProjectSidebarProps {
  project: Project;
  showingSidebar: boolean;
}

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
  type: 'contact';
}

interface BKProject {
  id: number;
  name: string;
  contact_id: number,
  type: 'project';
}

interface IEntry {
  id: number;
  entry_name: string;
  type: 'entry';
}

type BKData = BKClient | BKProject | IEntry;

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  project,
  showingSidebar,
}) => {
  const user = useSelector(getUser);
  const subscription = useSelector(getSubscription);
  const [entryNames, setEntryNames] = useState<IEntry[]>([]);
  const [entries, setEntries] = useState<BKEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<BKData | null>(null);
  const [showingContactModal, setShowingContactModal] = useState(false);
  const [showingEntryModal, setShowingEntryModal] = useState(false);
  const [isEditingEntries, setIsEditingEntries] = useState(false);

  const [updateEntry] = useUpdateEntryMutation();

  const toggleContact = useToggleContact();

  const {
    contact,
    contacts,
    getContacts,
    getContactInfo,
    setSelectedContact,
    handleConnectContact,
  } = useConnectContact();

  const getConnectedEntries = useCallback(async (id: number) => {
    const url = `http://localhost:3000/bookkeeping/project-entries/${id}`;
    try {
      const response = await fetch(url);
      const responseData: BKEntry[] = await response.json();
      setEntries(responseData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getEntryNames = useCallback(async () => {
    const url = `http://localhost:3000/bookkeeping/entries/${user.account?.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: IEntry[]) => {
        const formattedData: IEntry[] = data.map((item) => ({
          id: item.id,
          entry_name: item.entry_name,
          type: 'entry',
        }));
        setEntryNames(formattedData);
        setSelectedEntry(formattedData[0]);
      });
  }, []);

  const handleConnectEntry = async () => {
    if (selectedEntry) {
      const url = `http://localhost:3000/bookkeeping/details/${selectedEntry.id}`;
      try {
        const response = await fetch(url);
        const foundEntry: BKEntry = await response.json();
        const updatedEntry: BKEntry = {
          ...foundEntry,
          project_id: project.id,
        };
        setEntries([...entries, updatedEntry]);
        updateEntry(updatedEntry);
      } catch (error) {
        console.log('error:', error);
      }
    }
  };

  useEffect(() => {
    getConnectedEntries(project.id);
    if (project.contact_id) {
      getContactInfo(project.contact_id);
    }
  }, [
    getContactInfo,
    project.contact_id,
    getConnectedEntries,
    project.id,
    project,
  ]);

  return (
    <div
      className={`project-sidebar-container ${
        showingSidebar ? 'open-sidebar' : ''
      }`}
    >
      <h4 className='sidebar-header'>Connection Hub</h4>
      <p className='info-text'>
        Connect an existing contact or entry to {project.name}.
      </p>
      <div className='project-sidebar-heading'>
        <h5>Contact</h5>
        {contact && project.contact_id && (
          <FontAwesomeIcon
            icon={faPenToSquare}
            className='edit-button'
            onClick={() => {
              setShowingContactModal(true);
            }}
          />
        )}
      </div>

      <BlurredOverlay
        blur={subscription!.tier > 1 ? 0 : 8}
        allowed={subscription!.tier > 1 ? true : false}
        text='Subscribe to Flowplanr Plus to connect a contact'
      >
        <div className='project-sidebar-section'>
          <div
            className={`project-sidebar-section-card ${
              contact ? 'hoverable' : ''
            }`}
            onClick={contact ? () => toggleContact(contact) : undefined}
          >
            {contact ? (
              <div className='card-details align-left'>
                <h3>
                  {contact.first_name} {contact.last_name}
                </h3>

                <h4>{contact.email}</h4>
                <h4>{contact.phone}</h4>
              </div>
            ) : (
              <div className='card-details align-center'>
                <p className='filler-text'>No Contact Connected</p>
                <button
                  className='button-brand-pink'
                  onClick={() => setShowingContactModal(true)}
                >
                  Connect Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </BlurredOverlay>
      <div className='project-sidebar-heading'>
        <h5>Entries</h5>
        {entries.length != 0 && (
          <FontAwesomeIcon
            icon={faPenToSquare}
            className='edit-button'
            onClick={() => {
              setIsEditingEntries(!isEditingEntries);
            }}
          />
        )}
      </div>

      <BlurredOverlay
        blur={subscription!.tier > 2 ? 0 : 8}
        allowed={subscription!.tier > 2 ? true : false}
        text='Subscribe to Flowplanr Pro to connect entries.'
      >
        {entries.length !== 0 ? (
          <div className='project-sidebar-section'>
            <button
              className='button-brand-darker-purple'
              onClick={() => setShowingEntryModal(true)}
            >
              Connect Entry
            </button>

            {entries.map((entry) => (
              <ProjectEntryItem
                entry={entry}
                entries={entries}
                setEntries={setEntries}
                key={entry.bookkeeping_id}
                isEditing={isEditingEntries}
              />
            ))}
          </div>
        ) : (
          <div className='project-sidebar-section'>
            <div className='project-sidebar-section-card'>
              <div className='card-details align-center'>
                <p className='filler-text'>No Connected Entries</p>
                <button
                  className='button-brand-darker-purple'
                  onClick={() => setShowingEntryModal(true)}
                >
                  Connect Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </BlurredOverlay>

      {showingContactModal && (
        <ConnectDataModal
          onSubmit={() => handleConnectContact(project, null)}
          onLoad={() => getContacts(user.account?.id)}
          setShowingModal={setShowingContactModal}
          currentItem='contact'
          connectingItem='project'
          data={contacts}
          setData={setSelectedContact}
          height='200px'
          width='300px'
        />
      )}
      {showingEntryModal && (
        <ConnectDataModal
          onSubmit={handleConnectEntry}
          onLoad={getEntryNames}
          setShowingModal={setShowingEntryModal}
          currentItem='entry'
          connectingItem='project'
          data={entryNames}
          setData={setSelectedEntry}
          height='200px'
          width='300px'
        />
      )}
    </div>
  );
};

export default ProjectSidebar;
