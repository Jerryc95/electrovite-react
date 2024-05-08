import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import { Task } from 'src/models/task';
import { Project } from 'src/models/project';

import '../../../../styles/tasks.scss';
import ProgressBar from '$renderer/components/ProgressBar';
import DropdownField from '$renderer/components/DropdownField';
import EditField from '$renderer/components/EditField';
import { taskStatus } from '../../../../../statuses/taskStatus';
import { priorityStatus } from '../../../../../statuses/priorityStatus';
import NewSubtask from './subtaskViews/NewSubtask';
import STKanbanBoard from './subtaskViews/STKanbanBoard';
import SubtaskList from './subtaskViews/SubtaskList';
import EditTask from './EditTask';
import useBackClick from '../../../../../hooks/useBackClick';
import { useFetchSubtasksQuery } from '../../../../../services/subtaskAPI';
import {
  clearSubtaskState,
  selectedSubtasks,
} from '../../../../../services/subtaskSlice';
import { useUpdateTaskMutation } from '../../../../../services/taskAPI';

interface TaskDetailProps {
  task: Task;
  id: number | undefined;
  project: Project;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, id, project }) => {
  const subtasks = useSelector(selectedSubtasks);
  const goBack = useBackClick();

  const [addingSubtask, setAddingSubtask] = useState(false);
  const [editingTask, setEditingTask] = useState(false);
  const [completedSubtasks, setCompletedSubtasks] = useState(0);
  const [totalSubtasks, setTotalSubtasks] = useState(0);
  const [subtaskView, setSubtaskView] = useState('Board');
  const viewOptions = ['Board', 'List'];
 
  const fetchSubtasks = useFetchSubtasksQuery(task.task_id, {
    refetchOnMountOrArgChange: true,
  });
  const [updateTask] = useUpdateTaskMutation();

  const toggleTask = () => {
    clearSubtaskState();
    goBack();
  };

  const toggleEditTask = () => {
    setEditingTask(!editingTask);
  };

  const handleUpdateTask = async (data: any) => {
    updateTask(data);
  };

  const toggleView = useCallback((view: string) => {
    setSubtaskView(view);
  }, []);


  useEffect(() => {
    let uncompleted = 0;
    let completed = 0;
    subtasks.forEach((subtask) => {
      if (subtask.subtask_status === taskStatus.Completed) {
        completed += 1;
      } else {
        uncompleted += 1;
      }
    });
    setCompletedSubtasks(completed);
    setTotalSubtasks(uncompleted + completed);
  }, [subtasks]);

  useEffect(() => {
    clearSubtaskState();
    fetchSubtasks;
  }, [fetchSubtasks]);

  useEffect(() => {
    toggleView('Board');
  }, [toggleView]);

  return (
    <div className='task-detail-container'>
      <div className='task-detail-header'>
        <div className='task-detail-leading'>
          <div className='task-detail-back' onClick={() => toggleTask()}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>{project.name}</p>
          </div>
          <h2>{task.name}</h2>
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
                {totalSubtasks == 0 ? (
                  <div>
                    <p>{`Task Progress: No subtasks added.`}</p>
                    <ProgressBar
                      current={completedSubtasks}
                      total={1}
                      height={20}
                    />
                  </div>
                ) : (
                  <div>
                    <p>{`Task Progress: No subtasks completed.`}</p>
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
            <DropdownField
              label='Task Status:'
              field='taskStatus'
              value={task.task_status}
              item={task}
              options={taskStatus}
              onEdit={handleUpdateTask}
            />
          </div>
          <div>
            <DropdownField
              label='Priority:'
              field='priority'
              value={task.priority}
              item={task}
              options={priorityStatus}
              onEdit={handleUpdateTask}
            />
          </div>
        </div>
        <div style={{ width: `60%` }}>
          <EditField
            label='Description:'
            field='description'
            value={task.description}
            item={task}
            isInput={false}
            onEdit={handleUpdateTask}
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
            <p className='info-text'>Subtasks will appear here once added.</p>
          ) : (
            // <div> {componentView}</div>
            <div>
            {subtaskView == 'Board' ? (
              <>
                <STKanbanBoard subtasks={subtasks} />
              </>
            ) : (
              <>
                <SubtaskList subtasks={subtasks} />
              </>
            )}
          </div>
          )}
        </div>
      </div>
      {addingSubtask && (
        <NewSubtask
          setAddingSubtask={setAddingSubtask}
          accountID={id}
          taskID={task.task_id}
          subtasks={subtasks}
        />
      )}
      {editingTask && <EditTask task={task} setEditingTask={setEditingTask} />}
    </div>
  );
};

export default TaskDetail;
