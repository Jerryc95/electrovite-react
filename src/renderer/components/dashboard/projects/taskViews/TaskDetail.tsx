import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

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
import EditTask from './EditTask';

interface TaskDetailProps {
  task: Task;
  setShowingTask: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
  // tasks: Task[];
  project: Project;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  setShowingTask,
  accountID,
  // tasks,
  project,
}) => {
  // remove subtasks and setsubtasks and replace with passed task.subtasks
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [editingTask, setEditingTask] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState(0);
  const [totalSubtasks, setTotalSubtasks] = useState(0);
  const [subtaskView, setSubtaskView] = useState('Board');
  const viewOptions = ['Board', 'List'];
  const [taskName, setTaskName] = useState('');
  const [componentView, setComponentView] = useState<JSX.Element>(
    <STKanbanBoard
      subtasks={subtasks}
      setSubtasks={setSubtasks}
      // setTasks={setTasks}
      task={task}
    />,
  );

  const toggleTask = (id: number) => {
    // const updatedTasks = tasks.map((t) => {
    //   if (id === t.task_id) {
    //     return task;
    //   } else {
    //     return t;
    //   }
    // });
    // setTasks(updatedTasks);
    setShowingTask(false);
  };

  const toggleEditTask = () => {
    setEditingTask(!editingTask);
  };

  const toggleView = (view: string) => {
    setSubtaskView(view);

    switch (view) {
      case 'Board':
        setComponentView(
          <STKanbanBoard
            subtasks={subtasks}
            setSubtasks={setSubtasks}
            // setTasks={setTasks}
            task={task}
          />,
        );
        break;
      case 'List':
        setComponentView(<SubtaskList subtasks={subtasks} />);
    }
  };

  useEffect(() => {
    let completed = 0;
    setSubtasks(task.subTasks);
    setTotalSubtasks(task.subTasks.length);
    task.subTasks.forEach((subtask) => {
      if (subtask.subtask_status === taskStatus.Completed) {
        completed += 1;
      }
    });
    setCompletedSubtasks(completed);
  }, []);

  // useEffect(() => {
  //   let completed = 0;
  //   const url = `http://localhost:3000/subtasks?id=${task.task_id}`;
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((data: Subtask[]) => {
  //       setSubtasks(data);
  //       setTotalSubtasks(data.length);
  //       data.forEach((subtask) => {
  //         if (subtask.subtask_status === taskStatus.Completed) {
  //           completed += 1;
  //         }
  //       });
  //       setCompletedSubtasks(completed);
  //     });
  // }, []);

  useEffect(() => {
    console.log('rendered');
    let uncompleted = 0;
    let completed = 0;
    setTaskName(task.name);
    subtasks.forEach((subtask) => {
      if (subtask.subtask_status === taskStatus.Completed) {
        completed += 1;
      } else {
        uncompleted += 1;
      }
    });
    setCompletedSubtasks(completed);
    setTotalSubtasks(uncompleted + completed);
  }, [subtasks, task.name, task.subTasks.length]);

  useEffect(() => {
    if (subtaskView === 'Board') {
      setComponentView(
        <STKanbanBoard
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          // setTasks={setTasks}
          task={task}
        />,
      );
    } else {
      setComponentView(
        <STKanbanBoard
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          // setTasks={setTasks}
          task={task}
        />,
      );
    }
  }, [subtasks]);

  return (
    <div className='task-detail-container'>
      <div className='task-detail-header'>
        <div className='task-detail-leading'>
          <div
            className='task-detail-back'
            onClick={() => toggleTask(task.task_id)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>{project.name}</p>
          </div>
          <h2>{taskName}</h2>
        </div>

        <div className='task-detail-trailing'>
          <button className='add-button' onClick={() => setAddingSubtask(true)}>
            Add Subtask
          </button>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className='task-detail-settings'
            onClick={toggleEditTask}
          />
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
                {subtasks.length != 0 ? (
                  <div>
                    <p>{`Task Progress: No subtasks started.`}</p>
                    <ProgressBar
                      current={completedSubtasks}
                      total={1}
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
            )}
          </div>
          <div>
            {/* these need to be swapped out so the code is in the file */}
            <DropdownField
              label='Task Status:'
              field='taskStatus'
              value={task.task_status}
              id={task.task_id}
              options={taskStatus}
              baseURL='http://localhost:3000/tasks/update/'
            />
          </div>
          <div>
            <DropdownField
              label='Priority:'
              field='priority'
              value={task.priority}
              id={task.task_id}
              options={priorityStatus}
              baseURL='http://localhost:3000/tasks/update/'
            />
          </div>
        </div>
        <div style={{ width: `60%` }}>
          {/* this needs to be fixed so the state also updates */}
          <EditField
            label='Description:'
            field='description'
            value={task.description}
            id={task.task_id}
            isInput={false}
            baseURL='http://localhost:3000/tasks/update/'
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
        <div className='task-detail-board'>
          {subtasks.length === 0 ? (
            <p>Subtasks will appear here once added.</p>
          ) : (
            // <div>{componentView}</div>
            <div>
              {' '}
              <STKanbanBoard
                subtasks={subtasks}
                setSubtasks={setSubtasks}
                // setTasks={setTasks}
                task={task}
              />
            </div>
          )}
        </div>
      </div>
      {/* prob need to add set tasks here too  */}
      {addingSubtask && (
        <NewSubtask
          setAddingSubtask={setAddingSubtask}
          accountID={accountID}
          taskID={task.task_id}
          // setSubtasks={setSubtasks}
          // subTasks={subtasks}
          // add task here
        />
      )}
      {editingTask && (
        <EditTask
          task={task}
          setEditingTask={setEditingTask}
          // setTasks={setTasks}
          // tasks={tasks}
          setShowingTask={setShowingTask}
          setTaskName={setTaskName}
        />
      )}
    </div>
  );
};

export default TaskDetail;
