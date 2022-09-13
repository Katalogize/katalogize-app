import "./Home.scss";
import { useQuery, gql } from '@apollo/client';
import Catalog from "../../components/catalog/Catalog";

const USER_CATALOGS = gql`
  query GetAllCatalogsByLoggedUser {
    getAllCatalogsByLoggedUser{
      name,
      description,
      user {
        firstName,
        lastName
      }
    }
  }
`;

const PUBLIC_CATALOGS = gql`
  query GetAllCatalogs {
    getAllCatalogs {
      name,
      description,
      user {
        firstName,
        lastName
      }
    }
  }
`;


function UserCatalogs() {
  const { loading, error, data } = useQuery(USER_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogsByLoggedUser.map(({ id, name, description }) => (
    <Catalog key={id} catalogData={{name, description}}></Catalog>
  ));
}

function PublicCatalogs() {
  const { loading, error, data } = useQuery(PUBLIC_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogs.map(({ id, name, description }) => (
    <Catalog key={id} catalogData={{name, description}}></Catalog>
  ));
}

function Home() {
  return (
    <div>
      <h1>Your Katalogs</h1>
      <UserCatalogs></UserCatalogs>
      <h1>Public Katalogs</h1>
      <PublicCatalogs></PublicCatalogs>
    </div>
  );
}

export default Home;