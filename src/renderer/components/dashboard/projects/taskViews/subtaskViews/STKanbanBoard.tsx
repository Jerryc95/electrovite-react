import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../../../../../../StrictModeDroppable';

import { Subtask } from 'src/models/subTask';
import { Task } from 'src/models/task';

// import KanbanCard from './kanbanCard';
import { taskStatus } from '../../../../../../statuses/taskStatus';
import STKanbanCard from './STKanbanCard';

interface KanbanProps {
  subtasks: Subtask[];
  task: Task;
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  // setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const STKanbanBoard: React.FC<KanbanProps> = ({
  subtasks,
  task,
  setSubtasks,
  // setTasks,
}) => {
  const [notStartedSubtasks, setNotStartedSubtasks] =
    useState<Subtask[]>(subtasks);
  const [inProgSubtasks, setInProgSubtasks] = useState<Subtask[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState<Subtask[]>([]);

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
      switch (updatedStatus) {
        case 'not-started': {
          foundSubtask.subtask_status = taskStatus.NotStarted;
          break;
        }
        case 'in-progress': {
          foundSubtask.subtask_status = taskStatus.InProgress;
          break;
        }
        case 'completed': {
          foundSubtask.subtask_status = taskStatus.Completed;
          break;
        }
      }
      const data = {
        status: foundSubtask.subtask_status,
        columnIndex: updatedIndex,
      };
      const url = `http://localhost:3000/subtasks/update/${foundSubtask.subtask_id}`;
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to update value');
        }
      } catch (error) {
        console.log(error);
      }
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

      setSubtasks([
        ...notStartedSubtasks,
        ...inProgSubtasks,
        ...completedSubtasks,
      ]);
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
                  <STKanbanCard
                    index={index}
                    subtask={subtask}
                    setSubtasks={setSubtasks}
                    subtasks={subtasks}
                    // setTasks={setTasks}
                    // task={task}
                  />
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
                  <STKanbanCard
                    index={index}
                    subtask={subtask}
                    setSubtasks={setSubtasks}
                    subtasks={subtasks}
                    // setTasks={setTasks}
                    // task={task}
                  />
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
                  <STKanbanCard
                    index={index}
                    subtask={subtask}
                    setSubtasks={setSubtasks}
                    subtasks={subtasks}
                    // setTasks={setTasks}
                    // task={task}
                  />
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
