import { TemplateModels } from "../TemplateModels";
import "../ValuesTemplate.scss";
import "./DescriptionTemplate.scss";
import { VscLock } from "react-icons/vsc";
import TemplateActions from "../TemplateActions/TemplateActions"
import TemplateHeader from "../TemplateHeader/TemplateHeader"

function DescriptionTemplate(props) {
  
  return (
    <div className="template-container">
      {
        props.model === TemplateModels.Value ?
          <div className="template-title">
            <span><strong>{props.data.name}</strong></span>
          </div>
        : props.model === TemplateModels.EditValue ?
          <span>EditValue</span>
        :
          <TemplateHeader data={props.data} 
            changeFieldName={props.changeFieldName} changeIsRequired={props.changeIsRequired} />
      }
      <div>
        {
          props.model === TemplateModels.Value ?
            <span>{props.data.stringValue}</span>
          : props.model === TemplateModels.EditValue ?
            <span>EditValue</span>
          :
            <div className="template-locked-value">
              <span>Text data <VscLock className="template-locked-icon"></VscLock></span>
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