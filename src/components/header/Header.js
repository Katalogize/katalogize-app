import "./Header.scss";
import logo from '../../assets/img/logo/logo_black_medium.svg';
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../store/userSlice";
function Header() {

  const firstName = useSelector(state => state.user.firstName);
  const dispatch = useDispatch();
  dispatch(update({firstName: 'Test'}));
  
  return (
    <div className="header">
      <Link to="/"><img src={logo} className="header-logo" alt="logo"/></Link>
      <div className="header-container-left">
        <span>{firstName}</span>
        <Link to="/login" className="header-button">Sign In</Link>
        <Link to="/register" className="header-button">Sign Up</Link>
      </div>
    </div>
  );
}
  
  export default Header;