import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import { useUpdateProjectMutation } from '../../../../services/projectAPI';
import { clearTaskState, selectedTasks } from '../../../../services/taskSlice';
import { useFetchTasksQuery } from '../../../../services/taskAPI';
import { Project } from '../../../../models/project';
import NewProjectTask from './taskViews/NewProjectTask';
import TaskList from './taskViews/TaskList';
import KanbanBoard from './taskViews/KanbanBoard';
import DropdownField from '$renderer/components/DropdownField';
import { projectStatus } from '../../../../statuses/projectStatus';
import EditField from '$renderer/components/EditField';
import EditProject from './EditProject';
import useBackClick from '../../../../hooks/useBackClick';
import ProjectSidebar from './ProjectSidebar';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const tasks = useSelector(selectedTasks);
  const goBack = useBackClick();

  const [addingTask, setAddingTask] = useState(false);
  const [taskView, setTaskView] = useState('Board');
  const [editingProject, setEditingProject] = useState(false);
  const [showingSidebar, setShowingSidebar] = useState(false);

  const viewOptions = ['Board', 'List'];
  // const [componentView, setComponentView] = useState<JSX.Element>(
  //   <KanbanBoard tasks={tasks} />,
  // );

  const fetchTasks = useFetchTasksQuery(project.id, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProject] = useUpdateProjectMutation();

  const toggleProject = () => {
    // clearTaskState();
    goBack();
  };

  const toggleProjectEdit = () => {
    setEditingProject(!editingProject);
  };

  const handleUpdateProject = async (data: any) => {
    updateProject(data);
  };

  const toggleView = useCallback((view: string) => {
    setTaskView(view);
    // setTaskView(view);
    // switch (view) {
    //   case 'Board':
    //     setComponentView(<KanbanBoard tasks={tasks} />);
    //     break;
    //   case 'List':
    //     setComponentView(<TaskList tasks={tasks} />);
    // }
  }, []);

  const toggleSidebar = () => {
    setShowingSidebar(!showingSidebar);
  };

  useEffect(() => {
    // clearTaskState();
    fetchTasks;
    // toggleView('Board');
  }, [fetchTasks]);

  useEffect(() => {
    toggleView('Board');
  }, [toggleView]);

  return (
    <div className='project-detail-container'>
      <div className='project-detail-header'>
        <div className='project-detail-header-leading'>
          <div className='project-detail-back' onClick={() => toggleProject()}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>Projects</p>
          </div>
          <h2>{project.name}</h2>
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
              isInput={false}
              item={project}
              onEdit={handleUpdateProject}
            />
          </div>
          <DropdownField
            label='Project Status:'
            field='status'
            value={project.status}
            options={projectStatus}
            item={project}
            onEdit={handleUpdateProject}
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
        <div className='project-detail-header'>
          <h3>Tasks</h3>
          <div
            className={`project-sidebar-chevron-container ${
              showingSidebar
                ? 'open-sidebar-chevron-container'
                : ''
            }`}
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon
              icon={showingSidebar ? faChevronRight : faChevronLeft}
              size='xl'
              className={`project-sidebar-chevron ${
                showingSidebar ? 'collapsed-chevron' : ''
              }`}
            />
          </div>
          <ProjectSidebar project={project} showingSidebar={showingSidebar} />
        </div>

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

        <div
          className={
            taskView == 'Board' ? `project-detail-board` : 'project-detail-list'
          }
        >
          {tasks.length === 0 ? (
            <p>Tasks will appear here once added.</p>
          ) : (
            // <div>{componentView}</div>
            <div>
              {taskView == 'Board' ? (
                <>
                  <KanbanBoard tasks={tasks} />
                </>
              ) : (
                <>
                  <TaskList tasks={tasks} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {addingTask && (
        <NewProjectTask
          setAddingTask={setAddingTask}
          accountID={project.account_id}
          projectID={project.id}
          tasks={tasks}
        />
      )}
      {editingProject && (
        <EditProject project={project} setEditingProject={setEditingProject} />
      )}
    </div>
  );
};

export default ProjectDetail;
