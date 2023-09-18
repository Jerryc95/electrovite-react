import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';

import Avatar from './Avatar';
import exampleAvatar from '../../../assets/Avatars/exampleAvatar.png';
import { RootState } from '../../services/store';

interface AvatarPickerProps {
  setSelectedProfilePic: React.Dispatch<React.SetStateAction<string>>;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  setSelectedProfilePic: setSelectedProfile,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const profilePic = useSelector(
    (state: RootState) => state.accountReducer.accountProfile?.profile_pic,
  );

  const avatars = [
    exampleAvatar,
    exampleAvatar,
    exampleAvatar,
    exampleAvatar,
    exampleAvatar,
  ];

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAvatarSelection = (index: number, avatar: string) => {
    setSelectedAvatar(index);
    setShowDropdown(!showDropdown);
    setSelectedProfile(avatar);
    console.log(avatar);
  };

  useEffect(() => {
    if (!profilePic) {
      setSelectedAvatar(0);
      setSelectedProfile(avatars[0]);
    }
  },[]);

  return (
    <div>
      <div className='selected-avatar'>
        <Avatar
          cName='avatar-edit'
          src={avatars[selectedAvatar]}
          alt='Selected Avatar'
          onClick={handleAvatarClick}
        />
      </div>

      {showDropdown && (
        <ul className='avatar-selection-list'>
          {avatars.map((avatar, index) => (
            <li>
              <Avatar
                cName='avatar-edit'
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                onClick={() => handleAvatarSelection(index, avatar)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvatarPicker;
