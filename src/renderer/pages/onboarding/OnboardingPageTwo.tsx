import React from 'react';

const OBPageTwo: React.FC = () => {
  const projectFeatures = [
    {
      title: 'Effortless Project Management',
      description:
        'Organize your projects seamlessly with intuitive Kanban boards or list views. Assign tasks and subtasks with customizable due dates, and effortlessly track project statuses from inception to completion.',
    },
    {
      title: 'Dynamic CRM Integration',
      description:
        'Easily track upcoming events for clients and sort them by name, date added, or last contacted. Access vital contact info including company details, contact numbers, socials, birthdays, and effortlessly link associated projects or documents.',
    },
    {
      title: 'Streamlined Bookkeeping',
      description:
        'Gain insights with an overview of profits, revenue, expenses, and outstanding payments. Easily categorize entries into all, income, or expenses, track recurring expenses, and delve into each entry for detailed information such as total revenue, next payment, and associated projects.',
    },
    // {
    //   title: 'Centralized Document Management',
    //   description:
    //     'Say goodbye to scattered documents. Store invoices, contracts, and more for each contact efficiently. Keep everything organized and accessible, making retrieval and management a breeze.',
    // },
  ];
  return (
    <div className='onboarding-page-container'>
      <h2>Core Features</h2>
      <div className='onboarding-feature-list'>
        {projectFeatures.map((feature, index) => (
          <div className='onboarding-feature-item' key={index}>
            <h3 className='feature-title'>{feature.title}</h3>
            <p className='feature-description'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OBPageTwo;
