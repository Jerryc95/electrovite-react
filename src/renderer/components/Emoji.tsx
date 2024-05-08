import React from 'react';

interface EmojiProps {
  cName: string;
  symbol: string;
  onClick: () => void;
}

const Emoji: React.FC<EmojiProps> = ({ cName, symbol, onClick }) => {
  return (
    <div>
      <span className={cName} onClick={onClick}>
        {symbol}
      </span>
    </div>
  );
};

export default Emoji;
