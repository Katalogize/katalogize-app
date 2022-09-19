import "./Header.scss";
import logo from '../../assets/img/logo/logo_black_medium.svg';
import {Link,  useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store/userSlice";
import { gql, useMutation } from '@apollo/client';

const LOG_OUT = gql`
  mutation LogOut($userId: String!) {
    logOut (userId: $userId)
  }
`;

function Header() {

  const firstName = useSelector(state => state.user.firstName);
  const lastName = useSelector(state => state.user.lastName);
  const userId = useSelector(state => state.user.userId);

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

  const logoLink = firstName ? 
    <Link to="/home"><img src={logo} className="header-logo" alt="logo"/></Link> :
    <Link to="/"><img src={logo} className="header-logo" alt="logo"/></Link>;
  
  const loginOptions = firstName ?
    <span><span className="header-button">{firstName} {lastName}</span>
    <span className="header-button" onClick={() => handleLogOut()}>Log Out</span></span>  
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