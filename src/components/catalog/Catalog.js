import "./Catalog.scss";
import logo_k from '../../assets/img/logo/logo_k.svg';
function Catalog(props) {

  let catalogData = props.catalogData;
  
  return (
    <div className="catalog">
      <img width="100" height="100" alt="location-reference" src={logo_k} />
      <div>
        <b>{catalogData.name}</b>
        <br />
        <span>{catalogData.description}</span>
        <br />
        <span><b>Owner:</b> {catalogData.user.firstName} {catalogData.user.lastName}</span>
      </div>
    </div>
  );
}
  
  export default Catalog;