import "./CatalogCard.scss";
import logo_k from '../../assets/img/logo/logo_k.svg';
import { VscLock } from "react-icons/vsc";
import {Link} from "react-router-dom";

function CatalogCard(props) {

  let catalogData = props.catalogData;
  
  return (
    <div>
      <Link className="catalogcard" to={`/${catalogData.user?.username}/${catalogData.name}`}>
        <img className="catalogcard-image" alt="logo" src={logo_k} />
        <div className="catalogcard-info">
          <b>{catalogData.name}</b>
          {catalogData.isPrivate ? <VscLock className="catalogcard-lock" /> : <></>}
          <br />
          <span>{catalogData.description}</span>
          <br />
          <span><b>Owner:</b> {catalogData.user?.firstName} {catalogData.user?.lastName}</span>
        </div>
      </Link>
    </div>
  );
}
  
  export default CatalogCard;