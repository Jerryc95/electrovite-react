import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { Draggable } from 'react-beautiful-dnd';

import { Subtask } from 'src/models/subtask';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import EditSubtask from './EditSubtask';

interface KanbanCardProps {
  index: number;
  subtask: Subtask;
}

const STKanbanCard: React.FC<KanbanCardProps> = ({ index, subtask }) => {
  const [editingSubtask, setEditingSubtask] = useState(false);

  const toggleEditSubtask = () => {
    setEditingSubtask(!editingSubtask);
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
    <div>
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
            <div className='row space-between'>
              <div className='row'>
                <FontAwesomeIcon
                  icon={faCalendar}
                  className='task-due-date-icon'
                />
                <p className='task-due-date'>
                  {getDaysRemaining(subtask.due_date)}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className='task-edit-icon'
                onClick={toggleEditSubtask}
              />
            </div>
          </div>
        
        </div>
      )}
    </Draggable>
    {editingSubtask && (
            <EditSubtask
              subtask={subtask}
              setEditingSubtask={setEditingSubtask}
            />
          )}
    </div>
   
  );
};

export default STKanbanCard;
