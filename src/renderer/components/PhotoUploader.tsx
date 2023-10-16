import React from 'react';


interface PhotoUploaderProps {
    selectedPhoto: File | null | undefined
    setSelectedPhoto: React.Dispatch<React.SetStateAction<File | null | undefined>>
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({selectedPhoto, setSelectedPhoto}) => {
 


  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    setSelectedPhoto(photo);


  };

  return (
    <div>
      <input type='file' accept='.png, .jpeg, .jpg' onChange={handlePhotoChange} />
    </div>
  );
};

export default PhotoUploader;
