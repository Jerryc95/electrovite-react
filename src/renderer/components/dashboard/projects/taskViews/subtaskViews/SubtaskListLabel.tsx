import React from 'react';

const SubtaskListLabel: React.FC = () => {
  return (
    <div className='task-list-label-container'>
      <p className='subtask-name-label'>Task</p>
      <p className='subtask-priority-label'>Priority</p>
      <p className='subtask-status-label'>Status</p>
      <p className='subtask-due-date-label'>Due Date</p>
    </div>
  );
};

export default SubtaskListLabel;
