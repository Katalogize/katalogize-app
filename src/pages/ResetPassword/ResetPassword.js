import "./ResetPassword.scss";
import { useState } from 'react';
import logo from '../../assets/img/logo/logo_medium.svg';
import { gql, useMutation } from '@apollo/client';
// import { GOOGLE_AUTH_URL } from "../constants/constants";
import { toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";

const RESET_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword (email: $email)
  }
`;

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const handleSubmit = async(event) => {
    setIsLoading(true);
    event.preventDefault();
    const id = toastLoading("Sending instructions...");
    resetPassword({ 
      variables: { email: email },
      onCompleted(data) {
        toastUpdateSuccess(id, "Instructions sent! Check your email.");
        setIsLoading(false);
      },
      onError(error) {
        toastUpdateError(id, "Error while sending instructions. " + error.message);
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    });
  };

  return (
    <div className="signin-container">
      <img src={logo} alt="logo"/>
      <h1 className="signin-title">Reset your password</h1>
      <label>Type your email and we will send you the instructions on how to recover your password.</label>
      <br />
      <label className="signin-error">{errorMessage}</label>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label>Email: &nbsp;
          <input 
            type="text" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required>
          </input>
        </label>
        <br /><br />
        {isLoading ? <span>Sending instructions...</span> : <button type="submit" value="Sign In" className="primary-button">Send</button>}
        <br /><br />
      </form>
      {/* <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>Log in with Google</a> */}
      <p>Need help?</p>
      <a href="mailto:katalogize@gmail.com" style={{color: "black"}}>Contact Us</a>
    </div>
  );
}

export default ResetPassword;