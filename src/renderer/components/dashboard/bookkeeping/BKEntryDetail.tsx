import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCircleCheck,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import { BKEntry } from 'src/models/BKEntry';
import EditField from '$renderer/components/EditField';
import ProgressBar from '$renderer/components/ProgressBar';
import { Contact } from 'src/models/contact';
import CalendarField from '$renderer/components/CalendarField';
import ConnectDataModal from '$renderer/components/ConnectDataModal';
import '../../../styles/detailPage.scss';
import useBackClick from '../../../../hooks/useBackClick';
import { useUpdateEntryMutation } from '../../../../services/bookkeepingAPI';
import { parseDate } from '../../../../helpers/ParseDate';
import { Project } from 'src/models/project';
import EditBKEntry from './EditBKEntry';
import { getUser } from '../../../../services/accountSlice';
import UpdateBKPaymentModal from './UpdateBKPaymentModal';
import useToggleContact from '../../../../hooks/useToggleContact';
import useToggleProject from '../../../../hooks/useToggleProject';

interface BKEntryDetailProps {
  entry: BKEntry;
  entries: BKEntry[];
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
  contact_id: number;
  type: 'project';
}

interface IEntry {
  id: number;
  entry_name: string;
  type: 'entry';
}

type BKData = BKClient | BKProject | IEntry;

const BKEntryDetail: React.FC<BKEntryDetailProps> = ({ entry, entries }) => {
  const goBack = useBackClick();
  const toggleContact = useToggleContact();
  const toggleProject = useToggleProject();

  const [updateEntry] = useUpdateEntryMutation();

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalClientRevenue, setTotalClientRevenue] = useState(0);
  const [contact, setContact] = useState<Contact>();
  const [contacts, setContacts] = useState<BKClient[]>([]);
  const [selectedContact, setSelectedContact] = useState<BKData | null>(null);
  const [project, setProject] = useState<Project>();
  const [projects, setProjects] = useState<BKProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<BKData | null>(null);
  const [editingEntry, setEditingEntry] = useState(false);
  const [showingPaymentModal, setShowingPaymentModal] = useState(false);
  const [showingContactModal, setShowingContactModal] = useState(false);
  const [showingProjectModal, setShowingProjectModal] = useState(false);

  const user = useSelector(getUser);

  const toggleEntry = () => {
    goBack();
  };

  const getContactInfo = useCallback(
    async (id: number) => {
      if (entry.contact_id || selectedContact !== null) {
        const url = `https://flowplanr-production.up.railway.app/contacts/details/${id}`;
        try {
          const response = await fetch(url);
          const responseData = await response.json();
          setContact(responseData);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [entry.contact_id, selectedContact],
  );

  const getContacts = useCallback(() => {
    const url = `https://flowplanr-production.up.railway.app/contacts/names/${user.account?.id}`;
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
        setSelectedContact(formattedData[0]);
      });
  }, []);

  const handleConnectContact = () => {
    if (selectedContact) {
      const updatedEntry: BKEntry = {
        ...entry,
        contact_id: selectedContact.id,
      };
      updateEntry(updatedEntry);
    }
  };

  const getProjectInfo = useCallback(
    async (id: number) => {
      if (entry.project_id || selectedProject !== null) {
        const url = `https://flowplanr-production.up.railway.app/projects/details/${id}`;
        try {
          const response = await fetch(url);
          const responseData = await response.json();
          setProject(responseData);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [entry.project_id, selectedProject],
  );

  const getProjects = useCallback(() => {
    const url = `https://flowplanr-production.up.railway.app/projects/names/${user.account?.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKProject[]) => {
        const formattedData: BKProject[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          contact_id: item.contact_id,
          type: 'project',
        }));
        setProjects(formattedData);
        setSelectedProject(formattedData[0]);
      });
  }, []);

  const handleConnectProject = () => {
    if (selectedProject) {
      const updatedEntry: BKEntry = {
        ...entry,
        project_id: selectedProject.id,
      };
      updateEntry(updatedEntry);
    }
  };

  const handleUpdateEntry = async (data: any) => {
    updateEntry(data);
  };

  const handleMarkAsPaid = () => {
    const updatedEntry: BKEntry = {
      ...entry,
      paid_amount: entry.total_amount,
    };
    updateEntry(updatedEntry);
  };

  useEffect(() => {
    let revenue = 0;
    let clientRevenue = 0;
    entries.forEach((e) => {
      if (e.contact_id === entry.contact_id) {
        revenue += parseInt(e.total_amount);
        clientRevenue += parseInt(e.total_amount);
      } else {
        revenue += parseInt(e.total_amount);
      }
    });
    setTotalRevenue(revenue);
    setTotalClientRevenue(clientRevenue);
    if (entry.contact_id) {
      getContactInfo(entry.contact_id);
    }
    if (entry.project_id) {
      getProjectInfo(entry.project_id);
    }
  }, [
    entries,
    entry.contact_id,
    entry.project_id,
    getContactInfo,
    getProjectInfo,
  ]);

  return (
    <div className='detail-container'>
      <div className='detail-header'>
        <div className='detail-header-leading'>
          <div className='detail-header-back' onClick={toggleEntry}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>Back</p>
          </div>
          <h2>{entry.entry_name}</h2>
        </div>
        <div className='detail-row'>
          <h3 className='mr-8'>
            {parseDate(entry.entry_date).toLocaleDateString()}
          </h3>
          <FontAwesomeIcon
            className='settings-button'
            icon={faPenToSquare}
            onClick={() => setEditingEntry(!editingEntry)}
          />
        </div>
      </div>
      <div className='detail-main-container'>
        <div className='detail-row jc-sb'>
          <h1 className={entry.transaction_type}>
            $
            {parseFloat(entry.total_amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h1>
          <div className='detail-col align-fe'>
            <h4 className={`${entry.transaction_type}`}>
              {entry.transaction_type}
            </h4>
            <h3>{entry.category}</h3>
          </div>
        </div>
        <div className='detail-row jc-sb'>
          <div style={{ width: `60%` }}>
            <EditField
              label='Description:'
              field='description'
              value={entry.description}
              item={entry}
              onEdit={handleUpdateEntry}
              isInput={false}
            />
          </div>
          <button
            className='button-brand-purple update-payment-button'
            onClick={() => setShowingPaymentModal(true)}
          >
            Update Payment
          </button>
        </div>

        <div className='detail-row jc-sb'>
          <div className='long-detail-card'>
            <div className='detail-row jc-sb pd4'>
              <h3>Paid:</h3>
              <h3>
                $
                {parseFloat(entry.paid_amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className='detail-row jc-sb pd4'>
              <h3>Outstanding:</h3>
              <h3>
                $
                {parseFloat(entry.outstanding_amount).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                  },
                )}
              </h3>
            </div>
            <ProgressBar
              height={30}
              total={parseFloat(entry.total_amount)}
              current={parseFloat(entry.paid_amount)}
            />
          </div>
          <div className='third-detail-card'>
            <div className='detail-col ai-cen'>
              {parseFloat(entry.outstanding_amount) === 0 ? (
                <div className='detail-col ai-cen'>
                  <h2>Paid</h2>
                  <FontAwesomeIcon
                    className='check-icon'
                    icon={faCircleCheck}
                    size='2xl'
                  />
                </div>
              ) : (
                <div className='detail-col ai-cen'>
                  <h2>Next Payment</h2>
                  <CalendarField
                    label=''
                    field='next_payment_date'
                    value={entry.next_payment_date}
                    item={entry}
                    onEdit={handleUpdateEntry}
                  />
                  <button className='card-button' onClick={handleMarkAsPaid}>
                    Mark as paid
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='short-detail-card'>
            <div className='detail-col ac-sb'>
              <h2>Revenue %</h2>
              <div>
                <h4>
                  Total:{' '}
                  {(
                    (parseInt(entry.total_amount) / totalRevenue) *
                    100
                  ).toFixed(0)}
                  %
                </h4>
                {entry.contact_id && (
                  <h4>
                    Client:{' '}
                    {(
                      (parseFloat(entry.total_amount) / totalClientRevenue) *
                      100
                    ).toFixed(0)}
                    %
                  </h4>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='detail-row jc-sb'>
          <div
            className={`third-detail-card pd4 ${
              entry.contact_id ? 'hoverable' : ''
            }`}
            style={{ width: '49%' }}
            onClick={
              contact && entry.contact_id
                ? () => toggleContact(contact)
                : undefined
            }
          >
            {contact && entry.contact_id ? (
              <div className='detail-col pd4'>
                <h3>
                  {contact.first_name} {contact.last_name}
                </h3>
                <h4>{contact.email}</h4>
                <h4>{contact.phone}</h4>
                <h4>Upcoming Events: {contact.events.length}</h4>
              </div>
            ) : (
              <div className='detail-col ai-cen'>
                <p className='filler-text'>No Contact Connected</p>
                <button
                  className=' main-button button-brand-pink'
                  onClick={() => setShowingContactModal(true)}
                >
                  Connect Contact
                </button>
              </div>
            )}
          </div>
          {/* <div className='third-detail-card pd4 ai-cen'>
            {contact ? (
              <div className='detail-col'>
                <h3>Invoice</h3>
              </div>
            ) : (
              <div className='detail-col jc-cen'>
                <p className='filler-text'>No Invoice Connected</p>

                <button className='main-button button-brand-purple'>
                  Generate Invoice
                </button>
              </div>
            )}
          </div> */}
          <div
            className={`third-detail-card pd4 ${
              entry.project_id ? 'hoverable' : ''
            }`}
            style={{ width: '49%' }}
            onClick={
              project && entry.project_id
                ? () => toggleProject(project, project.id)
                : undefined
            }
          >
            {project && entry.project_id ? (
              <div className='detail-col pd4'>
                <h3>{project.name}</h3>
                <p style={{ fontSize: '0.80rem' }}>{project.description}</p>
              </div>
            ) : (
              <div className='detail-col ai-cen'>
                <p className='filler-text'>No Project Connected</p>
                <button
                  className=' main-button button-brand-lighter-blue'
                  onClick={() => setShowingProjectModal(true)}
                >
                  Connect Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {editingEntry && (
        <EditBKEntry
          id={user.account?.id}
          entry={entry}
          setEditingEntry={setEditingEntry}
        />
      )}
      {showingContactModal && (
        <ConnectDataModal
          onSubmit={handleConnectContact}
          onLoad={getContacts}
          setShowingModal={setShowingContactModal}
          currentItem='contact'
          connectingItem='entry'
          data={contacts}
          setData={setSelectedContact}
          height='200px'
          width='400px'
        />
      )}
      {showingProjectModal && (
        <ConnectDataModal
          onSubmit={handleConnectProject}
          onLoad={getProjects}
          setShowingModal={setShowingProjectModal}
          currentItem='project'
          connectingItem='entry'
          data={projects}
          setData={setSelectedProject}
          height='200px'
          width='400px'
        />
      )}
      {showingPaymentModal && (
        <UpdateBKPaymentModal
          setShowingProjectModal={setShowingPaymentModal}
          entry={entry}
        />
      )}
    </div>
  );
};

export default BKEntryDetail;
