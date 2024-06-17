// Assuming you're using React
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CallbackPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL;
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");
    const state = urlParams.get("state");

    if (authorizationCode) {
      // Now you have the authorization code, you can proceed to exchange it for tokens
      exchangeAuthorizationCodeForToken(authorizationCode);
    }
  }, [location]);

  const exchangeAuthorizationCodeForToken = (authorizationCode) => {
    const tokenEndpoint = `${keycloakUrl}/realms/attendance-system-realm/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", "attendance-system-client");
    params.append("client_secret", "YOUR_CLIENT_SECRET"); // If required
    params.append("code", authorizationCode);
    params.append("redirect_uri", "https://apergisdev-frontend.ddns.net/"); // Should match the initial redirect_uri

    fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        //  console.log('Token Response:', data);
        // Handle the tokens (store them, etc.)
      })
      .catch((error) => console.error("Error fetching token:", error));
  };

  return <div>Loading...</div>;
};

export default CallbackPage;
