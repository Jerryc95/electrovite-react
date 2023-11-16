import React from 'react';
import { Task } from 'src/models/task';
import TaskListItem from './TaskListItem';
import TaskListLabel from './TaskListLabel';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task>>;
  setShowingTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setSelectedTask,
  setShowingTask,
}) => {

  return (
    <div className='task-list-container'>
      <TaskListLabel />
      {tasks.map((task) => (
        <TaskListItem
          task={task}
          setSelectedTask={setSelectedTask}
          setShowingTask={setShowingTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
