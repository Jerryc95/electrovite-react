import React from 'react';
import { Subtask } from 'src/models/subTask';
import SubtaskListLabel from './SubtaskListLabel';
import SubtaskListItem from './SubtaskListItem';

interface SubtaskListProps {
  subtasks: Subtask[];
}

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks
}) => {

  return (
    <div className='task-list-container'>
      <SubtaskListLabel />
      {subtasks.map((subtask) => (
    <SubtaskListItem subtask={subtask}
    />
      ))}
    </div>
  );
};

export default SubtaskList;
