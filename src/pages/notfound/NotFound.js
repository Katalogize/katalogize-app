import { Link } from "react-router-dom";
import "./NotFound.scss";
// import { GOOGLE_AUTH_URL } from "../constants/constants";

function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="title notfound-title ">Not Found :(</h1>
      <h2 className="notfound-description">The page you are looking for does not exist or you do not have access.</h2>
      <Link to="/home">Go to Home</Link>
    </div>
  );
}

export default NotFound;