import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { Project } from '../../../../models/project';
import NewProjectTask from './taskViews/NewProjectTask';
import TaskList from './taskViews/TaskList';
import KanbanBoard from './taskViews/KanbanBoard';
// import RoadmapView from './taskViews/RoadmapView';
import DropdownField from '$renderer/components/DropdownField';
import { projectStatus } from '../../../../statuses/projectStatus';
import EditField from '$renderer/components/EditField';
import { Task } from 'src/models/task';
import TaskDetail from './taskViews/TaskDetail';
import EditProject from './EditProject';

interface ProjectDetailProps {
  project: Project;
  setShowingProject: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projects: Project[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  setShowingProject,
  accountID,
  setProjects,
  projects,
}) => {
  const [addingTask, setAddingTask] = useState(false);
  const [showingTask, setShowingTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task>(tasks[0]);
  const [taskView, setTaskView] = useState('Board');
  const [editingProject, setEditingProject] = useState(false);
  const [projectName, setProjectName] = useState("")

  const viewOptions = ['Board', 'List'];
  const [componentView, setComponentView] = useState<JSX.Element>(
    <KanbanBoard
      tasks={tasks}
      setTasks={setTasks}
      setSelectedTask={setSelectedTask}
      setShowingTask={setShowingTask}
    />,
  );

  const toggleProject = () => {
    setShowingProject(false);
  };

  const toggleProjectEdit = () => {
    setEditingProject(!editingProject);
  };

  const toggleView = (view: string) => {
    setTaskView(view);
    switch (view) {
      case 'Board':
        setComponentView(
          <KanbanBoard
            tasks={tasks}
            setTasks={setTasks}
            setSelectedTask={setSelectedTask}
            setShowingTask={setShowingTask}
          />,
        );
        break;
      case 'List':
        setComponentView(
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            setSelectedTask={setSelectedTask}
            setShowingTask={setShowingTask}
          />,
        );
    }
  };

  useEffect(() => {
    const url = `http://localhost:3000/tasks?id=${project.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      });
  }, [project]);

  useEffect(() => {
    setProjectName(project.name)
    if (taskView === 'Board') {
      setComponentView(
        <KanbanBoard
          tasks={tasks}
          setTasks={setTasks}
          setSelectedTask={setSelectedTask}
          setShowingTask={setShowingTask}
        />,
      );
    } else {
      setComponentView(
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          setSelectedTask={setSelectedTask}
          setShowingTask={setShowingTask}
        />,
      );
    }
  }, [tasks, taskView, project.name]);

  return (
    <div className='project-detail-container'>
      <div className='project-detail-header'>
        <div className='project-detail-header-leading'>
          <div className='project-detail-back' onClick={toggleProject}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>Projects</p>
          </div>
          <h2>{projectName}</h2>
        </div>
        <div className='project-detail-header-trailing'>
        
          <button className='add-button' onClick={() => setAddingTask(true)}>
            Add Task
          </button>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className='project-detail-settings'
            onClick={toggleProjectEdit}
          />
        </div>
      </div>
      <div className='project-detail-top-container'>
        <div className='project-detail-header'>
          <div style={{ width: `60%` }}>
            <EditField
              label='Description:'
              field='description'
              value={project.description}
              id={project.id}
              isInput={false}
              baseURL='http://localhost:3000/projects/update/'
            />
          </div>
          <DropdownField
            label='Project Status:'
            field='status'
            value={project.status}
            id={project.id}
            options={projectStatus}
            baseURL='http://localhost:3000/projects/update/'
          />
        </div>
        {/* <div className='project-detail-header'>
          <h3>Road Map</h3>
        </div>
        <div className='project-detail-roadmap'>
          <RoadmapView />
        </div> */}
      </div>
      <div className='project-detail-bottom-container'>
        <h3>Tasks</h3>
        <div className='view-options'>
          {viewOptions.map((option) => (
            <div
              key={option}
              onClick={() => toggleView(option)}
              className={`sort-capsule ${option} ${
                taskView === option ? 'selected' : ''
              }`}
            >
              {option}
            </div>
          ))}
        </div>

        <div className='project-detail-board'>
          {tasks.length === 0 ? (
            <p>Tasks will appear here once added.</p>
          ) : (
            <div>{componentView}</div>
          )}
        </div>
      </div>
      {addingTask && (
        <NewProjectTask
          setAddingTask={setAddingTask}
          accountID={project.account_id}
          projectID={project.id}
          setTasks={setTasks}
          tasks={tasks}
        />
      )}
      {showingTask && (
        <TaskDetail
          task={selectedTask}
          setShowingTask={setShowingTask}
          accountID={accountID}
          setTasks={setTasks}
          tasks={tasks}
          projectName={projectName}
        />
      )}
      {editingProject && (
        <EditProject
          project={project}
          setEditingProject={setEditingProject}
          setProjects={setProjects}
          projects={projects}
          setShowingProject={setShowingProject}
          setProjectName={setProjectName}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
