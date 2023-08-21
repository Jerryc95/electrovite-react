import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '$components/App';
import '$styles/app.scss';

// Render application
createRoot(document.getElementById('app') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);