import "./CatalogItem.scss";
import { useQuery, useMutation, gql } from '@apollo/client';
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo_k from '../../assets/img/logo/logo_k.svg';
import { RiUser3Fill } from "react-icons/ri";
import DescriptionTemplate from "../../components/templates/DescriptionTemplate/DescriptionTemplate";
import NumberTemplate from "../../components/templates/NumberTemplate/NumberTemplate";
import { TemplateModels, TemplateType, TemplateTypeName } from "../../components/templates/TemplateModels";
import { useState } from "react";
import ConfirmationPopUp from "../../components/ConfirmationPopUp/ConfirmationPopUp";
import { HiOutlinePencil } from "react-icons/hi";
// import { BsShare } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import ImageTemplate from "../../components/templates/ImageTemplate/ImageTemplate";
import ReactTooltip from "react-tooltip";
import { toastInfo, toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";

const CATALOG_ITEM = gql`
  query GetCatalogItem ($username: String!, $catalogName: String!, $itemName: String!){
    getCatalogItem (username: $username, catalogName: $catalogName, itemName: $itemName) {
      id,
      name,
      catalogId,
      template {
        id,
        name
      },
      fields {
        fieldType: __typename
        ... on ItemFieldNumber {
          order,
          name,
          numberValue: value
        }
        ... on ItemFieldString {
          order,
          name,
          stringValue: value
        }
        ... on ItemFieldImage {
          order,
          name,
          imageValue: value {
            path
          }
        }
      }
    }
  }
`;

const CATALOG_TEMPLATE = gql`
  query GetCatalogByUsernameAndCatalogName ($username: String!, $catalogName: String!){
    getCatalogByUsernameAndCatalogName (username: $username, catalogName: $catalogName) {
      id,
      name,
      templates {
        id,
        name
        templateFields {
          name,
          order,
          fieldType
        }
      }
    }
  }
`;

const SAVE_ITEM = gql`
  mutation SaveCatalogItem($catalogItem: CatalogItemInput) {
    saveCatalogItem(catalogItem: $catalogItem) {
      id,
      name
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteCatalogItem($id: ID!) {
    deleteCatalogItem (id: $id) {
      id
    }
  }
`;

function ItemTemplates (props) {
  const value = (value) => {
    if (value.fieldType===TemplateTypeName.Description || value.fieldType === TemplateType.Description) {
      return(<DescriptionTemplate key={value.name} data={value} model={props.model} changeFieldData={props.updateFieldDataDescription} defaultValue={value.stringValue}/>);
    } else if (value.fieldType===TemplateTypeName.Number || value.fieldType === TemplateType.Number) {
      return(<NumberTemplate key={value.name} data={value} model={props.model}  changeFieldData={props.updateFieldDataNumber} defaultValue={value.numberValue}/>);
    } else if (value.fieldType===TemplateTypeName.Image || value.fieldType === TemplateType.Image) {
      return(<ImageTemplate key={value.name} data={value} model={props.model}  changeFieldData={props.updateFieldDataImage} defaultValue={value.imageValue}/>);
    }
  }

  return props.itemTemplates.map(field => (
    value(field)
  ));
}

function CatalogItem() {
  const loggedUsername = useSelector(state => state.user.username);
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();
  const {itemname} = useParams();

  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteItem] = useMutation(DELETE_ITEM);

  const [viewMode, setViewMode] = useState(itemname === "create-item" ? TemplateModels.CreateValue : TemplateModels.Value);
  const [itemData, setItemData] = useState({
    stringFields: [],
    numberFields: [],
    imageFields: []
  });
  let itemName = itemname === "create-item" ? "" : itemname;

  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveItem] = useMutation(SAVE_ITEM);

  const { loading, error, data } = 
    useQuery(viewMode === TemplateModels.Value || viewMode === TemplateModels.EditValue ? CATALOG_ITEM : CATALOG_TEMPLATE,
      {variables: viewMode === TemplateModels.Value || viewMode === TemplateModels.EditValue
        ? {username: username, catalogName: catalogname, itemName: itemname}
        : {username: username, catalogName: catalogname}
      }
    );  

  const handleSaveItem = async() => {
    itemData.name = itemName;
    setIsSaving(true);
    const id = toastLoading("Saving Item...");
    saveItem({ 
      variables: { catalogItem: itemData },
      onCompleted(data) {
        toastUpdateSuccess(id, "Item saved!");
        setIsSaving(false);
        navigate(`/${username}/${catalogname}`);
        setTimeout(() => {
          navigate(`/${username}/${catalogname}/${data.saveCatalogItem.name}`);
        }, 10);
        // window.location.reload();
      },
      onError(error) {
        toastUpdateError(id, "Error while saving item. " + error.message);
        setSaveError(error.message);
        setIsSaving(false);
      }
    });
  }

  const handleDeleteItem = async() => {
    const id = toastLoading("Deleting Item...");
    setIsDeleteLoading(true);
    deleteItem({ 
      variables: { id: data.getCatalogItem.id },
      onCompleted(data) {
        toastUpdateSuccess(id, "Item deleted!");
        setIsDeleteLoading(false);
        setShowDeletePopUp(false);
        navigate(`/${username}/${catalogname}`);
      },
      onError(error) {
        toastUpdateError(id, "Error while deleting item. " + error.message);
        setIsDeleteLoading(false);
        setDeleteError(error.message);
      }
    });
  };

  const updateData = (itemData) => {
    this.itemData = itemData;
  }

  if (loading) return <span>Loading...</span>;
  if (error) navigate("/notfound");

  const startCatalogItemObject = (data, catalogId, fields, templateId) => {
    itemData.catalogId = catalogId;
    itemData.templateId = templateId;
    fields.forEach(field => {
      if (field.fieldType===TemplateTypeName.Description || field.fieldType === TemplateType.Description) {
        itemData.stringFields.push({name: "", order: field.order, value: field.stringValue});
      } else if (field.fieldType===TemplateTypeName.Number || field.fieldType === TemplateType.Number) {
        itemData.numberFields.push({name: "", order: field.order, value: field.numberValue});
      } else if (field.fieldType===TemplateTypeName.Image || field.fieldType === TemplateType.Image) {
        field.imageValue?.forEach(el => {delete el['__typename']});
        itemData.imageFields.push({name: "", order: field.order, value: field.imageValue});
      }
    });
    itemName = data.name;
    setItemData(itemData);
  };

  if ((!itemData.catalogId) && viewMode === TemplateModels.EditValue) {
    itemData.id = data.getCatalogItem.id;
    startCatalogItemObject(data.getCatalogItem, data.getCatalogItem.catalogId, data.getCatalogItem?.fields, data.getCatalogItem.template.id);
  } else if ((!itemData.catalogId) &&  viewMode === TemplateModels.CreateValue ) {
    itemData.id = "id";
    startCatalogItemObject(data.getCatalogByUsernameAndCatalogName,data.getCatalogByUsernameAndCatalogName.id, data.getCatalogByUsernameAndCatalogName.templates[0].templateFields, data.getCatalogByUsernameAndCatalogName.templates[0].id);
  }

  const updateField = (fields, order, value) => {
    let itemIndex = fields.findIndex(x => x.order === order);
    if (itemIndex > -1) {
      fields[itemIndex].value = value;
      setItemData(itemData);
    }
  }

  const updateFieldDataDescription = (value, order) => {
    updateField (itemData.stringFields, order, value);
  };

  const updateFieldDataNumber = (value, order) => {
    updateField(itemData.numberFields, order, value);
  };

  const updateFieldDataImage = (value, order) => {
    updateField(itemData.imageFields, order, value);
  };

  return (
    <div className="catalog">
      <ConfirmationPopUp 
        title="Delete Item" 
        text="This item will be lost forever. Are you sure you want to delete this item? " 
        isLoading={isDeleteLoading}
        errorMessage={deleteError}
        action="Delete Item" isCriticalAction={true} showPopUp={showDeletePopUp}
        confirmed={() => {handleDeleteItem()}}
        close={() => {setShowDeletePopUp(false); setDeleteError("")}} />

      {viewMode === TemplateModels.EditValue || viewMode === TemplateModels.CreateValue ?
        <div className="catalogitem-header">
          <input className="title createcatalog-name line-input" placeholder="Item Name" defaultValue={itemName} onChange={event => { itemName = event.target.value}} />
        </div>
        : viewMode === TemplateModels.Value ?
        <div className="catalog-header">
        <h1 className="title catalog-name">{itemname}</h1>
        <div className="catalog-actions-container">
          <div className="catalog-actions">
            {loggedUsername === username ? <HiOutlinePencil className="catalog-actions-item remove-outline" data-tip="Edit" onClick={() => {setViewMode(TemplateModels.EditValue)}} /> : null}
            <MdContentCopy className="catalog-actions-item remove-outline" data-tip="Copy Link" onClick={() => {navigator.clipboard.writeText(window.location); toastInfo("Link Copied!")}} />
            {/* <BsShare className="catalog-actions-item" title="Share" onClick={() => {navigator.clipboard.writeText(window.location)}} /> */}
            {loggedUsername === username ? <AiOutlineDelete className="catalog-actions-item catalog-actions-delete remove-outline" data-tip="Delete Item" onClick={() => setShowDeletePopUp(true)} /> : null}
            <ReactTooltip place="bottom" effect="solid" />
          </div>
        </div>
      </div>
        : null
      }
      <div className="info-tags">
        <Link to={`/${username}`} className="info-tags">
          <RiUser3Fill className="info-tags-icon" alt="user"/>
          <span>{username}</span>
        </Link>
        <Link to={`/${username}/${catalogname}`} className="info-tags">
          <img src={logo_k} className="info-tags-icon" alt="catalog"/>
          <span>{catalogname}</span>
        </Link>
      </div>
      {viewMode === TemplateModels.CreateValue || viewMode === TemplateModels.EditValue ?
        <div>
          <ItemTemplates 
            itemTemplates={viewMode === TemplateModels.CreateValue 
              ? data?.getCatalogByUsernameAndCatalogName.templates[0].templateFields
              : data?.getCatalogItem?.fields} 
            model={viewMode} 
            updateData={updateData}
            updateFieldDataDescription={updateFieldDataDescription}
            updateFieldDataNumber={updateFieldDataNumber}
            updateFieldDataImage={updateFieldDataImage} />
          <div className="catalogitem-save-container">
            <p className="critical-color">{saveError}</p>
            {isSaving ? 
                <span style={{float: "right"}}>Saving...</span> :
              <div>
                <button className="button primary-button" onClick={(() => {handleSaveItem()})}>Save Item</button>
              </div>
            }
          </div>
        </div>
      : viewMode === TemplateModels.Value ?
        <ItemTemplates itemTemplates={data?.getCatalogItem?.fields} model={viewMode} />
      : null
      }
    </div>
  );
}

export default CatalogItem;