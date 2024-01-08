import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

// import dotenv from 'dotenv'

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
// import {StripeProvider} from 'react-stripe-elements';

import App from '$components/App';
import store from '../services/store';
import '$styles/app.scss';
// import './styles/app.scss'

const persistedStore = persistStore(store);
// dotenv.config();


// Render application
createRoot(document.getElementById('app') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <HashRouter>
          <App />
        </HashRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
