import "./CatalogItem.scss";
import { useQuery, useMutation, gql } from '@apollo/client';
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo_k from '../../assets/img/logo/logo_k.svg';
import { RiUser3Fill } from "react-icons/ri";
import DescriptionTemplate from "../../components/templates/DescriptionTemplate/DescriptionTemplate";
import NumberTemplate from "../../components/templates/NumberTemplate/NumberTemplate";
import { TemplateModels, TemplateTypeEnum, TemplateTypeName } from "../../components/templates/TemplateModels";
import { useState } from "react";
import ConfirmationPopUp from "../../components/ConfirmationPopUp/ConfirmationPopUp";
import { HiOutlinePencil } from "react-icons/hi";
import { BsShare } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";

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
        ... on ItemFieldInt {
          order,
          name,
          intValue: value
        }
        ... on ItemFieldString {
          order,
          name,
          stringValue: value
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
        id
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
    if (value.fieldType===TemplateTypeName.Description || value.fieldType === TemplateTypeEnum.Description) {
      return(<DescriptionTemplate key={value.name} data={value} model={props.model} changeFieldData={props.updateFieldDataDescription} defaultValue={value.stringValue}/>);
      
    } else if (value.fieldType===TemplateTypeName.Number || value.fieldType === TemplateTypeEnum.Number) {
        return(<NumberTemplate key={value.name} data={value} model={props.model}  changeFieldData={props.updateFieldDataNumber} defaultValue={value.intValue}/>);
    }
  }

  return props.itemTemplates.map(field => (
    value(field)
  ));
}

function CatalogItem() {
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
    integerFields: []
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
    saveItem({ 
      variables: { catalogItem: itemData },
      onCompleted(data) {
        setIsSaving(false);
        navigate(`/${username}/${catalogname}/${data.saveCatalogItem.name}`);
        window.location.reload();
      },
      onError(error) {
        setSaveError(error.message);
        setIsSaving(false);
      }
    });
  }

  const handleDeleteItem = async() => {
    setIsDeleteLoading(true);
    deleteItem({ 
      variables: { id: data.getCatalogItem.id },
      onCompleted(data) {
        setIsDeleteLoading(false);
        setShowDeletePopUp(false);
        navigate(`/${username}/${catalogname}`);
      },
      onError(error) {
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
      if (field.fieldType===TemplateTypeName.Description || field.fieldType === TemplateTypeEnum.Description) {
        itemData.stringFields.push({name: "", order: field.order, value: field.stringValue});
      }
      else if (field.fieldType===TemplateTypeName.Number || field.fieldType === TemplateTypeEnum.Number) {
        itemData.integerFields.push({name: "", order: field.order, value: field.intValue});
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
    updateField(itemData.integerFields, order, value);
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
            <BsShare className="catalog-actions-item" title="Share" onClick={() => {navigator.clipboard.writeText(window.location)}}></BsShare>
            <HiOutlinePencil className="catalog-actions-item" title="Edit" onClick={() => {setViewMode(TemplateModels.EditValue)}}></HiOutlinePencil>
            <AiOutlineDelete className="catalog-actions-item catalog-actions-delete" title="Delete" onClick={() => setShowDeletePopUp(true)}></AiOutlineDelete>
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
            updateFieldDataNumber={updateFieldDataNumber} />
          <div className="catalogitem-save-container">
            <p className="critical-color">{saveError}</p>
            {isSaving ? 
                <span style={{float: "right"}}>Saving...</span> :
              <div>
                <button className="button" onClick={(() => {handleSaveItem()})}>Save Item</button>
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