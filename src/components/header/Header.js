import "./Header.scss";
import logo from '../../assets/img/logo/logo_header.svg';
import {Link,  useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store/userSlice";
import { gql, useMutation } from '@apollo/client';
import { FaUserAlt } from "react-icons/fa";
import { IoExitOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineComputer } from "react-icons/md";
import { GCS_API } from "../../utils/constants";
import { useState } from "react";

const LOG_OUT = gql`
  mutation LogOut($userId: String!) {
    logOut (userId: $userId)
  }
`;

function Header() {

  const displayName = useSelector(state => state.user.displayName);
  const username = useSelector(state => state.user.username);
  const userId = useSelector(state => state.user.userId);
  const picture = useSelector(state => state.user.picture);
  const [showOptions, setShowOptions] = useState(false);

  const [logOutUser] = useMutation(LOG_OUT);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogOut() {
    logOutUser({ 
      variables: { userId: userId },
      onCompleted(data) {
        console.log(data);
      },
      onError(error) {
        console.log(error);
      }
    });
    dispatch(logOut());
    localStorage.clear();
    navigate("/");
  }

  const userInfo = (
    <div className="header-user-container">
      <div className="header-picture-container" onClick={() => {setShowOptions(true);}}>
        {picture !== null 
          ?<img src={GCS_API + picture} className="profile-picture" alt="user"/>
          :<FaUserAlt className="header-picture-default"></FaUserAlt>
        }
      </div>
      {showOptions
        ?
        <div className="header-user-options-container">
          <div className="header-user-options-background" onClick={() => {setShowOptions(false)}} />
          <div className="header-user-options">
            <div className="header-user-options-main-info" onClick={() => {navigate(`/${username}`); setShowOptions(false)}}>
              <div style={{display:"flex", placeContent: "center"}}>
                <div className="header-user-options-picture-container">
                  {picture !== null 
                    ?<img src={GCS_API + picture} className="profile-picture" alt="user"/>
                    :<FaUserAlt className="header-options-picture-default"></FaUserAlt>
                  }
                </div>
              </div>
              <h2 className="color-blue">{displayName}</h2>
              <h4 style={{opacity: 0.7}}>@{username}</h4>
            </div>
            <div style={{textAlign: "center"}}>
              <div className="header-user-options-list">
                <div>
                  <Link to={`/${username}`} className="header-button header-user-option" onClick={() => {setShowOptions(false)}}><FaUserAlt />&nbsp;My Profile</Link>
                </div>
                <div>
                  <a href="https://api.katalogize.com" target="_blank" rel="noreferrer" className="header-button header-user-option" onClick={() => {setShowOptions(false)}}><MdOutlineComputer />&nbsp;Katalogize API</a>
                </div>
                <div>
                  <Link to={`/settings`} className="header-button header-user-option" onClick={() => {setShowOptions(false)}}><IoSettingsOutline />&nbsp;Settings</Link>
                </div>
                <div>
                  <Link to={`/`} className="header-button header-user-option" onClick={() => {handleLogOut(); setShowOptions(false)}}><IoExitOutline />&nbsp;Log Out</Link>
                </div>
              </div>
            </div>

        </div>

        </div>
        : null
      }
    </div>
  );

  const logoLink = displayName ? 
    <Link to="/home"><img src={logo} className="header-logo" alt="logo"/></Link> :
    <Link to="/"><img src={logo} className="header-logo" alt="logo"/></Link>;
  
  const loginOptions = displayName ?
    <div className="header-options">
      {userInfo}
      {/* <Link to={`/${username}`} className="header-link"><div className="header-button">{displayName}</div></Link>
      <div className="header-button" onClick={() => handleLogOut()}>Log Out</div> */}
    </div>  
    :
    <span><Link to="/login" className="header-button">Sign In</Link>
    <Link to="/register" className="header-button">Sign Up</Link></span>;

  return (
    <div className="header">
      {logoLink}
      <div className="header-container-left">
        {loginOptions}
      </div>
    </div>
  );
}
  
  export default Header;