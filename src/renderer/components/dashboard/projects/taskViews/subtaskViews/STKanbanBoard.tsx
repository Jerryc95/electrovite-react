import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../../../../../../StrictModeDroppable';

import { Subtask } from 'src/models/subtask';
// import { Task } from 'src/models/task';

import { taskStatus } from '../../../../../../statuses/taskStatus';
import STKanbanCard from './STKanbanCard';
import { useUpdateSubtaskMutation } from '../../../../../../services/subtaskAPI';

interface KanbanProps {
  subtasks: Subtask[];
}

const STKanbanBoard: React.FC<KanbanProps> = ({ subtasks }) => {
  const [notStartedSubtasks, setNotStartedSubtasks] =
    useState<Subtask[]>(subtasks);
  const [inProgSubtasks, setInProgSubtasks] = useState<Subtask[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState<Subtask[]>([]);

  const [updateSubtask] = useUpdateSubtaskMutation();

  const handleUpdateSubtask = async (
    subtasks: Subtask[],
    liftedTask: Subtask,
    updatedStatus: string,
    updatedIndex: number,
  ) => {
    const foundSubtask = subtasks.find((subtask) => {
      return subtask.task_id === liftedTask.task_id;
    });
    if (foundSubtask) {
      let status = foundSubtask.subtask_status
      switch (updatedStatus) {
        case 'not-started': {
          status = taskStatus.NotStarted;
          break;
        }
        case 'in-progress': {
          status = taskStatus.InProgress;
          break;
        }
        case 'completed': {
          status = taskStatus.Completed;
          break;
        }
      }
      const data: Subtask = {
        subtask_id: foundSubtask.subtask_id,
        task_id: foundSubtask.task_id,
        name: foundSubtask.name,
        description: foundSubtask.description,
        notes: foundSubtask.notes,
        creation_date: foundSubtask.creation_date,
        start_date: foundSubtask.start_date,
        due_date: foundSubtask.due_date,
        subtask_status: status,
        priority: foundSubtask.priority,
        column_index: updatedIndex,
      };
      updateSubtask(data);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let liftedSubtask: Subtask;
    const notStarted = notStartedSubtasks;
    const inProg = inProgSubtasks;
    const completed = completedSubtasks;

    if (source.droppableId === 'not-started') {
      liftedSubtask = notStarted[source.index];
      notStarted.splice(source.index, 1);
    } else if (source.droppableId === 'in-progress') {
      liftedSubtask = inProg[source.index];
      inProg.splice(source.index, 1);
    } else {
      liftedSubtask = completed[source.index];
      completed.splice(source.index, 1);
    }
    if (destination.droppableId === 'not-started') {
      notStarted.splice(destination.index, 0, liftedSubtask);
      setNotStartedSubtasks(notStarted);
      handleUpdateSubtask(
        notStartedSubtasks,
        liftedSubtask,
        'not-started',
        destination.index,
      );
    } else if (destination.droppableId === 'in-progress') {
      inProg.splice(destination.index, 0, liftedSubtask);
      setInProgSubtasks(inProg);
      handleUpdateSubtask(
        inProgSubtasks,
        liftedSubtask,
        'in-progress',
        destination.index,
      );
    } else {
      completed.splice(destination.index, 0, liftedSubtask);
      setCompletedSubtasks(completed);
      handleUpdateSubtask(
        completedSubtasks,
        liftedSubtask,
        'completed',
        destination.index,
      );
    }
  };

  useEffect(() => {
    const notStarted: Subtask[] = [];
    const inProg: Subtask[] = [];
    const completed: Subtask[] = [];
    subtasks.forEach((subtask) => {
      if (subtask.subtask_status === 'Not Started') {
        notStarted.push(subtask);
      } else if (subtask.subtask_status === 'In Progress') {
        inProg.push(subtask);
      } else {
        completed.push(subtask);
      }
    });
    setNotStartedSubtasks(notStarted);
    setInProgSubtasks(inProg);
    setCompletedSubtasks(completed);
  }, [subtasks]);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className='board-container'>
        <StrictModeDroppable droppableId='not-started'>
          {(provided, snapshot) => (
            <div
              className={`column-container ${
                snapshot.isDraggingOver ? 'dragged' : ''
              }`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h4 className='column-header'>Not Started</h4>
              {notStartedSubtasks
                .sort((a, b) => {
                  a.column_index < b.column_index;
                  return 0;
                })
                .map((subtask, index) => (
                  <STKanbanCard key={index} index={index} subtask={subtask} />
                ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
        <StrictModeDroppable droppableId='in-progress'>
          {(provided, snapshot) => (
            <div
              className={`column-container ${
                snapshot.isDraggingOver ? 'dragged' : ''
              }`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h4 className='column-header'>In Progress</h4>
              {inProgSubtasks
                .sort((a, b) => {
                  a.column_index < b.column_index;
                  return 0;
                })
                .map((subtask, index) => (
                  <STKanbanCard key={index} index={index} subtask={subtask} />
                ))}

              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
        <StrictModeDroppable droppableId='completed'>
          {(provided, snapshot) => (
            <div
              className={`column-container ${
                snapshot.isDraggingOver ? 'dragged' : ''
              }`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h4 className='column-header'>Completed</h4>
              {completedSubtasks
                .sort((a, b) => {
                  a.column_index < b.column_index;
                  return 0;
                })
                .map((subtask, index) => (
                  <STKanbanCard key={index} index={index} subtask={subtask} />
                ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </div>
    </DragDropContext>
  );
};

export default STKanbanBoard;
