import { TemplateModels } from "../TemplateModels";
import "../ValuesTemplate.scss";
import "./DescriptionTemplate.scss";
import TemplateActions from "../TemplateActions/TemplateActions"
import TemplateHeader from "../TemplateHeader/TemplateHeader"
import { useState } from "react";
import { GrTextAlignLeft } from "react-icons/gr";
import ReactTooltip from "react-tooltip";

function DescriptionTemplate(props) {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : "");
  
  return (
    <div className="template-container">
      <ReactTooltip id="template-description-tooltip" place="right" effect="solid" />
      {
        (props.model === TemplateModels.Value || props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue) ?
          <div className="template-title">
            <span>
              <strong>
                {props.data.name} &nbsp; 
                <GrTextAlignLeft data-tip="Text Field" data-for="template-description-tooltip" className="template-type-icon remove-outline" />
              </strong>
            </span>
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
              value={value} onChange={event => {setValue(event.target.value); props.changeFieldData(event.target.value, props.data.id ? props.data.id : props.data.templateFieldId)}}/>
          :
            <div className="template-locked-value" title="This will be an available field for all items in this Katalog">
              <span>Text field &nbsp; <GrTextAlignLeft className="template-locked-icon" /></span>
            </div>
        }
      </div>
      {props.model === TemplateModels.Template ? 
        <TemplateActions order={props.data.order} 
          deleteField={props.deleteField} reorderField={props.reorderField} isLocked={props.data.id ? true : false}/>
        :
          <span></span>
      }
    </div>
  );
}
  
  export default DescriptionTemplate;