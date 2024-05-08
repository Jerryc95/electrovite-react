import React from 'react';
import { Task } from 'src/models/task';
import TaskListItem from './TaskListItem';
import TaskListLabel from './TaskListLabel';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className='task-list-container'>
      <TaskListLabel />
      {tasks.map((task, index) => (
        <TaskListItem key={index} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
