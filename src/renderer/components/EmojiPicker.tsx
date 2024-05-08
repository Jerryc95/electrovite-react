import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';

// import Avatar from './Avatar';
// import exampleAvatar from '../../../assets/Avatars/exampleAvatar.png';
import Emoji from './Emoji';
import { RootState } from '../../services/store';

interface EmojiPickerProps {
  setSelectedProfilePic: React.Dispatch<React.SetStateAction<string>>;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  setSelectedProfilePic: setSelectedProfile,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(0);

  const profilePic = useSelector(
    (state: RootState) => state.accountReducer.accountProfile?.profile_pic,
  );

  const emojis = [
    '👨‍💻',
    '👩‍💻',
    '💻',
    '🗄️',
    '📁',
    '📎',
    '📝',
    '🖊️',
    '📚',
    '📇',
  ];

  const handleEmojiClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEmojiSelection = (index: number, emoji: string) => {
    setSelectedEmoji(index);
    setShowDropdown(!showDropdown);
    setSelectedProfile(emoji);
  };

  useEffect(() => {
    if (!profilePic) {
      setSelectedEmoji(0);
      setSelectedProfile(emojis[0]);
    }
  }, []);

  return (
    <div>
      <div className='selected-avatar'>
        <Emoji
          cName='avatar-edit'
          symbol={emojis[selectedEmoji]}
          onClick={handleEmojiClick}
        />
      </div>

      {showDropdown && (
        <ul className='avatar-selection-list'>
          {emojis.map((emoji, index) => (
            <li>
              <Emoji
                cName='avatar-edit'
                symbol={emoji}
                onClick={() => handleEmojiSelection(index, emoji)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmojiPicker;
