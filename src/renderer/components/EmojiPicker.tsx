import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';

// import Avatar from './Avatar';
// import exampleAvatar from '../../../assets/Avatars/exampleAvatar.png';
import Emoji from './Emoji';
import { RootState } from '../../services/store';

import '../styles/avatar.scss';

interface EmojiPickerProps {
//   setSelectedProfilePic: React.Dispatch<React.SetStateAction<string>>;
  onChange: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
//   setSelectedProfilePic,
  onChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('👨‍💻');

  const profilePic = useSelector(
    (state: RootState) => state.accountReducer.accountProfile?.profile_pic,
  );

  const emojis = ['👨‍💻', '👩‍💻', '💻', '🗄️', '📁', '📎', '📝', '🖊️', '📚', '📇'];

  const handleEmojiClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEmojiSelection = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowDropdown(!showDropdown);
    // setSelectedProfilePic(emoji);
    onChange(emoji)
  };

  useEffect(() => {
    if (profilePic) {
      setSelectedEmoji(profilePic);
      onChange(profilePic)
    //   setSelectedProfilePic(profilePic);
    }
  }, []);

  return (
    <div>
      <div className='selected-avatar'>
        <Emoji
          cName='avatar-edit'
          symbol={selectedEmoji}
          onClick={handleEmojiClick}
        />
      </div>

      {showDropdown && (
        <ul className='avatar-selection-list'>
          {emojis.map((emoji, index) => (
            <li key={index}>
              <Emoji
                cName='avatar-edit'
                symbol={emoji}
                onClick={() => handleEmojiSelection(emoji)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmojiPicker;
