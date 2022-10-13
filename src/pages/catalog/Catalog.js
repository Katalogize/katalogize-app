import "./Catalog.scss";
import { useQuery, gql } from '@apollo/client';
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiUser3Fill } from "react-icons/ri";

const CATALOG = gql`
  query GetCatalogByUsernameAndCatalogName ($username: String!, $catalogName: String!){
    getCatalogByUsernameAndCatalogName (username: $username, catalogName: $catalogName) {
      id,
      name,
      description,
      isPrivate,
      user {
          id,
          username
      }
      items{
          id,
          name
      }
    }
  }
`;


function Items(props) {
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();
  
  const handleRowClick = (name) => {
    navigate(`/${username}/${catalogname}/${name}`);
  } 

  return props.items.map(({ id, name }) => (
    <tr key={id} onClick={()=> handleRowClick(name)}>
        <td>{name}</td>
        <td>{id}</td>
    </tr>
  ));
}

function Catalog() {
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();
  const { loading, error, data } = useQuery(CATALOG, {
    variables: {username: username, catalogName: catalogname}
  }, 
  {fetchPolicy: 'network-only'});

  if (loading) return <span key="loading">Loading...</span>;
  if (error) navigate("/notfound");

  return (
    <div className="catalog">
      {/* <div className="breadcrumbs">
        <Link to={`/`}>Home</Link>
        <span>{' > '}</span>
        <Link to={`/${username}`}>{username}</Link>
        <span>{' > '}</span>
        <span>{catalogname}</span>
      </div> */}
      <h1 className="title">{catalogname}</h1>
      <div className="catalog-description">
        <span>{data.getCatalogByUsernameAndCatalogName?.description}</span>
      </div>
      <div className="info-tags">
        <Link to={`/${username}`} className="info-tags">
          <RiUser3Fill className="info-tags-icon" alt="user"/>
          <span>{username}</span>
        </Link>
      </div>
      <div className="catalog-table-container">
        <table className="catalog-table">
          <thead>
            <tr>
              <th className="catalog-table-name">Name</th>
              <th className="catalog-table-id">ID</th>
            </tr>
          </thead>
          <tbody>
            <Items items={data.getCatalogByUsernameAndCatalogName?.items}></Items>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Catalog;