import React from 'react';

interface Subscription {
    id: number;
    name: string;
    description: string;
    price: number;
    billing_cycle: string;
    features: string[];
  }
  

interface SubPlanPaymentPageProps {
    setCreationStep: React.Dispatch<React.SetStateAction<number>>;
    subscription: Subscription | null
}

const SubPlanPaymentPage: React.FC<SubPlanPaymentPageProps> = ({setCreationStep, subscription}) => {
    const handleBackClick = () => {
        setCreationStep(1)
    }

  return (
    <div>
      <button onClick={handleBackClick}>Back</button>
      <div>{subscription?.name}</div>
    </div>
  );
};

export default SubPlanPaymentPage;
