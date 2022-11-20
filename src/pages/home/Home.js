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
      generalPermission,
      user {
        id,
        displayName,
        username
      }
    }
  }
`;

const SHARED_CATALOGS = gql`
  query GetSharedCatalogsByLoggedUser {
    getSharedCatalogsByLoggedUser{
      id,
      name,
      description,
      generalPermission,
      user {
        id,
        displayName,
        username
      }
    }
  }
`;

const OFFICIAL_CATALOGS = gql`
  query GetOfficialCatalogs {
    getOfficialCatalogs {
      id,
      name,
      description,
      generalPermission,
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
      generalPermission,
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

  if (loading) return <p style={{alignSelf: 'center'}}>Loading...</p>;
  if (error) return <p style={{alignSelf: 'center'}}>Could not load Katalogs.</p>;

  return data.getAllCatalogsByLoggedUser.map(({ id, name, description, user, generalPermission }) => (
    <CatalogCard key={id} catalogData={{name, description, user, generalPermission}}></CatalogCard>
  ));
}

function SharedCatalogs() {
  const { loading, error, data } = useQuery(SHARED_CATALOGS);

  if (loading) return null;
  if (error) return <p style={{alignSelf: 'center'}}>Could not load shared Katalogs.</p>;
  if (data.getSharedCatalogsByLoggedUser.length === 0) return null;

  return (
    <div>
      <h1 className="title title-list">Shared with you</h1>
      <div className="catalogs-list">
        {data.getSharedCatalogsByLoggedUser.map(({ id, name, description, user, generalPermission }) => (
          <CatalogCard key={id} catalogData={{name, description, user, generalPermission}}></CatalogCard>
        ))}
      </div>
    </div>
  );
}

function OfficialCatalogs() {
  const { loading, error, data } = useQuery(OFFICIAL_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{whiteSpace: "nowrap", margin: 20}}>Could not load Katalogs, please come back later.</p>;

  return data.getOfficialCatalogs.map(({ id, name, description, user }) => (
    <CatalogCard key={id} catalogData={{name, description, user }}></CatalogCard>
  ));
}

function PublicCatalogs() {
  const { loading, error, data } = useQuery(PUBLIC_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogs.map(({ id, name, description, user, generalPermission }) => (
    <CatalogCard key={id} catalogData={{name, description, user, generalPermission }}></CatalogCard>
  ));
}

function Home() {
  const displayName = useSelector(state => state.user.displayName);
  const isAdmin = useSelector(state => state.user.isAdmin);

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
        <UserCatalogs />
      </div>
      <SharedCatalogs />
      <h1 className="title title-list">Official Katalogs</h1>
      <div className="catalogs-list">
        <OfficialCatalogs />
      </div>
      {isAdmin 
        ?<div>
          <h1 className="title title-list" style={{marginBottom: 0}}>All Katalogs</h1>
          <p className="title title-list" style={{marginTop: 0}}>Admin Only</p>
          <div className="catalogs-list">
            <PublicCatalogs />
          </div>
        </div>
        : null
      }
    </div>
  );
}

export default Home;