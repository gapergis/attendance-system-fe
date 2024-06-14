// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'attendance-system-realm',
  clientId: 'attendance-system-client',
  credentials: {
    secret: 'mMz28CATjuVxKjbzlXuSDBwiBJOj2zOn'
  }
});

export const keycloakConfig = {
  onLoad: 'login-required',
  checkLoginIframe: false,
  enableLogging: true,
  // Optional: Skip third-party cookies check
  pkceMethod: 'S256'
};

export default keycloak;
