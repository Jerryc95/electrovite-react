import React from 'react';

const OBPageThree: React.FC = () => {
  const connectionFeatures = [
    {
      title: 'Data Connection',
      description:
        'Seamlessly connect your projects to the respective clients, ensuring clear communication and streamlined management. Additionally, link specific entries to projects or clients for detailed tracking and organization, providing a comprehensive overview of your business activities.',
    },
    {
      title: 'Deep Linking',
      description:
        'Seamlessly navigate between sections when viewing connected data. Quickly jump to the details of that data without having to traverse through the entire app.',
    },
    { title: '', description: '' },
  ];

  return (
    <div className='onboarding-page-container'>
      <h2>Intuitive Integrated Platform</h2>
      <p className='onboarding-subheader'>
        With Flowplanr's multi-functional approach, incorporating project
        management, CRM, and bookkeeping capabilities, seamlessly connecting and
        organizing them together becomes incredibly straightforward.
      </p>
      <div className='onboarding-feature-list'>
        {connectionFeatures.map((feature, index) => (
          <div className='onboarding-feature-item' key={index}>
            <h3 className='feature-title'>{feature.title}</h3>
            <p className='feature-description'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OBPageThree;
