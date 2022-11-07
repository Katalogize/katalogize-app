import "./TemplateHeader.scss";
import { useState } from "react";

function TemplateHeader(props) {

  const [ , setFieldName] = useState(props.data.name);
  // const [ , setIsRequired] = useState(props.data.isRequired);
  let namePlaceholder = "Field Name";
  switch (props.data.fieldType) {
    case 1:
      namePlaceholder = "Text Field Name";
      break;
    case 2:
      namePlaceholder = "Number Field Name";
      break;
    case 3:
      namePlaceholder = "Image Field Name";
      break;
    default:
      break;
  }
  
  return (
    <div className="template-header">
      <input type="text" className="template-title line-input" placeholder={namePlaceholder}
        value={props.data.name} 
        onChange={event => {setFieldName(event.target.value); props.changeFieldName(event.target.value, props.data.order)}}/>
      {/* <div className="template-required">
        <label className="template-checkbox">
          <input type="checkbox" className="template-required-checkbox" 
            checked={props.data.isRequired}
            onChange={event => { setIsRequired(event.target.checked); props.changeIsRequired(event.target.checked, props.data.order)}} />
          <span>Required</span>
        </label>
      </div> */}
    </div>
  );
}
export default TemplateHeader;