import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Project } from 'src/models/project';
import { selectProject } from '../services/projectSlice';

const useToggleProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchAndSelectProject = useCallback(async (id: number) => {
    const url = `https://flowplanr-production.up.railway.app/projects/details/${id}`;
    try {
      const response = await fetch(url);
      const responseData: Project = await response.json();
      dispatch(selectProject(responseData));
      navigate(`/projects/${responseData.name.replaceAll(' ', '-')}`);
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, navigate]);

  const selectExistingProject = useCallback((project: Project) => {
    dispatch(selectProject(project));
    navigate(`/projects/${project.name.replaceAll(' ', '-')}`);
  }, [dispatch, navigate]);

  const toggleProject = (project: Project | null, id: number) => {
    if (project) {
      selectExistingProject(project);
    } else {
      fetchAndSelectProject(id);
    }
  };

  return toggleProject;
};

export default useToggleProject;
