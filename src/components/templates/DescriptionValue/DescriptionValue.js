import "../ValuesTemplate.scss";
import "./DescriptionValue.scss";

function DescriptionValue(props) {
  
  return (
    <div className="template-container">
      <div className="template-title">
        <span><strong>{props.data.name}</strong></span>
      </div>
      <div>
        <span>{props.data.stringValue}</span>
      </div>
    </div>
  );
}
  
  export default DescriptionValue;