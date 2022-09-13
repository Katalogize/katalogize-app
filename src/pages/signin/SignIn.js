import "./SignIn.scss";
import {Link, useNavigate} from "react-router-dom";
import { useState } from 'react';
import logo from '../../assets/img/logo/logo_medium.svg';
import { gql, useMutation } from '@apollo/client';
// import { GOOGLE_AUTH_URL } from "../constants/constants";

const SIGN_IN = gql`
  mutation SignIn($username: String!,$password: String!) {
    signIn (username: $username, password: $password) {
      accessToken,
      refreshToken,
      userId,
      username,
      email,
      roles
    }
  }
`;

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [signIn] = useMutation(SIGN_IN);
  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    event.preventDefault();
    signIn({ 
      variables: { username: username, password: password },
      onCompleted(data) {
        localStorage.setItem("accessToken", data.signIn.accessToken);
        localStorage.setItem("refreshToken", data.signIn.refreshToken);
        navigate("/home");
      },
      onError(error) {
        setErrorMessage(error.message);
      }
    });
  };

  return (
    <div className="signin-container">
      <img src={logo} alt="logo"/>
      <h1 className="signin-title">Log in to your acount</h1>
      <label>{errorMessage}</label>
      <form onSubmit={handleSubmit}>
        <label>Username: 
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required>
          </input>
        </label>
        <br /><br />
        <label>Password: 
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            autoComplete="off"
            required>
          </input>
        </label>
        <br /><br />
        <button type="submit" value="Sign In">Sign In</button>
        <br /><br />
      </form>
      {/* <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>Log in with Google</a> */}
      <p>Don't have an account?</p>
      <Link to="/register" className="primary-button">Register on Katalogize</Link>
    </div>
  );
}

export default SignIn;