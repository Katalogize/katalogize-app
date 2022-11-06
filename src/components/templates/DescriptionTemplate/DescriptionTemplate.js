import { TemplateModels } from "../TemplateModels";
import "../ValuesTemplate.scss";
import "./DescriptionTemplate.scss";
import { VscLock } from "react-icons/vsc";
import TemplateActions from "../TemplateActions/TemplateActions"
import TemplateHeader from "../TemplateHeader/TemplateHeader"
import { useState } from "react";
import { GrTextAlignLeft } from "react-icons/gr";

function DescriptionTemplate(props) {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : "");
  
  return (
    <div className="template-container">
      {
        (props.model === TemplateModels.Value || props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue) ?
          <div className="template-title">
            <span><strong>{props.data.name}</strong></span>
          </div>
        :
          <TemplateHeader data={props.data} 
            changeFieldName={props.changeFieldName} changeIsRequired={props.changeIsRequired} />
      }
      <div>
        {
          props.model === TemplateModels.Value ?
            <span>{props.data.stringValue}</span>
          : (props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue) ?
            <input type="text" className="template-edit-data line-input" placeholder="Text data" 
              value={value} onChange={event => {setValue(event.target.value); props.changeFieldData(event.target.value, props.data.order)}}/>
          :
            <div className="template-locked-value" title="This will be an available field for all items in this Katalog">
              <span>Text field &nbsp; <GrTextAlignLeft className="template-locked-icon" /></span>
            </div>
        }
      </div>
      {props.model === TemplateModels.Template ? 
        <TemplateActions order={props.data.order} 
          deleteField={props.deleteField} reorderField={props.reorderField}/>
        :
          <span></span>
      }
    </div>
  );
}
  
  export default DescriptionTemplate;