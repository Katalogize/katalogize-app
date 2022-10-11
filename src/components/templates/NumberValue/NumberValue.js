import "./NumberValue.scss";

function NumberValue(props) {
  
  return (
    <div className="template-container">
        <span><strong>{props.data.name}:&nbsp;</strong></span>
        <span>{props.data.intValue}</span>
    </div>
  );
}
  
  export default NumberValue;