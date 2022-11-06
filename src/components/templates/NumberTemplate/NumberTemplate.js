import "./NumberTemplate.scss";
import { TemplateModels } from "../TemplateModels";
import "../ValuesTemplate.scss";
import { TbNumbers } from "react-icons/tb";
import TemplateActions from "../TemplateActions/TemplateActions"
import TemplateHeader from "../TemplateHeader/TemplateHeader"
import { useState } from "react";

function NumberTemplate(props) {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : "");
  return (
    <div className="template-container">
      {
        props.model === TemplateModels.Value || props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue ?
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
            <span>{props.data.numberValue}</span>
          : props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue ?
            <input type="number" className="template-edit-data template-edit-number line-input" placeholder="Text data" 
              value={value} onChange={event => {setValue(event.target.value); props.changeFieldData(event.target.value, props.data.order)}}/>
          :
            <div className="template-locked-value" title="This will be an available field for all items in this Katalog">
              <span>Number field &nbsp; <TbNumbers className="template-locked-icon" /></span>
            </div>
        }
      </div>
      {props.model === TemplateModels.Template ? 
        <TemplateActions order={props.data.order} deleteField={props.deleteField} reorderField={props.reorderField}/>
        :
          <span></span>
      }
    </div>
  );
}
  
export default NumberTemplate;