import "./SignIn.scss";
import {Link, useNavigate} from "react-router-dom";
import { useState } from 'react';
import logo from '../../assets/img/logo/logo_medium.svg';
import { gql, useMutation } from '@apollo/client';
// import { GOOGLE_AUTH_URL } from "../constants/constants";
import { useDispatch } from "react-redux";
import { logIn } from "../../store/userSlice";
import { toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";

const SIGN_IN = gql`
  mutation SignIn($username: String!,$password: String!) {
    signIn (username: $username, password: $password) {
      accessToken,
      refreshToken,
      userId,
      username,
      email,
      isAdmin
    }
  }
`;

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signIn] = useMutation(SIGN_IN);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async(event) => {
    setIsLoading(true);
    event.preventDefault();
    const id = toastLoading("Loggin in...");
    signIn({ 
      variables: { username: username, password: password },
      onCompleted(data) {
        toastUpdateSuccess(id, "Logged Successfully!");
        localStorage.setItem("accessToken", data.signIn.accessToken);
        localStorage.setItem("refreshToken", data.signIn.refreshToken);
        localStorage.setItem("userId", data.signIn.userId);
        setIsLoading(false);
        dispatch(logIn());
        navigate("/home");
      },
      onError(error) {
        toastUpdateError(id, "Error while logging in. " + error.message);
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    });
  };

  return (
    <div className="signin-container">
      <img src={logo} alt="logo"/>
      <h1 className="signin-title">Log in to your acount</h1>
      <label className="signin-error">{errorMessage}</label>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label>Username: &nbsp;
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required>
          </input>
        </label>
        <br /><br />
        <label>Password: &nbsp;
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            autoComplete="off"
            required>
          </input>
        </label>
        <br /><br />
        {isLoading ? <span>Signing In...</span> : <button type="submit" value="Sign In" className="primary-button">Sign In</button>}
        <br /><br />
      </form>
      {/* <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>Log in with Google</a> */}
      <p>Don't have an account?</p>
      <Link to="/register">Register on Katalogize</Link>
    </div>
  );
}

export default SignIn;