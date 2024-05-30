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
}

const KanbanBoard: React.FC<KanbanProps> = ({ tasks }) => {
  const [notStartedTasks, setNotStartedTasks] = useState<Task[]>(tasks);
  const [inProgTasks, setInProgTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const [updateTask] = useUpdateTaskMutation();

  // this may need to loop through the tasks to update the index
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
          // foundTask.task_status = taskStatus.NotStarted;
          updateTask({
            task_id: foundTask.task_id,
            project_id: foundTask.project_id,
            name: foundTask.name,
            description: foundTask.description,
            notes: foundTask.notes,
            creation_date: foundTask.creation_date,
            start_date: foundTask.start_date,
            due_date: foundTask.due_date,
            task_status: taskStatus.NotStarted,
            priority: foundTask.priority,
            column_index: updatedIndex,
            subtasks: foundTask.subtasks,
          })
          
          break;
        }
        case 'in-progress': {
          // foundTask.task_status = taskStatus.InProgress;
          updateTask({
            task_id: foundTask.task_id,
            project_id: foundTask.project_id,
            name: foundTask.name,
            description: foundTask.description,
            notes: foundTask.notes,
            creation_date: foundTask.creation_date,
            start_date: foundTask.start_date,
            due_date: foundTask.due_date,
            task_status: taskStatus.InProgress,
            priority: foundTask.priority,
            column_index: updatedIndex,
            subtasks: foundTask.subtasks,
          })
          break;
        }
        case 'completed': {
          // foundTask.task_status = taskStatus.Completed;
          updateTask({
            task_id: foundTask.task_id,
            project_id: foundTask.project_id,
            name: foundTask.name,
            description: foundTask.description,
            notes: foundTask.notes,
            creation_date: foundTask.creation_date,
            start_date: foundTask.start_date,
            due_date: foundTask.due_date,
            task_status: taskStatus.Completed,
            priority: foundTask.priority,
            column_index: updatedIndex,
            subtasks: foundTask.subtasks,
          })
          break;
        }
      }
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // console.log("soruce:",source)
    // console.log("destination:", destination)
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
      // console.log("array:", notStarted)
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
      // console.log(completedTasks)
    }
    // combined the 3 arrays together and set the state to that new array
    console.log(notStarted)
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
  }, []);

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
              //  .sort((a, b) => a.column_index - b.column_index)
                .map((task, index) => (
                  <KanbanCard
                    index={index}
                    task={task}
                    tasks={tasks}
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
              //  .sort((a, b) => a.column_index - b.column_index)
                .map((task, index) => (
                  <KanbanCard
                    index={index}
                    task={task}
                    tasks={tasks}
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
              //  .sort((a, b) => a.column_index - b.column_index)
                .map((task, index) => (
                  <KanbanCard
                    index={index}
                    task={task}
                    tasks={tasks}
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
