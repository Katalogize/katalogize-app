import "./Catalog.scss";
import { useQuery, gql } from '@apollo/client';
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CATALOG = gql`
  query GetCatalogByUsernameAndCatalogName ($username: String!, $catalogName: String!){
    getCatalogByUsernameAndCatalogName (username: $username, catalogName: $catalogName) {
      id,
      name,
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


function Items() {
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();
  const { loading, error, data } = useQuery(CATALOG, {
    variables: {username: username, catalogName: catalogname}
  }, 
  {fetchPolicy: 'network-only'});

  if (loading) return <tr><td key="loading">Loading...</td></tr>;
  if (error) navigate("/notfound");

  return data.getCatalogByUsernameAndCatalogName.items.map(({ id, name }) => (
    <tr key={id}>
      <td>{name}</td>
      <td>{id}</td>
    </tr>
  ));
}

function Catalog() {
  const {username} = useParams();
  const {catalogname} = useParams();

  return (
    <div className="catalog">
      <h1>{catalogname}</h1>
      <h1>{username}</h1>
      <div className="catalog-table-container">
        <table className="catalog-table">
          <thead>
            <tr>
              <th className="catalog-table-name">Name</th>
              <th className="catalog-table-id">ID</th>
            </tr>
          </thead>
          <tbody>
            <Items></Items>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Catalog;