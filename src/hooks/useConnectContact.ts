import { useCallback, useState } from 'react';
import { Contact } from 'src/models/contact';
import { Project } from 'src/models/project';
import { useUpdateProjectMutation } from '../services/projectAPI';
import { BKEntry } from 'src/models/BKEntry';
import { useUpdateEntryMutation } from '../services/bookkeepingAPI';

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

const useConnectContact = () => {
  const [updateProject] = useUpdateProjectMutation();
  const [updateEntry] = useUpdateEntryMutation();

  const [contact, setContact] = useState<Contact | null>();
  const [contacts, setContacts] = useState<BKClient[]>([]);
  const [selectedContact, setSelectedContact] = useState<BKData | null>(null);

  const getContacts = useCallback((id: number | undefined) => {
    const url = `https://flowplanr-production.up.railway.app/contacts/names/${id}`;
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
      });
  }, []);

  const getContactInfo = useCallback(
    async (contactID: number) => {
      if (contactID || selectedContact !== null) {
        const url = `https://flowplanr-production.up.railway.app/contacts/details/${contactID}`;
        try {
          const response = await fetch(url);
          const responseData = await response.json();
          setContact(responseData);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [selectedContact],
  );

  const handleConnectContact = (
    project: Project | null,
    entry: BKEntry | null,
  ) => {
    if (selectedContact) {
      if (selectedContact.type == 'contact' && contact) {
        if (selectedContact.id == contact.id) {
          if (project) {
            const updatedProject: Project = {
              ...project,
              contact_id: null,
            };
            updateProject(updatedProject);
            setContact(null);
            return;
          }
        }
      }

      if (project) {
        const updatedProject: Project = {
          ...project,
          contact_id: selectedContact.id,
        };
        updateProject(updatedProject);
      }

      if (entry) {
        const updatedEntry: BKEntry = {
          ...entry,
          contact_id: selectedContact.id,
        };
        updateEntry(updatedEntry);
      }
    } else {
      if (project) {
        const updatedProject: Project = {
          ...project,
          contact_id: null,
        };
        updateProject(updatedProject);
        setContact(null);
      }
    }
  };

  return {
    contact,
    contacts,
    getContacts,
    getContactInfo,
    setSelectedContact,
    handleConnectContact,
  };
};

export default useConnectContact;
