import "./Home.scss";
import { useQuery, gql } from '@apollo/client';
import Catalog from "../../components/catalog/Catalog";
import { useSelector } from "react-redux";

const USER_CATALOGS = gql`
  query GetAllCatalogsByLoggedUser {
    getAllCatalogsByLoggedUser{
      id,
      name,
      description,
      user {
        id,
        firstName,
        lastName
      }
    }
  }
`;

const PUBLIC_CATALOGS = gql`
  query GetAllCatalogs {
    getAllCatalogs {
      id,
      name,
      description,
      user {
        id,
        firstName,
        lastName
      }
    }
  }
`;


function UserCatalogs() {
  const { loading, error, data } = useQuery(USER_CATALOGS, {fetchPolicy: 'network-only'});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogsByLoggedUser.map(({ id, name, description, user }) => (
    <Catalog key={id} catalogData={{name, description, user}}></Catalog>
  ));
}

function PublicCatalogs() {
  const { loading, error, data } = useQuery(PUBLIC_CATALOGS, {fetchPolicy: 'network-only'});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogs.map(({ id, name, description, user }) => (
    <Catalog key={id} catalogData={{name, description, user}}></Catalog>
  ));
}

function Home() {
  const firstName = useSelector(state => state.user.firstName);
  const lastName = useSelector(state => state.user.lastName);

  return (
    <div>
      <h1>Welcome {firstName} {lastName}</h1>
      <h1>Your Katalogs</h1>
      <div className="home-catalogs-list">
        <UserCatalogs></UserCatalogs>
      </div>
      <h1>Public Katalogs</h1>
      <div className="home-catalogs-list">
        <PublicCatalogs></PublicCatalogs>
      </div>
    </div>
  );
}

export default Home;