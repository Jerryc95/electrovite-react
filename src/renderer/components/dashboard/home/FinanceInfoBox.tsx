import React, { useEffect, useState } from 'react';

interface FinanceInfoBoxProps {
  label: string;
  amount: number;
}

const FinanceInfoBox: React.FC<FinanceInfoBoxProps> = ({ label, amount }) => {
    // const [totalAmount, setTotalAmount] = useState(0)
//   useEffect(() => {
//     let total = 0;
//     for (const entry of entries) {
//         total += parseInt(entry.total_amount);
//     }
//     setTotalAmount(total)
//   }, []);
  return (
    <div className='client-overview-container'>
      <div className='overview-row'>
        <h4>{label}: </h4>
        <h4>${amount}</h4>
        {/* <div className={`client-overview-percent-container`}>
        <p>{totalExpenses}</p>
      </div> */}
      </div>
    </div>
  );
};

export default FinanceInfoBox;
