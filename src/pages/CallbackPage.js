import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CallbackPage = () => {
  const location = useLocation();
  const keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL;
  const redirectUri = window.location.href;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      exchangeAuthorizationCodeForToken(authorizationCode);
    }
  }, [location]);

  const exchangeAuthorizationCodeForToken = (authorizationCode) => {
    const tokenEndpoint = `${keycloakUrl}/realms/attendance-system-realm/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", "attendance-system-client");
    params.append("client_secret", "W1yL9act1VLpnbajz3M0wmSe1Hla3kbf");
    params.append("code", authorizationCode);
    params.append("redirect_uri", redirectUri);

    fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Token Response:', data);
        // Handle the tokens (store them, etc.)
      })
      .catch((error) => console.error("Error fetching token:", error));
  };

  return <div>Loading...</div>;
};

export default CallbackPage;
