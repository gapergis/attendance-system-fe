import React, { useEffect, useState, Link} from 'react';
import { useKeycloak } from '@react-keycloak/web';
import '../../App.css'; // Import your CSS file with styles

const HomePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      keycloak.loadUserInfo().then(userInfo => {
        setUserInfo(userInfo);
      });
    }
  }, [keycloak, initialized]);


  if (!userInfo) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
        <h3>Professor Homepage</h3>
      <main>
        <div className="container">
          <div className="user-info">
            <p><strong>Name:</strong> {userInfo.given_name}</p>
            <p><strong>Surname:</strong> {userInfo.family_name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Username:</strong> {userInfo.preferred_username}</p>
            <p><strong>Role:</strong> {keycloak.tokenParsed.realm_access.roles[0]}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
