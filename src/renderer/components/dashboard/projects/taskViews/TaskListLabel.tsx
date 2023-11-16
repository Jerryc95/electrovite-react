import React from 'react';

const TaskListLabel: React.FC = () => {
  return (
    <div className='task-list-label-container'>
      <p className='task-name-label'>Task</p>
      <p className='task-progress-label'>Progress</p>
      <p className='task-priority-label'>Priority</p>
      <p className='task-status-label'>Status</p>
      <p className='task-due-date-label'>Due Date</p>
    </div>
  );
};

export default TaskListLabel;
