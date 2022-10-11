import "./NotFound.scss";
// import { GOOGLE_AUTH_URL } from "../constants/constants";

function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">Not Found :(</h1>
      <h2 className="notfound-description">The page you are looking for could does not exist or you do not have access.</h2>
    </div>
  );
}

export default NotFound;