import "./Home.scss";
import { useQuery, gql } from '@apollo/client';
import CatalogCard from "../../components/CatalogCard/CatalogCard";
import { useSelector } from "react-redux";
import {Link} from "react-router-dom";

const USER_CATALOGS = gql`
  query GetAllCatalogsByLoggedUser {
    getAllCatalogsByLoggedUser{
      id,
      name,
      description,
      isPrivate,
      user {
        id,
        displayName,
        username
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
      isPrivate,
      user {
        id,
        displayName,
        username
      }
    }
  }
`;


function UserCatalogs() {
  const { loading, error, data } = useQuery(USER_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogsByLoggedUser.map(({ id, name, description, user, isPrivate }) => (
    <CatalogCard key={id} catalogData={{name, description, user, isPrivate}}></CatalogCard>
  ));
}

function PublicCatalogs() {
  const { loading, error, data } = useQuery(PUBLIC_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogs.map(({ id, name, description, user, isPrivate }) => (
    <CatalogCard key={id} catalogData={{name, description, user, isPrivate}}></CatalogCard>
  ));
}

function Home() {
  const displayName = useSelector(state => state.user.displayName);

  return (
    <div className="home-body">
      <h1 className="title welcome-title title-list">Welcome, {displayName}</h1>
      <h1 className="title title-list">Your Katalogs</h1>
      <div className="catalogs-list">
        <div className="catalogcard-container">
          <Link to="/create-katalog" className="catalogcard catalogcard-create">
            <span>+ New Katalog</span>
          </Link>
        </div>
        <UserCatalogs></UserCatalogs>
      </div>
      <h1 className="title title-list">Public Katalogs</h1>
      <div className="catalogs-list">
        <PublicCatalogs></PublicCatalogs>
      </div>
    </div>
  );
}

export default Home;