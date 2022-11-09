import "./TemplateActions.scss";
import { HiOutlineTrash } from "react-icons/hi";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import ReactTooltip from "react-tooltip";

function TemplateActions(props) {
  
  return (
    <div className="template-actions">
      <ReactTooltip place="bottom" id="template-actions-tooltip" effect="solid" />
      <div className="template-order-number">
        <span data-tip="Order" data-for="template-actions-tooltip">#{props.order+1}</span>
      </div>
      <div className="template-order-icons">
        <GoTriangleUp onClick={() => props.reorderField(props.order, -1)} className="template-actions-icons remove-outline" data-tip="Move Up" data-for="template-actions-tooltip"></GoTriangleUp>
        <GoTriangleDown onClick={() => props.reorderField(props.order, 1)} className="template-actions-icons remove-outline" data-tip="Move Down" data-for="template-actions-tooltip"></GoTriangleDown>
      </div>
      <div onClick={() => props.deleteField(props.order)} className="template-actions-icons template-actions-delete remove-outline" data-tip="Delete Field" data-for="template-actions-tooltip">
        <HiOutlineTrash></HiOutlineTrash>
      </div>
    </div>
  );
}
export default TemplateActions;