import React from 'react';

import '../styles/avatar.scss';

interface AvatarProps {
  cName: string;
  src: string;
  alt: string;
  onClick: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ cName, src, alt, onClick }) => (
  <img className={cName} src={src} alt={alt} onClick={onClick} />
);

export default Avatar;
