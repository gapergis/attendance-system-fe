// src/components/Header.js
import React from 'react';
import { useKeycloak } from '@react-keycloak/web';


const Header = () => {
  const { keycloak } = useKeycloak();
  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <button onClick={handleLogin}>Login</button>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
