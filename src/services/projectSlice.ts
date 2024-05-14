// the project slice includes all references to the user's
// projects.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Project } from 'src/models/project';
import { projectAPI } from './projectAPI';

interface projectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialProjectState: projectState = {
  projects: [],
  selectedProject: null,
  loading: 'idle',
  error: null,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState: initialProjectState,
  reducers: {
    clearProjectState: () => initialProjectState,
    selectProject: (state, action: PayloadAction<Project>) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    // PROJECTS API
    builder.addMatcher(
      projectAPI.endpoints.fetchProjects.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      projectAPI.endpoints.fetchProjects.matchFulfilled,
      (state, action: PayloadAction<Project[]>) => {
        state.loading = 'fulfilled';
        const projects = action.payload;
        state.projects = projects.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          return 0;
        });

      },
    );

    builder.addMatcher(
      projectAPI.endpoints.addProject.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      projectAPI.endpoints.addProject.matchFulfilled,
      (state, action: PayloadAction<Project>) => {
        state.loading = 'fulfilled';
        console.log('Add Project Payload:', action.payload);
        state.projects.push(action.payload);
      },
    );

    builder.addMatcher(
      projectAPI.endpoints.updateProject.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      projectAPI.endpoints.updateProject.matchFulfilled,
      (state, action: PayloadAction<Project>) => {
        state.loading = 'fulfilled';
        console.log('update Project Payload:', action.payload);
        const updatedProject = action.payload;

        const index = state.projects.findIndex(
          (project) => project.id == updatedProject.id,
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
          state.selectedProject = action.payload;
        }
      },
    );

    builder.addMatcher(
      projectAPI.endpoints.removeProject.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      projectAPI.endpoints.removeProject.matchFulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = 'fulfilled';

        const payloadNumber = Number(action.payload);
        const updatedProjects = state.projects.filter(
          (project) => project.id !== payloadNumber,
        );
        state.projects = updatedProjects;
      },
    );
    builder.addMatcher(
      projectAPI.endpoints.fetchContactProjects.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      projectAPI.endpoints.fetchContactProjects.matchFulfilled,
      (state, action: PayloadAction<Project[]>) => {
        state.loading = 'fulfilled';
        const projects = action.payload;
        state.projects = projects.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          return 0;
        });
      },
    );
  },
});

export const getProjects = (state: RootState) =>
  state.projectReducer.projects;

export const { clearProjectState, selectProject } = projectSlice.actions;
export default projectSlice.reducer;
