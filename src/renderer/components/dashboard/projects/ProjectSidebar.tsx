import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import '../../../styles/components/ProjectSidebar.scss';
import { Project } from 'src/models/project';
import { Contact } from 'src/models/contact';
import { BKEntry } from 'src/models/BKEntry';
import UpdateModal from '$renderer/components/UpdateModal';
import { getUser } from '../../../../services/accountSlice';
import { useUpdateProjectMutation } from '../../../../services/projectAPI';
import { useUpdateEntryMutation } from '../../../../services/bookkeepingAPI';
import ProjectEntryItem from './ProjectEntryItem';


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
  const [contact, setContact] = useState<Contact | null>();
  const [contacts, setContacts] = useState<BKClient[]>([]);
  const [selectedContact, setSelectedContact] = useState<BKData | null>(null);
  const [entryNames, setEntryNames] = useState<IEntry[]>([]);
  const [entries, setEntries] = useState<BKEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<BKData | null>(null);
//   const [foundEntry, setFoundEntry] = useState<BKEntry | null>(null);
  const [showingContactModal, setShowingContactModal] = useState(false);
  const [showingEntryModal, setShowingEntryModal] = useState(false);

  const [updateProject] = useUpdateProjectMutation();
  const [updateEntry] = useUpdateEntryMutation();

  const getContactInfo = useCallback(
    async (id: number) => {
      if (project.contact_id || selectedContact !== null) {
        const url = `http://localhost:3000/contacts/details/${id}`;
        try {
          const response = await fetch(url);
          const responseData = await response.json();
          setContact(responseData);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [project.contact_id, selectedContact],
  );

  const getContacts = useCallback(() => {
    const url = `http://localhost:3000/contacts/names/${user.account?.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKClient[]) => {
        const formattedData: BKClient[] = data.map((item) => ({
          id: item.id,
          first_name: item.first_name,
          last_name: item.last_name,
          type: 'contact',
        }));
        setContacts(formattedData);
        setSelectedContact(formattedData[0])
      });
  },[])


  const handleConnectContact = () => {
    if (selectedContact) {
      const updatedProject: Project = {
        id: project.id,
        account_id: project.account_id,
        name: project.name,
        description: project.description,
        notes: project.notes,
        creation_date: project.creation_date,
        start_date: project.start_date,
        end_date: project.end_date,
        status: project.status,
        completed: project.completed,
        contact_id: selectedContact.id,
      };
      updateProject(updatedProject);
    }
  };

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

  const getEntryNames = useCallback(async() => {
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
        setSelectedEntry(formattedData[0])
      });
  },[])


  const handleConnectEntry = async () => {
    if (selectedEntry) {
        const url = `http://localhost:3000/bookkeeping/details/${selectedEntry.id}`;
        try {
          const response = await fetch(url);
          const foundEntry: BKEntry = await response.json();
          const updatedEntry: BKEntry = {
            entry_name: foundEntry.entry_name,
            bookkeeping_id: foundEntry.bookkeeping_id,
            contact_id: foundEntry.contact_id,
            account_id: foundEntry.account_id,
            total_amount: foundEntry.total_amount,
            paid_amount: foundEntry.paid_amount,
            outstanding_amount: foundEntry.outstanding_amount,
            category: foundEntry.category,
            transaction_type: foundEntry.transaction_type,
            description: foundEntry.description,
            entry_date: foundEntry.entry_date,
            first_name: foundEntry.first_name,
            last_name: foundEntry.last_name,
            paid: foundEntry.paid,
            next_payment_date: foundEntry.next_payment_date,
            project_id: project.id,
          };
          setEntries([...entries, updatedEntry])
          updateEntry(updatedEntry);
        
        } catch (error) {
          console.log("error:", error);
        }

   
    }
  }

  useEffect(() => {
    getConnectedEntries(project.id);
    if (project.contact_id) {
      getContactInfo(project.contact_id);
    }
  }, [getContactInfo, project.contact_id, getConnectedEntries, project.id]);

  return (
    <div
      className={`project-sidebar-container ${
        showingSidebar ? 'open-sidebar' : ''
      }`}
    >
      <h4 className='sidebar-header'>Connection Hub</h4>
      <h5>Contact</h5>
      <div className='project-sidebar-section'>
        <div className='project-sidebar-section-card'>
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
              <p className='filler-text'>No Contact Connected </p>
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
      <h5>Entries</h5>

      {entries.length !== 0 ? (
        <div className='project-sidebar-section'>
          <button
            className='button-brand-darker-purple'
            onClick={() => setShowingEntryModal(true)}
          >
            Connect Entry
          </button>
          {entries.map((entry) => (
            <ProjectEntryItem entry={entry} key={entry.bookkeeping_id} />
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

      {showingContactModal && (
        <UpdateModal
          onSubmit={handleConnectContact}
          onLoad={getContacts}
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
        <UpdateModal
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
