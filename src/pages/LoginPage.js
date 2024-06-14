// LoginPage.js
import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

const LoginPage = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login with Keycloak</button>
    </div>
  );
}

export default LoginPage;
