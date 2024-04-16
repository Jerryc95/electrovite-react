import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../../../../../StrictModeDroppable';

import { Task } from 'src/models/task';

import '../../../../styles/kanban.scss';
import KanbanCard from './kanbanCard';
import { taskStatus } from '../../../../../statuses/taskStatus';
import { useUpdateTaskMutation } from '../../../../../services/taskAPI';

interface KanbanProps {
  tasks: Task[];
  // setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  // setSelectedTask: React.Dispatch<React.SetStateAction<Task>>;
  // setShowingTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const KanbanBoard: React.FC<KanbanProps> = ({
  tasks,
  // setTasks,
  // setSelectedTask,
  // setShowingTask,
}) => {
  const [notStartedTasks, setNotStartedTasks] = useState<Task[]>(tasks);
  const [inProgTasks, setInProgTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const [updateTask] = useUpdateTaskMutation();

  const handleUpdateTask = async (
    tasks: Task[],
    liftedTask: Task,
    updatedStatus: string,
    updatedIndex: number,
  ) => {
   
    const foundTask = tasks.find((task) => {
      return task.task_id === liftedTask.task_id;
    });
  
    if (foundTask) {
      switch (updatedStatus) {
        case 'not-started': {
          updateTask({
            taskID: foundTask.task_id,
            taskStatus: taskStatus.NotStarted,
            columnIndex: updatedIndex
          })
          // foundTask.task_status = taskStatus.NotStarted;
          break;
        }
        case 'in-progress': {
          // foundTask.task_status = taskStatus.InProgress;
          updateTask({
            taskID: foundTask.task_id,
            taskStatus: taskStatus.InProgress,
            columnIndex: updatedIndex
          })
          break;
        }
        case 'completed': {
          // foundTask.task_status = taskStatus.Completed;
          updateTask({
            taskID: foundTask.task_id,
            taskStatus: taskStatus.Completed,
            columnIndex: updatedIndex
          })
          break;
        }
      }
      // const data = {
      //   taskID: foundTask.task_id,
      //   // taskStatus: 'In Progress',
      //   taskStatus: foundTask.task_status,
      //   columnIndex: updatedIndex,
      // };
      // console.log("data:",data)
      
      // const url = `http://localhost:3000/tasks/update/${foundTask.task_id}`;
      // try {
      //   const response = await fetch(url, {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(data),
      //   });
      //   if (!response.ok) {
      //     throw new Error('Failed to update value');
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
      // updateTask(data)
      
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
    let liftedTask: Task;
    const notStarted = notStartedTasks;
    const inProg = inProgTasks;
    const completed = completedTasks;

    if (source.droppableId === 'not-started') {
      liftedTask = notStarted[source.index];
      notStarted.splice(source.index, 1);
    } else if (source.droppableId === 'in-progress') {
      liftedTask = inProg[source.index];
      inProg.splice(source.index, 1);
    } else {
      liftedTask = completed[source.index];
      completed.splice(source.index, 1);
    }
    if (destination.droppableId === 'not-started') {
      notStarted.splice(destination.index, 0, liftedTask);
      setNotStartedTasks(notStarted);
      handleUpdateTask(
        notStartedTasks,
        liftedTask,
        'not-started',
        destination.index,
      );
    } else if (destination.droppableId === 'in-progress') {
      inProg.splice(destination.index, 0, liftedTask);
      setInProgTasks(inProg);
      handleUpdateTask(
        inProgTasks,
        liftedTask,
        'in-progress',
        destination.index,
      );
    } else {
      completed.splice(destination.index, 0, liftedTask);
      setCompletedTasks(completed);
      handleUpdateTask(
        completedTasks,
        liftedTask,
        'completed',
        destination.index,
      );

      // setTasks([...notStartedTasks, ...inProgTasks, ...completedTasks]);
    }
  };

  useEffect(() => {
    const notStarted: Task[] = [];
    const inProg: Task[] = [];
    const completed: Task[] = [];
    tasks.forEach((task) => {
      if (task.task_status === 'Not Started') {
        notStarted.push(task);
      } else if (task.task_status === 'In Progress') {
        inProg.push(task);
      } else {
        completed.push(task);
      }
    });
    setNotStartedTasks(notStarted);
    setInProgTasks(inProg);
    setCompletedTasks(completed);
  }, [tasks]);

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
              {notStartedTasks
                .sort((a, b) => {
                  a.column_index < b.column_index;
                  return 0;
                })
                .map((task, index) => (
                  <KanbanCard
                    index={index}
                    task={task}
                    tasks={notStartedTasks}
                    // setSelectedTask={setSelectedTask}
                    // setShowingTask={setShowingTask}
                    key={task.task_id}
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
              {inProgTasks
                .sort((a, b) => {
                  a.column_index < b.column_index;
                  return 0;
                })
                .map((task, index) => (
                  <KanbanCard
                    index={index}
                    task={task}
                    tasks={inProgTasks}
                    // setSelectedTask={setSelectedTask}
                    // setShowingTask={setShowingTask}
                    key={task.task_id}
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
              {completedTasks
                .sort((a, b) => {
                  a.column_index < b.column_index;
                  return 0;
                })
                .map((task, index) => (
                  <KanbanCard
                    index={index}
                    task={task}
                    tasks={completedTasks}
                    // setSelectedTask={setSelectedTask}
                    // setShowingTask={setShowingTask}
                    key={task.task_id}
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

export default KanbanBoard;
