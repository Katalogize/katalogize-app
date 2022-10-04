import "./Catalog.scss";
import logo_k from '../../assets/img/logo/logo_k.svg';
import { VscLock } from "react-icons/vsc";

function Catalog(props) {

  let catalogData = props.catalogData;
  
  return (
    <div className="catalog">
      <img className="catalog-image" alt="location-reference" src={logo_k} />
      <div className="catalog-info">
        <b>{catalogData.name}</b>
        {catalogData.isPrivate ? <VscLock className="catalog-lock" /> : <></>}
        <br />
        <span>{catalogData.description}</span>
        <br />
        <span><b>Owner:</b> {catalogData.user?.firstName} {catalogData.user?.lastName}</span>
      </div>
    </div>
  );
}
  
  export default Catalog;