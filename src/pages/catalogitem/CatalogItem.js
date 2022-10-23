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

const CATALOG_ITEM = gql`
  query GetCatalogItem ($username: String!, $catalogName: String!, $itemName: String!){
    getCatalogItem (username: $username, catalogName: $catalogName, itemName: $itemName) {
      id,
      name,
      catalogId,
      template {
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
  mutation CreateCatalogItem($catalogItem: CatalogItemInput) {
    createCatalogItem(catalogItem: $catalogItem) {
      id,
      name
    }
  }
`;

function ItemTemplates (props) {
  // let itemData = {};
  // itemData = {
  //   integerFields: [],
  //   stringFields: []
  // }

  // props.itemTemplates.forEach(field => {
  //   if (field.fieldType===TemplateTypeName.Description || field.fieldType === TemplateTypeEnum.Description) {
  //     itemData.stringFields.push({name: "", order: field.order, value: field.stringValue});
  //   }
  //   else if (field.fieldType===TemplateTypeName.Number || field.fieldType === TemplateTypeEnum.Number) {
  //     itemData.integerFields.push({name: "", order: field.order, value: field.intValue});
  //   }
  // });

  // const updateFieldDataDescription = (value, order) => {
  //   let itemIndex = itemData.stringFields.findIndex(x => x.order == order);
  //   if (itemIndex > -1) {
  //     itemData.stringFields[itemIndex].value = value;
  //     props.updateData(itemData);
  //   }
  // };

  // const updateFieldDataNumber = (value, order) => {
  //   let itemIndex = itemData.integerFields.findIndex(x => x.order == order);
  //   if (itemIndex > -1) {
  //     itemData.integerFields[itemIndex].value = value;
  //     props.updateData(itemData);
  //   }
  // };

  const value = (value) => {
    if (value.fieldType===TemplateTypeName.Description || value.fieldType === TemplateTypeEnum.Description) {
      return(<DescriptionTemplate key={value.name} data={value} model={props.model} changeFieldData={props.updateFieldDataDescription} />);
      
    } else if (value.fieldType===TemplateTypeName.Number || value.fieldType === TemplateTypeEnum.Number) {
        return(<NumberTemplate key={value.name} data={value} model={props.model}  changeFieldData={props.updateFieldDataNumber}/>);
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
  const [viewMode] = useState(itemname === "create-item" ? TemplateModels.EditValue : TemplateModels.Value);
  const [itemData, setItemData] = useState({
    stringFields: [],
    integerFields: []
  });
  const [itemName, setItemName] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveItem] = useMutation(SAVE_ITEM);
  const { loading, error, data } = 
    useQuery(viewMode === TemplateModels.Value ? CATALOG_ITEM : CATALOG_TEMPLATE,
      {variables: viewMode === TemplateModels.Value
        ? {username: username, catalogName: catalogname, itemName: itemname}
        : {username: username, catalogName: catalogname}
      },{fetchPolicy: 'network-only'
      }
    );

  const handleSaveItem = async() => {
    itemData.catalogId = data.getCatalogByUsernameAndCatalogName.id;
    itemData.templateId = data.getCatalogByUsernameAndCatalogName.templates[0].id;
    itemData.name = itemName;
    console.log(itemData);
    setIsSaving(true);
    saveItem({ 
      variables: { catalogItem: itemData },
      onCompleted(data) {
        console.log(data);
        setIsSaving(false);
        navigate(`/${username}/${catalogname}/${data.createCatalogItem.name}`);
        window.location.reload();
      },
      onError(error) {
        setSaveError(error.message);
        setIsSaving(false);
      }
    });
  }

  const updateData = (itemData) => {
    setItemData(itemData);
  }

  if (loading) return <span>Loading...</span>;
  if (error) navigate("/notfound");

  if ((itemData.stringFields.length == 0 || itemData.integerFields == 0) && viewMode === TemplateModels.EditValue ) {
    console.log(itemData);
    data.getCatalogByUsernameAndCatalogName.templates[0].templateFields.forEach(field => {
      if (field.fieldType===TemplateTypeName.Description || field.fieldType === TemplateTypeEnum.Description) {
        itemData.stringFields.push({name: "", order: field.order, value: field.stringValue});
      }
      else if (field.fieldType===TemplateTypeName.Number || field.fieldType === TemplateTypeEnum.Number) {
        itemData.integerFields.push({name: "", order: field.order, value: field.intValue});
      }
    });
    console.log(itemData);
    setItemData(itemData);
  }

  const updateFieldDataDescription = (value, order) => {
    let itemIndex = itemData.stringFields.findIndex(x => x.order == order);
    if (itemIndex > -1) {
      itemData.stringFields[itemIndex].value = value;
      setItemData(itemData);
      console.log(itemData);
    }
  };

  const updateFieldDataNumber = (value, order) => {
    let itemIndex = itemData.integerFields.findIndex(x => x.order == order);
    if (itemIndex > -1) {
      itemData.integerFields[itemIndex].value = value;
      setItemData(itemData);
    }
  };

  return (
    <div className="catalog">
      {/* <div className="breadcrumbs">
        <Link to={`/`}>Home</Link>
        <span>{' > '}</span>
        <Link to={`/${username}`}>{username}</Link>
        <span>{' > '}</span>
        <Link to={`/${username}/${catalogname}`}>{catalogname}</Link>
        <span>{' > '}</span>
        <span>{itemname}</span>
      </div> */}
      {viewMode === TemplateModels.EditValue ?
        <div className="catalogitem-header">
          <input className="title createcatalog-name line-input" placeholder="Item Name" onChange={event => { setItemName(event.target.value)}} />
        </div>
        : viewMode === TemplateModels.Value ?
        <h1 className="title">{itemname}</h1>
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
      {viewMode === TemplateModels.EditValue ?
        <div>
          <ItemTemplates 
            itemTemplates={data?.getCatalogByUsernameAndCatalogName.templates[0].templateFields} 
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