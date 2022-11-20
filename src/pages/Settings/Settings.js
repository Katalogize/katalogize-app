import "./Settings.scss";
import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";
import { VscLock } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { update } from "../../store/userSlice";

const CHANGE_DISPLAYNAME = gql`
  mutation UpdateDisplayName($displayName: String!) {
    updateDisplayName (displayName: $displayName) {
      displayName
    }
  }
`;

const CHANGE_USERNAME = gql`
  mutation UpdateUsername($username: String!) {
    updateUsername (username: $username) {
      username
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword (oldPassword: $oldPassword, newPassword: $newPassword) {
      displayName
    }
  }
`;

const GET_LOGGED_USER = gql`
  query {
    getLoggedUser {
        id,
        displayName,
        description,
        username,
        email,
        picture
    }
  }
`;

function Settings() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [changeDisplayName] = useMutation(CHANGE_DISPLAYNAME);
  const [changeUsername] = useMutation(CHANGE_USERNAME);
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const dispatch = useDispatch();

  const { loading, error } = useQuery(GET_LOGGED_USER, {
    onCompleted(data) {
      let user = data.getLoggedUser;
      setDisplayName (user.displayName);
      setUsername(user.username);
      setEmail(user.email);
    }, onError(error) {
      console.log(error);
    }
  });

  const handleChangeDisplayName = async() => {
    setIsLoading(true);
    const id = toastLoading("Updating display name...");
    changeDisplayName({ 
      variables: { displayName: displayName },
      onCompleted(data) {
        dispatch(update({displayName: data.updateDisplayName.displayName}));
        toastUpdateSuccess(id, "Display name updated");
        setIsLoading(false);
      },
      onError(error) {
        toastUpdateError(id, "Error while updating user information. " + error.message);
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    });
  };

  const handleChangeUsername = async() => {
    setIsLoading(true);
    const id = toastLoading("Updating username...");
    changeUsername({ 
      variables: { username: username },
      onCompleted(data) {
        dispatch(update({username: data.updateUsername.username}));
        toastUpdateSuccess(id, "Username updated");
        setIsLoading(false);
      },
      onError(error) {
        toastUpdateError(id, "Error while updating user information. " + error.message);
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    });
  };

  const handleChangePassword = async() => {
    setIsLoading(true);
    const id = toastLoading("Updating username...");
    changePassword({ 
      variables: { oldPassword: oldPassword, newPassword: newPassword },
      onCompleted(data) {
        toastUpdateSuccess(id, "Username updated");
        setIsLoading(false);
      },
      onError(error) {
        toastUpdateError(id, "Error while updating user information. " + error.message);
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    });
  };


  if (loading) return <span>Loading...</span>
  if (error) navigate("/notfound");

  return (
    <div className="form-center">
    <div className="form-container">
      <h1 className="form-title">User Settings</h1>
      <label className="form-error">{errorMessage}</label>
      <div className="form-data" style={{textAlign:"right", display: "flex", justifyContent: "center"}}>
        <span>
          <label>Email: &nbsp;&nbsp;
            <span style={{opacity: 0.5}}><VscLock />&nbsp; {email}</span>
          </label>
          <br /><br />
          <label>Display Name: &nbsp;
            <input 
              type="text" 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)} 
              required>
            </input>
          </label>
          <br /><br />
          {isLoading ? <span>Sending instructions...</span> : <button className="primary-button" onClick={() => handleChangeDisplayName()}>Change display name</button>}
          <br /><br /><br />
          <label>Username: &nbsp;
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required>
            </input>
          </label>
          <br /><br />
          {isLoading ? <span>Sending instructions...</span> : <button className="primary-button" onClick={() => handleChangeUsername()}>Change username</button>}
          <br /><br /><br />
          <label>Old password: &nbsp;
            <input 
              type="password" 
              value={oldPassword} 
              onChange={e => setOldPassword(e.target.value)} 
              autoComplete="off"
              required>
            </input>
          </label>
          <br /><br />
          <label>New password: &nbsp;
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              autoComplete="off"
              required>
            </input>
          </label>
          <br /><br />
          {isLoading ? <span>Sending instructions...</span> : <button className="primary-button" onClick={() => handleChangePassword()}>Change password</button>}
          <br /><br />
        </span>
      </div>
      {/* <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>Log in with Google</a> */}
      <p>Need help?</p>
      <a href="mailto:katalogize@gmail.com" style={{color: "black"}}>Contact Us</a>
    </div>
    </div>
  );
}

export default Settings;