import React, { useState, useEffect } from 'react';
import '../styles/progressBar.scss';

interface ProgressBarProps {
  total: number;
  current: number;
  height: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  current,
  height,
}) => {
  const [totalAmount, setTotalAmount] = useState(total);
  const [currentAmount, setCurrentAmount] = useState(current);
  const [progressPercent, setProgressPercent] = useState(
    (currentAmount / totalAmount) * 100,
  );

  useEffect(() => {
    setTotalAmount(total);
    setCurrentAmount(current);
    setProgressPercent((currentAmount / totalAmount) * 100);
  }, [current, currentAmount, total, totalAmount]);

  return (
    <div className='progress-bar-container'>
      <div className='progress-bar' style={{ height: `${height}px` }}>
        <div
          className='progress'
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;