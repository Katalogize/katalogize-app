const API_LOCAL = "http://localhost:8080/graphql";

const API_PRD = "https://api.katalogize.com/graphql";

let url;

if (window.location.hostname === "localhost") {
    url = API_LOCAL;
} else {
    url = API_PRD;
}

export const API_BASE_URL = url;

export const GCS_API = "https://storage.googleapis.com/katalogize-files/";

export const ACCESS_TOKEN = "accessToken";

export const OAUTH2_REDIRECT_URI = "http://localhost:3000/oauth2/redirect";

export const GOOGLE_AUTH_URL = API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URI;