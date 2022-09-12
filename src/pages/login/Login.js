import "./Login.scss";
import SignIn from './signin/SignIn';
import SignUp from "./signup/SignUp";
// import { GOOGLE_AUTH_URL } from "../constants/constants";

function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <div className="social-login">
        <SignIn />
        <SignUp />
        {/* <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>Log in with Google</a> */}
      </div>
    </div>
  );
}

export default Login;