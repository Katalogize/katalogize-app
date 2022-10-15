import "./CatalogItem.scss";
import { useQuery, gql } from '@apollo/client';
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo_k from '../../assets/img/logo/logo_k.svg';
import { RiUser3Fill } from "react-icons/ri";
import DescriptionValue from "../../components/templates/DescriptionTemplate/DescriptionTemplate";
import NumberValue from "../../components/templates/NumberTemplate/NumberTemplate";
import { TemplateModels, TemplateTypeName } from "../../components/templates/TemplateModels";

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
        templateType: __typename
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

function ItemValues (props) {
  const value = (value) => {
    switch (value.templateType) {
      case TemplateTypeName.Description:
        return(<DescriptionValue key={value.name} data={value} model={TemplateModels.Value}></DescriptionValue>);
      case TemplateTypeName.Number:
        return(<NumberValue key={value.name} data={value} model={TemplateModels.Value}></NumberValue>);
      default:
        break;
    }
  }

  return props.itemValues.map(field => (
    value(field)
  ));
}

function CatalogItem() {
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();
  const {itemname} = useParams();
  const { loading, error, data } = useQuery(CATALOG_ITEM, {
    variables: {username: username, catalogName: catalogname, itemName: itemname}
  },
  {fetchPolicy: 'network-only'});

  if (loading) return <span>Loading...</span>;
  if (error) navigate("/notfound");

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
      <h1 className="title">{itemname}</h1>
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
      <ItemValues itemValues={data.getCatalogItem.fields}></ItemValues>
    </div>
  );
}

export default CatalogItem;