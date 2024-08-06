import { useCallback, useEffect, useState } from 'react';
import { BKEntry } from 'src/models/BKEntry';
import { Contact } from 'src/models/contact';
import { useFetchEntriesByContactQuery, useUpdateEntryMutation } from '../services/bookkeepingAPI';

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
  type: 'contact';
}

interface BKProject {
  id: number;
  name: string;
  contact_id: number;
  type: 'project';
}

interface IEntry {
  id: number;
  entry_name: string;
  type: 'entry';
}

type BKData = BKClient | BKProject | IEntry;

const useConnectEntry = (contact: Contact) => {
    const [updateEntry] = useUpdateEntryMutation()
    const { data, isLoading } = useFetchEntriesByContactQuery(
        {
          accountID: contact.account_id,
          contactID: contact.id,
        },
        { refetchOnMountOrArgChange: true },
      );
  const [entries, setEntries] = useState<BKEntry[]>([]);
  const [entryNames, setEntryNames] = useState<IEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<BKData | null>(null);

  const getEntryNames = useCallback(async() => {
    const url = `http://localhost:3000/bookkeeping/entries/${contact.account_id}`;
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
  },[])

  const handleConnectEntry = async () => {
    // maybe do a search in the db with the contact id to see if theres a project connected
    if (selectedEntry) {
        const url = `http://localhost:3000/bookkeeping/details/${selectedEntry.id}`;
        try {
          const response = await fetch(url);
          const foundEntry: BKEntry = await response.json();
          const updatedEntry: BKEntry = {
            ...foundEntry,
            contact_id: contact.id,
          };
          setEntries([...entries, updatedEntry]);
          updateEntry(updatedEntry);
        } catch (error) {
          console.log('error:', error);
        }
      }
  }

  useEffect(() => {
    if (data) {
      setEntries(data);
    }
  }, [data]);

  return {
    entries,
    isLoading,
    entryNames,
    getEntryNames,
    setSelectedEntry,
    handleConnectEntry,
    
  }
};

export default useConnectEntry;
