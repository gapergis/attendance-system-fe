import Keycloak from 'keycloak-js';

const kcUrl = process.env.REACT_APP_KEYCLOAK_URL;

const keycloakConfig = {
    url: kcUrl,
    realm: 'attendance-system-realm',
    clientId: 'attendance-system-client',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
