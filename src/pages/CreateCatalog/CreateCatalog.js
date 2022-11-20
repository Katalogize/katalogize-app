import "./CreateCatalog.scss";
import {useState} from 'react';
import { GrTextAlignLeft } from "react-icons/gr";
import { TbNumbers } from "react-icons/tb";
import { IoImagesOutline } from "react-icons/io5";
import DescriptionTemplate from "../../components/templates/DescriptionTemplate/DescriptionTemplate";
import NumberTemplate from "../../components/templates/NumberTemplate/NumberTemplate";
import { TemplateModels, TemplateType } from "../../components/templates/TemplateModels";
import { BsHouseDoor } from "react-icons/bs";
import { VscLock } from "react-icons/vsc";
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams} from "react-router-dom";
import ImageTemplate from "../../components/templates/ImageTemplate/ImageTemplate";
import ReactTooltip from "react-tooltip";
import { toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TemplateActions from "../../components/templates/TemplateActions/TemplateActions";

const CATALOG_TEMPLATE = gql`
  query GetCatalogByUsernameAndCatalogName ($username: String!, $catalogName: String!){
    getCatalogByUsernameAndCatalogName (username: $username, catalogName: $catalogName) {
      id,
      name,
      description,
      templates {
        id,
        name
        templateFields {
          id,
          name,
          order,
          fieldType
        }
      }
    }
  }
`;

const SAVE_CATALOG_AND_TEMPLATE = gql`
  mutation SaveCatalogAndTemplate($catalog: CatalogInput, $catalogTemplate: CatalogTemplateInput) {
    saveCatalogAndTemplate(catalog: $catalog, catalogTemplate: $catalogTemplate){
      id
      name
      description
      templates {
          id,
          name,
          allowNewFields,
          templateFields {
              order,
              name,
              fieldType
          }
      }
      items {
          id,
          templateId,
          fields {
            templateType: __typename
            ... on ItemFieldNumber {
                name
                numberValue: value
            }
            ... on ItemFieldString {
                name
                stringValue: value
            }
          }
      }
      user {
        id,
        displayName,
        username
      }
    }
  }
`;

function TemplateFields (props) {
  const updateFieldName = (value, order) => {
    props.fields[order].name = value;
  };

  const deleteField = (order) => {
    props.fields.splice(order, 1);
    props.fields?.map ((field, index) => field.order = index);
    props.updateFields(props.fields);
  };

  const reorderField = (order, shift) => {
    if (props.fields[order+shift]?.id == null) { //Should not reorder pre existent fields
      let field = props.fields.splice(order, 1);
      props.fields.splice(order+shift, 0, field[0]);
      props.fields?.map ((field, index) => field.order = index);
      props.updateFields(props.fields);
    }
  };
  
  const value = (value) => {
    switch (value.fieldType) {
      case TemplateType.Description:
        return(<DescriptionTemplate key={`${value.fieldType}-${value.order}`} model={TemplateModels.Template} 
                  changeFieldName={updateFieldName} deleteField={deleteField} reorderField={reorderField} data={value} />);
      case TemplateType.Number:
        return(<NumberTemplate key={`${value.fieldType}-${value.order}`} model={TemplateModels.Template}
                  changeFieldName={updateFieldName} deleteField={deleteField} reorderField={reorderField} data={value} />);
      case TemplateType.Image:
        return(<ImageTemplate key={`${value.fieldType}-${value.order}`} model={TemplateModels.Template}
                  changeFieldName={updateFieldName} deleteField={deleteField} reorderField={reorderField} data={value} />);
      default:
        break;
    }
  }

  return props.fields?.map(field => (
    value(field)
  ));
}

function CreateCatalog() {

  const {catalogname} = useParams();
  const [catalogName, setCatalogName] = useState('');
  const [catalogDescription, setCatalogDescription] = useState('');
  const [error, setError] = useState('');
  const [catalogFields, setCatalogFields] = useState([]);
  const [saveCatalog] = useMutation(SAVE_CATALOG_AND_TEMPLATE);
  const username = useSelector(state => state.user.username);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const navigate = useNavigate();

  const [getCatalogTemplate, {loading}] = useLazyQuery(CATALOG_TEMPLATE, {
    fetchPolicy: 'network-only', 
    variables: {username: username, catalogName: catalogname},
    onCompleted(data) {
      setCatalogName(data.getCatalogByUsernameAndCatalogName.name);
      setCatalogDescription(data.getCatalogByUsernameAndCatalogName.description);
      let fields = [];
      data.getCatalogByUsernameAndCatalogName?.templates[0].templateFields.forEach(element => {
        fields.push({order: element.order, name: element.name, fieldType: element.fieldType, id: element.id});
        //TODO: Redirect on error
      });
      handleUpdateFields(fields);
      setTemplateLoaded(true);
    }
  });

  const loadTemplate = async() => {
    await getCatalogTemplate();
  };

  if (!templateLoaded && catalogname && !loading) {
    loadTemplate();
  }

  const handleAddField = (option) => {
    let newField = {
      order: catalogFields.length,
      name: "",
      fieldType: option,
      id: "id"
    };
    setCatalogFields(current => [...current, newField]);
    // console.log (catalogFields);
  }

  const handleUpdateFields = (fields) => {
    setCatalogFields(() => [...fields]);
  }

  const handleCreateCatalog = async(name, description, fields) => {
    const catalog = {
      id: "id",
      name: name,
      description: description,
      userId: 'userId',
      templateIds: ['templateId']
    }
    const catalogTemplate = {
      id: "id",
      name: name + " Template",
      allowNewFields: false,
      templateFields: fields
    }
    const id = toastLoading("Saving Katalog...");
    saveCatalog({ 
      variables: { catalog: catalog, catalogTemplate: catalogTemplate },
      onCompleted(data) {
        toastUpdateSuccess(id, "Katalog saved!");
        navigate(`/${data.saveCatalogAndTemplate.user.username}/${name}`);
      },
      onError(error) {
        toastUpdateError(id, "Error while saving Katalog. " + error.message);
        setError(error.message);
      }
    });
  };

  return (
    <div className="createcatalog">
      <ReactTooltip place="bottom" id="createcatalog-locked-field" effect="solid" />
      <div className="breadcrumbs">
        <Link to={`/`}><BsHouseDoor /></Link>
        <span>{' > '}</span>
        <Link to={`/${username}`}>{username}</Link>
        {catalogname
          ?<span><span>{' > '}</span>
          <Link to={`/${username}/${catalogname}`}>{catalogname}</Link></span> 
          : null
        }
        <span>{' > '}</span>
        {catalogname
          ?<span>Edit Katalog</span>
          :<span>Create Katalog</span>
        }
      </div>
      <div className="createcatalog-info">
        {catalogname
          ?<h3 className="title">Edit Katalog</h3>
          :<h3 className="title">Create new Katalog</h3>
        }
        <input className="title createcatalog-name line-input" placeholder="Katalog Name" value={catalogName} onChange={event => setCatalogName(event.target.value)}/>
        <textarea type="text" className="createcatalog-description" placeholder="Katalog Description" value={catalogDescription} onChange={event => setCatalogDescription(event.target.value)}></textarea>
        <h3 className="title createcatalog-data createcatalog-template-title" onClick={() => console.log(catalogFields)}>Katalog Template</h3>
        <span className="createcatalog-tips">Select the fields that will be available in all items for this Katalog. Name is a required field for all items.</span>
        {catalogname
          ?<span style={{marginTop: 15}} className="createcatalog-tips">While editing a Katalog, you are only able to add new fields or rename existent ones.</span>
          :null
        }
        <div className="template-container" data-tip="Name is a required field for all items" data-for="createcatalog-locked-field">
          <h4 className="createcatalog-locked-field">Name &nbsp;<VscLock></VscLock></h4>
          <TemplateActions order={-1} isLocked={true}/>
        </div>
        <TemplateFields fields={catalogFields} updateFields={handleUpdateFields}></TemplateFields>
        <span className="title template-data-selection-title">Add Template Fields</span>
        <div className="template-options">
          <div className="template-option" onClick={() => handleAddField(1)}>
            <div className="template-option-icon">
              <GrTextAlignLeft />
            </div>
            Add Text
          </div>
          <div className="template-option" onClick={() => handleAddField(2)}>
            <div className="template-option-icon">
              <TbNumbers />
            </div>
            Add Number
          </div>
          <div className="template-option" onClick={() => handleAddField(3)}>
            <div className="template-option-icon">
              <IoImagesOutline />
            </div>
            Add Image
          </div>
        </div>
        <span className="template-error-message">{error}</span>
        <div className="template-create-button">
          <button className="button primary-button" onClick={() => handleCreateCatalog(catalogName, catalogDescription, catalogFields)}>Create Katalog</button>
        </div>
      </div>
    </div>
  );
}

export default CreateCatalog;