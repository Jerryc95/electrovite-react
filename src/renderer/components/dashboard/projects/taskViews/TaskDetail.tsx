import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Subtask } from 'src/models/subTask';
import { Task } from 'src/models/task';
import { Project } from 'src/models/project';

import '../../../../styles/tasks.scss';
import ProgressBar from '$renderer/components/ProgressBar';
import DropdownField from '$renderer/components/DropdownField';
import EditField from '$renderer/components/EditField';
import { taskStatus } from '../../../../../statuses/taskStatus';
import { priorityStatus } from '../../../../../statuses/priorityStatus';
import NewSubtask from './NewSubTask';
import STKanbanBoard from './subtaskViews/STKanbanBoard';
import SubtaskList from './subtaskViews/SubtaskList';

interface TaskDetailProps {
  project: Project;
  task: Task;
  setShowingTask: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  project,
  task,
  setShowingTask,
  accountID,
}) => {
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [uncompletedSubtasks, setUncompletedSubtasks] = useState(0);
  const [completedSubtasks, setCompletedSubtasks] = useState(0);
  const [totalSubtasks, setTotalSubtasks] = useState(0);
  const [subtaskView, setSubtaskView] = useState('Board');
  const viewOptions = ['Board', 'List'];
  const [componentView, setComponentView] = useState<JSX.Element>(
    <STKanbanBoard subtasks={subtasks} setSubtasks={setSubtasks} />,
  );

  const toggleTask = () => {
    setShowingTask(false);
  };

  const toggleView = (view: string) => {
    setSubtaskView(view);

    switch (view) {
      case 'Board':
        setComponentView(
          <STKanbanBoard subtasks={subtasks} setSubtasks={setSubtasks} />,
        );
        break;
      case 'List':
        setComponentView(<SubtaskList subtasks={subtasks} />);
    }
  };

  useEffect(() => {
    let uncompleted = 0;
    let completed = 0;
    const url = `http://localhost:3000/subtasks?id=${task.task_id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: Subtask[]) => {
        setSubtasks(data);
        setTotalSubtasks(data.length);
        data.forEach((subtask) => {
          if (subtask.subtask_status === taskStatus.Completed) {
            completed += 1;
          } else {
            uncompleted += 1;
          }
        });
        setUncompletedSubtasks(uncompleted);
        setCompletedSubtasks(completed);
      });
  }, []);

  useEffect(() => {
    if (subtaskView === 'Board') {
      setComponentView(
        <STKanbanBoard subtasks={subtasks} setSubtasks={setSubtasks} />,
      );
    } else {
      setComponentView(
        <STKanbanBoard subtasks={subtasks} setSubtasks={setSubtasks} />,
      );
    }
  }, [subtasks]);

  return (
    <div className='task-detail-container'>
      <div className='task-detail-header'>
        <div className='task-detail-leading'>
          <div className='task-detail-back' onClick={toggleTask}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>{project.name}</p>
          </div>
          <h2>{task.name}</h2>
        </div>

        <div className='task-detail-trailing'>
          <button className='add-button' onClick={() => setAddingSubtask(true)}>
            Add Subtask
          </button>
        </div>
      </div>
      <div className='task-detail-top-container'>
        <div className='task-detail-header'>
          <div className='progress-bar-container'>
            {completedSubtasks !== 0 ? (
              <div>
                <p>{`Task Progress: ${completedSubtasks}/${totalSubtasks} Completed`}</p>
                <ProgressBar
                  current={completedSubtasks}
                  total={totalSubtasks}
                  height={20}
                />
              </div>
            ) : (
              <div>
                <p>{`Task Progress: No subtasks added`}</p>
                <ProgressBar
                  current={completedSubtasks}
                  total={1}
                  height={20}
                />
              </div>
            )}
          </div>
          <div>
            <DropdownField
              label='Task Status:'
              field='task_status'
              value={task.task_status}
              id={task.task_id}
              options={taskStatus}
              baseURL=''
            />
          </div>
          <div>
            <DropdownField
              label='Priority:'
              field='priority'
              value={task.priority}
              id={task.task_id}
              options={priorityStatus}
              baseURL=''
            />
          </div>
        </div>
        <div style={{ width: `60%` }}>
          <EditField
            label='Description:'
            field='description'
            value={task.description}
            id={task.task_id}
            isInput={false}
            baseURL=''
          />
        </div>
      </div>
      <div className='task-detail-bottom-container'>
        <h3>Subtasks</h3>
        <div className='view-options'>
          {viewOptions.map((option) => (
            <div
              key={option}
              onClick={() => toggleView(option)}
              className={`sort-capsule ${option} ${
                subtaskView === option ? 'selected' : ''
              }`}
            >
              {option}
            </div>
          ))}
        </div>
        {/* <div>{componentView}</div> */}
        <div className='task-detail-board'>
          {subtasks.length === 0 ? (
            <p>Subtasks will appear here once added.</p>
          ) : (
            <div>{componentView}</div>
          )}
        </div>
      </div>
      {addingSubtask && (
        <NewSubtask
          setAddingSubtask={setAddingSubtask}
          accountID={accountID}
          taskID={task.task_id}
          setSubtasks={setSubtasks}
          subTasks={subtasks}
        />
      )}
    </div>
  );
};

export default TaskDetail;
