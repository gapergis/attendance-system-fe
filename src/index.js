// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import App from './App';
import keycloak from './components/Keycloak';

const eventLogger = (event, error) => {
  if (event === 'onAuthSuccess' || event === 'onReady') {
   // console.log('Keycloak is ready');
  }
};

const tokenLogger = (tokens) => {
  // console.log('onKeycloakTokens', tokens);
};

ReactDOM.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{ onLoad: 'login-required' }}
    onEvent={eventLogger}
    onTokens={tokenLogger}
  >
    <App />
  </ReactKeycloakProvider>,
  document.getElementById('root')
);
