import "./CreateCatalog.scss";
import {useState} from 'react';
import { GrTextAlignLeft } from "react-icons/gr";
import { TbNumbers } from "react-icons/tb";
import DescriptionTemplate from "../../components/templates/DescriptionTemplate/DescriptionTemplate";
import NumberValue from "../../components/templates/NumberTemplate/NumberTemplate";
import { TemplateModels, TemplateType } from "../../components/templates/TemplateModels";
import { VscLock } from "react-icons/vsc";
import { gql, useMutation } from '@apollo/client';
import { useNavigate} from "react-router-dom";

const CREATE_CATALOG_AND_TEMPLATE = gql`
  mutation CreateCatalogAndTemplate($catalog: CatalogInput, $catalogTemplate: CatalogTemplateInput) {
    createCatalogAndTemplate(catalog: $catalog, catalogTemplate: $catalogTemplate){
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
            ... on ItemFieldInt {
                order
                name
                intValue: value
            }
            ... on ItemFieldString {
                order
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
    let field = props.fields.splice(order, 1);
    props.fields.splice(order+shift, 0, field[0]);
    props.fields?.map ((field, index) => field.order = index);
    props.updateFields(props.fields);
  };
  
  const value = (value) => {
    switch (value.fieldType) {
      case TemplateType.Description:
        return(<DescriptionTemplate key={`${value.fieldType}-${value.order}`} model={TemplateModels.Template} 
                  changeFieldName={updateFieldName} deleteField={deleteField} reorderField={reorderField} data={value} />);
      case TemplateType.Number:
        return(<NumberValue key={`${value.fieldType}-${value.order}`} model={TemplateModels.Template}
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
  const [catalogName, setCatalogName] = useState('');
  const [catalogDescription, setCatalogDescription] = useState('');
  const [error, setError] = useState('');
  const [catalogFields, setCatalogFields] = useState([]);
  const [createCatalog] = useMutation(CREATE_CATALOG_AND_TEMPLATE);
  const navigate = useNavigate();

  const handleAddField = (option) => {
    let newField = {
      order: catalogFields.length,
      name: "",
      fieldType: option
    };
    setCatalogFields(current => [...current, newField]);
    // console.log (catalogFields);
  }

  const handleUpdateFields = (fields) => {
    setCatalogFields(() => [...fields]);
  }

  const printFields = () => {
    console.log (catalogFields);
  }

  const handleCreateCatalog = async(name, description, fields) => {
    const catalog = {
      name: name,
      description: description,
      isPrivate: false,
      userId: 'userId',
      templateIds: ['templateId']
    }
    const catalogTemplate = {
      name: name + " Template",
      allowNewFields: false,
      templateFields: fields
    }
    console.log(catalog);
    console.log(catalogTemplate);
    createCatalog({ 
      variables: { catalog: catalog, catalogTemplate: catalogTemplate },
      onCompleted(data) {
        navigate(`/${data.createCatalogAndTemplate.user.username}/${name}`);
      },
      onError(error) {
        setError(error.message);
      }
    });
  };

  return (
    <div className="createcatalog">
      <div className="createcatalog-info">
        <h3 className="title">Create new Katalog</h3>
        <input className="title createcatalog-name line-input" placeholder="Katalog Name" onChange={event => setCatalogName(event.target.value)}/>
        <textarea type="text" className="createcatalog-description" placeholder="Katalog Description" onChange={event => setCatalogDescription(event.target.value)}></textarea>
        <h3 className="title createcatalog-data" onClick={() => printFields(1)}>Katalog Template</h3>
        <div className="template-container">
          <h4 className="createcatalog-locked-field">Item Name &nbsp;<VscLock></VscLock></h4>
          <p className="createcatalog-locked-field-order"><VscLock></VscLock> &nbsp; #0 </p>
        </div>
        <TemplateFields fields={catalogFields} updateFields={handleUpdateFields}></TemplateFields>
        <span className="title template-data-selection-title">Select data type</span>
        <div className="template-options">
          <div className="template-option" onClick={() => handleAddField(1)}>
            <div className="template-option-icon">
              <GrTextAlignLeft></GrTextAlignLeft>
            </div>
            Add Text
          </div>
          <div className="template-option" onClick={() => handleAddField(2)}>
            <div className="template-option-icon">
              <TbNumbers></TbNumbers>
            </div>
            Add Number
          </div>
        </div>
        <span className="template-error-message">{error}</span>
        <div className="template-create-button">
          <button className="button create-button" onClick={() => handleCreateCatalog(catalogName, catalogDescription, catalogFields)}>Create Katalog</button>
        </div>
      </div>
    </div>
  );
}

export default CreateCatalog;