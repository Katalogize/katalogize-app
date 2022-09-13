import "./Header.scss";
import logo from '../../assets/img/logo/logo_black_medium.svg';
import {Link} from "react-router-dom";
function Header() {
  
  return (
    <div className="header">
      <Link to="/"><img src={logo} className="header-logo" alt="logo"/></Link>
      <div className="header-container-left">
        <Link to="/login" className="header-button">Sign In</Link>
        <Link to="/register" className="header-button">Sign Up</Link>
      </div>
    </div>
  );
}
  
  export default Header;