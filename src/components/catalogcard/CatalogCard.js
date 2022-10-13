import "./CatalogCard.scss";
import logo_k from '../../assets/img/logo/logo_k.svg';
import { VscLock } from "react-icons/vsc";
import {Link} from "react-router-dom";
import { RiUser3Fill } from "react-icons/ri";

function CatalogCard(props) {

  let catalogData = props.catalogData;
  
  return (
    <div className="catalogcard-container">
      <Link className="catalogcard" to={`/${catalogData.user?.username}/${catalogData.name}`}>
        <img className="catalogcard-image" alt="logo" src={logo_k} />
        <div className="catalogcard-info">
          <div>
            <b>{catalogData.name}</b>
            {catalogData.isPrivate ? <VscLock className="catalogcard-lock" /> : <></>}
          </div>
          <div className="catalogcard-description">
            <span>{catalogData.description}</span>
          </div>
          <div className="catalogcard-owner">
            {/* <span className="catalogcard-owner"> */}
              <span className="catalogcard-owner-icon"><RiUser3Fill /></span>
              {catalogData.user?.firstName} {catalogData.user?.lastName}
            {/* </span> */}
          </div>
        </div>
      </Link>
    </div>
  );
}
  
  export default CatalogCard;