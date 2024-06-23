import React from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './components/Keycloak';
import App from './App';

const initOptions = {
  onLoad: 'login-required',
};

const keycloakProviderInitConfig = {
  onTokens: (tokens) => {
    localStorage.setItem('kcToken', tokens.token);
    localStorage.setItem('kcRefreshToken', tokens.refreshToken);
  },
};

ReactDOM.render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions} {...keycloakProviderInitConfig}>
    <App />
  </ReactKeycloakProvider>,
  document.getElementById('root')
);
