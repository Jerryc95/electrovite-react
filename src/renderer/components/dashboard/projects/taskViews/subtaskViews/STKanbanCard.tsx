import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { Draggable } from 'react-beautiful-dnd';

import { Subtask } from 'src/models/subTask';
// import { taskStatus } from '../../../../../../statuses/taskStatus';

interface KanbanCardProps {
  index: number;
  subtask: Subtask;
}

const STKanbanCard: React.FC<KanbanCardProps> = ({
  index,
  subtask,
}) => {
//   const [uncompletedSubTasks, setUncompletedSubTasks] = useState(0);
//   const [completedSubTask, setCompletedSubTasks] = useState(0);
//   const [totalSubTasks, setTotalSubTasks] = useState(uncompletedSubTasks + completedSubTask)

//   const handleSetTask = (subtask: Subask) => {
//     setSelectedTask(subtask);
//     setShowingTask(true);
//   };

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
      return `Due: ${dateParser(subtask.due_date).toLocaleDateString(
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
    // if(subtask.subTasks) {
    //     let uncompleted = 0
    //     let completed = 0 
    //     setTotalSubTasks(task.subTasks.length)
    //     task.subTasks.forEach((subtask) => {
    //         if (subtask.subtask_status === taskStatus.Completed) {
    //             completed += 1
    //         } else {
    //             uncompleted += 1
    //         }
    //     })
    //     setUncompletedSubTasks(uncompleted)
    //     setCompletedSubTasks(completed)
    // }
  }, []);
  return (
    <Draggable draggableId={subtask.subtask_id.toString()} index={index}>
      {(provided) => (
        <div
          className='kanban-card-container'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>
            <div className='row space-between'>
              <h4 className='task-name'>{subtask.name}</h4>
              <span className={`task-priority ${subtask.priority}`}>
                {subtask.priority}
              </span>
            </div>
            <div className='row'>
              <FontAwesomeIcon
                icon={faCalendar}
                className='task-due-date-icon'
              />
              <p className='task-due-date'>{getDaysRemaining(subtask.due_date)}</p>
            </div>
          </div>
          {/* {uncompletedSubTasks !== 0 ? (
            <div className='row'>
              <ProgressBar current={completedSubTask} total={totalSubTasks} height={15} />
              <span className='progress-count'>
                {completedSubTask}/{totalSubTasks}
              </span>
            </div>
          ) : (
            <span className='no-tasks'>No subtasks added</span>
          )} */}
        </div>
        // </div>
      )}
    </Draggable>
  );
};

export default STKanbanCard;
