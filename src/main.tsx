import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </React.StrictMode>
);
