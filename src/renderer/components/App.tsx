import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SignInPage from '$renderer/pages/auth/SignIn';
import SignUpPage from '$renderer/pages/auth/SignUp';
import ForgotPasswordPage from '$renderer/pages/auth/ForgotPassword';
import CreatingAccountPage from '$renderer/pages/CreatingAccountPage';

import { RootState } from 'src/services/store';

import '../styles/main.scss';
import Projects from '$renderer/pages/Projects';
import ProjectDetail from './dashboard/projects/ProjectDetail';
import Contacts from '$renderer/pages/Contacts';
import Bookkeeping from '$renderer/pages/Bookkeeping';
import Settings from '$renderer/pages/Settings';
import Documents from './dashboard/documents/Documents';
import Navbar from './Navbar';
import Home from '$renderer/pages/Home';
import AboutPage from '$renderer/pages/AboutPage';
import TaskDetail from './dashboard/projects/taskViews/TaskDetail';

const App = () => {
  const account = useSelector(
    (state: RootState) => state.accountReducer.account,
  );
  const project = useSelector(
    (state: RootState) => state.projectReducer.selectedProject,
  );
  const task = useSelector(
    (state: RootState) => state.taskReducer.selectedTask,
  );

  return (
    <div>
      {account != null && <Navbar />}
      <Routes>
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/register' element={<SignUpPage />} />
        <Route path='/' element={<SignInPage />} />
        <Route
          path='/creating-account'
          element={<CreatingAccountPage creating={true} />}
        />
        <Route
          path='/loading-account'
          element={<CreatingAccountPage creating={false} />}
        />
        {account != null && (
          <>
            <Route path='/projects' element={<Projects />} />
            {project != null && (
              <>
                <Route
                  path='/projects/:projectName'
                  element={<ProjectDetail project={project} />}
                />
                {task != null && (
                  <Route
                    path='/projects/:projectName/:taskName'
                    element={
                      <TaskDetail
                        task={task}
                        id={account.id}
                        project={project}
                      />
                    }
                  />
                )}
              </>
            )}

            <Route path='/contacts' element={<Contacts />} />
            <Route path='/bookkeeping' element={<Bookkeeping />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/documents' element={<Documents />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<AboutPage />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
