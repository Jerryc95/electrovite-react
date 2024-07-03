import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectContact } from '../services/contactSlice';
import { Contact } from 'src/models/contact';

const useToggleContact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleContact = useCallback(
    (contact: Contact) => {
      dispatch(selectContact(contact));
      navigate(
        `/contacts/${contact.first_name.replaceAll(
          ' ',
          '-',
        )}-${contact.last_name.replaceAll(' ', '-')}`,
      );
    },
    [dispatch, navigate],
  );

  return toggleContact;
};

export default useToggleContact;
