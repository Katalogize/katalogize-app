import "./TemplateActions.scss";
import { HiOutlineTrash } from "react-icons/hi";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

function TemplateActions(props) {
  
  return (
    <div className="template-actions">
      <div className="template-order-number">
        <span>#{props.order+1}</span>
      </div>
      <div className="template-order-icons">
        <GoTriangleUp className="template-actions-icons" onClick={() => props.reorderField(props.order, -1)}></GoTriangleUp>
        <GoTriangleDown className="template-actions-icons" onClick={() => props.reorderField(props.order, 1)}></GoTriangleDown>
      </div>
      <div className="template-actions-icons template-actions-delete" onClick={() => props.deleteField(props.order)}>
        <HiOutlineTrash></HiOutlineTrash>
      </div>
    </div>
  );
}
export default TemplateActions;