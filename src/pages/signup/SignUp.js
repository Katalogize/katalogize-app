import "./SignUp.scss";
import {Link, useNavigate} from "react-router-dom";
import { useState } from 'react';
import logo from '../../assets/img/logo/logo_medium.svg';
import { gql, useMutation } from '@apollo/client';

const SIGN_UP = gql`
  mutation SignUp($user: UserInput) {
    signUp (user: $user) 
  }
`;

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signUp] = useMutation(SIGN_UP);
  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    setIsLoading(true);
    event.preventDefault();
    let user = {
      password: password,
      email: email,
      displayName: displayName,
      username: username
    }
    signUp({ 
      variables: { user: user },
      onCompleted(data) {
        setIsLoading(false);
        navigate("/login");
      },
      onError(error) {
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    });
  };

  return (
    <div className="signin-container">
      <img src={logo} alt="logo"/>
      <h1 className="signin-title">Register an acount</h1>
      <label className="signin-error">{errorMessage}</label>
      <form className="signin-form" onSubmit={handleSubmit} style={{textAlign: "right"}}>
        <label>Display Name: 
          <input 
            type="text" 
            value={displayName} 
            onChange={e => setDisplayName(e.target.value)} 
            required>
          </input>
        </label>
        <br /><br />
        <label>Email: 
          <input 
            type="text" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required>
          </input>
        </label>
        <br /><br />
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
        {isLoading ? <span>Signing In...</span> : <button type="submit" value="Sign In">Sign Up</button>}
        <br /><br />
      </form>
      {/* <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>Log in with Google</a> */}
      <p>Already an account?</p>
      <Link to="/login" className="primary-button">Log in</Link>
    </div>
  );
}

export default SignUp;