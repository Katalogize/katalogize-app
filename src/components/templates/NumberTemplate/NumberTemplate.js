import "./NumberTemplate.scss";
import { TemplateModels } from "../TemplateModels";
import "../ValuesTemplate.scss";
import { VscLock } from "react-icons/vsc";
import TemplateActions from "../TemplateActions/TemplateActions"
import TemplateHeader from "../TemplateHeader/TemplateHeader"

function NumberTemplate(props) {

  return (
    <div className="template-container">
      {
        props.model === TemplateModels.Value || props.model === TemplateModels.EditValue ?
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
            <span>{props.data.intValue}</span>
          : props.model === TemplateModels.EditValue ?
            <input type="number" className="template-edit-data template-edit-number line-input" placeholder="Text data" 
              onChange={event => {props.changeFieldData(event.target.value, props.data.order)}}/>
          :
            <div className="template-locked-value">
              <span>Number data <VscLock className="template-locked-icon"></VscLock></span>
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