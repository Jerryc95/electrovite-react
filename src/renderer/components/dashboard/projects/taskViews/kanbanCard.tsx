import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { Draggable } from 'react-beautiful-dnd';

import { selectTask } from '../../../../../services/taskSlice';
import ProgressBar from '$renderer/components/ProgressBar';
import { Task } from 'src/models/task';
import { taskStatus } from '../../../../../statuses/taskStatus';

interface KanbanCardProps {
  index: number;
  task: Task;
  tasks: Task[];
  //   setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  // setSelectedTask: React.Dispatch<React.SetStateAction<Task>>;
  // setShowingTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  index,
  task,
  // setSelectedTask,
  // setShowingTask,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectName } = useParams();

  const [uncompletedSubTasks, setUncompletedSubTasks] = useState(0);
  const [completedSubTask, setCompletedSubTasks] = useState(0);
  const [totalSubTasks, setTotalSubTasks] = useState(
    uncompletedSubTasks + completedSubTask,
  );

  const toggleTask = (task: Task) => {
    // setSelectedTask(task);
    // setShowingTask(true);
    dispatch(selectTask(task));
    navigate(
      `/projects/${projectName?.replaceAll(' ', '-')}/${task.name.replaceAll(
        ' ',
        '-',
      )}`,
    );
  };

  const dateParser = (date: Date) => {
    return new Date(date);
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
      return `Due: ${dateParser(task.due_date).toLocaleDateString(
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
    if (task.subtasks) {
      let uncompleted = 0;
      let completed = 0;
      setTotalSubTasks(task.subtasks.length);
      task.subtasks.forEach((subtask) => {
        if (subtask.subtask_status === taskStatus.Completed) {
          completed += 1;
        } else {
          uncompleted += 1;
        }
      });
      setUncompletedSubTasks(uncompleted);
      setCompletedSubTasks(completed);
    }
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
          {totalSubTasks !== 0 ? (
            <div className='row'>
              <ProgressBar
                current={completedSubTask}
                total={totalSubTasks}
                height={15}
              />
              <span className='progress-count'>
                {completedSubTask}/{totalSubTasks}
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
