import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { Draggable } from 'react-beautiful-dnd';

import {  selectTask } from '../../../../../services/taskSlice';
import ProgressBar from '$renderer/components/ProgressBar';
import { Task } from 'src/models/task';
import { taskStatus } from '../../../../../statuses/taskStatus';
import { parseDate } from '../../../../../helpers/ParseDate';


interface KanbanCardProps {
  index: number;
  task: Task;
  tasks: Task[];
}

const KanbanCard: React.FC<KanbanCardProps> = ({ index, task }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectName } = useParams();


  const [uncompletedSubtasks, setUncompletedSubtasks] = useState(0);
  const [completedSubTask, setCompletedSubTasks] = useState(0);
  const [totalSubtasks, setTotalSubtasks] = useState(
    uncompletedSubtasks + completedSubTask,
  );

  const toggleTask = (task: Task) => {
    dispatch(selectTask(task));
    navigate(
      `/projects/${projectName?.replaceAll(' ', '-')}/${task.name.replaceAll(
        ' ',
        '-',
      )}`,
    );
  };

  const getDaysRemaining = (date: Date) => {
    const currentDate = new Date();
    const dueDate = new Date(date);
    const timeDifference = dueDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    if (daysRemaining > 7) {
      return `Due: ${parseDate(task.due_date).toLocaleDateString(
        undefined,
        options,
      )}`;
    } else if (daysRemaining <= 7 && daysRemaining > 1) {
      return `Due in ${daysRemaining} Days`;
    } else if (daysRemaining == 1) {
      return `Due tomorrow`;
    } else if (daysRemaining == 0) {
      return `Due today`;
    } else {
      return 'Overdue';
    }
  };

  useEffect(() => {
      let uncompleted = 0;
      let completed = 0;
      setTotalSubtasks(task.subtasks.length);
      task.subtasks.forEach((subtask) => {
        if (subtask.subtask_status === taskStatus.Completed) {
          completed += 1;
        } else {
          uncompleted += 1;
        }
      });
      setUncompletedSubtasks(uncompleted);
      setCompletedSubTasks(completed);
  }, [task.subtasks]);
  return (
    <Draggable draggableId={task.task_id.toString()} index={index}>
      {(provided) => (
        <div
          className='kanban-card-container hover'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => toggleTask(task)}
        >
          <div>
            <div className='row space-between'>
              <h4 className='task-name'>{task.name}</h4>
              <span className={`task-priority ${task.priority}`}>
                {task.priority}
              </span>
            </div>
            <div className='row'>
              <FontAwesomeIcon
                icon={faCalendar}
                className='task-due-date-icon'
              />
              <p className='task-due-date'>{getDaysRemaining(task.due_date)}</p>
            </div>
          </div>
          {totalSubtasks !== 0 ? (
            <div className='row'>
              <ProgressBar
                current={completedSubTask}
                total={totalSubtasks}
                height={15}
              />
              <span className='progress-count'>
                {completedSubTask}/{totalSubtasks}
              </span>
            </div>
          ) : (
            <span className='no-tasks'>No subtasks added</span>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
