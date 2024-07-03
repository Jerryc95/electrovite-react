import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

import ProgressBar from '$renderer/components/ProgressBar';
import { taskStatus } from '../../../../statuses/taskStatus';
import { parseDate } from '../../../../helpers/ParseDate';
import useToggleProject from '../../../../hooks/useToggleProject';

interface ISubtask {
  subtask_id: number;
  task_id: number;
  subtask_status: string;
}

interface UpcomingTask {
  project_id: number;
  project_name: string;
  task_id: number;
  name: string;
  due_date: Date;
  task_status: string;
  completed: boolean;
  priority: string;
  subtasks: ISubtask[];
}
interface UpcomingTaskProps {
  upcomingTask: UpcomingTask;
}

const UpcomingTaskView: React.FC<UpcomingTaskProps> = ({ upcomingTask }) => {
  const toggleProject = useToggleProject();

  const [completedSubtasks, setCompletedSubtasks] = useState(0);
  const [totalSubtasks, setTotalSubtasks] = useState(0);

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
      return `Due: ${parseDate(upcomingTask.due_date).toLocaleDateString(
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
    if (upcomingTask.subtasks) {
      upcomingTask.subtasks.forEach((subtask) => {
        if (subtask.subtask_status === taskStatus.Completed) {
          completed += 1;
        } else {
          uncompleted += 1;
        }
      });
      setCompletedSubtasks(completed);
      setTotalSubtasks(uncompleted + completed);
    }
  }, []);

  return (
    <div
      className='kanban-card-container hoverable'
      style={{ height: '150px' }}
      onClick={() => toggleProject(null, upcomingTask.project_id)}
    >
      <div>
        <h5>{upcomingTask.project_name}</h5>
        <div className='row space-between'>
          <h4 className='task-name'>{upcomingTask.name}</h4>
          <span className={`task-priority ${upcomingTask.priority}`}>
            {upcomingTask.priority}
          </span>
        </div>
        <div className='row'>
          <FontAwesomeIcon icon={faCalendar} className='task-due-date-icon' />
          <p className='task-due-date'>
            {getDaysRemaining(upcomingTask.due_date)}
          </p>
        </div>
      </div>
      {totalSubtasks !== 0 ? (
        <div className='row'>
          <ProgressBar
            current={completedSubtasks}
            total={totalSubtasks}
            height={15}
          />
          <span className='progress-count'>
            {completedSubtasks}/{totalSubtasks}
          </span>
        </div>
      ) : (
        <span className='no-tasks'>No subtasks added</span>
      )}
    </div>
  );
};

export default UpcomingTaskView;
