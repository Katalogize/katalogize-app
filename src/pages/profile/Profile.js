import "./Profile.scss";
import { useQuery, gql } from '@apollo/client';
import CatalogCard from "../../components/CatalogCard/CatalogCard";
import {useParams} from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const USER_CATALOGS = gql`
  query GetCatalogsByUsername($username: String!) {
    getCatalogsByUsername (username: $username) {
      id,
      name,
      description,
      isPrivate,
      user {
        id,
        firstName,
        lastName,
        username
      }
    }
  }
`;

// const USER = gql`
//   query GetUserByUsername {
//     getUserByUsername {
//       id,
//       firstName,
//       lastName,
//       username
//     }
//   }
// `;



function UserCatalogs() {
  const navigate = useNavigate();
  const {username} = useParams();
  const loggedUsername = useSelector(state => state.user.username);
  const { loading, error, data } = useQuery(USER_CATALOGS, {
    variables: {username: username}
  }, 
  {fetchPolicy: 'network-only'});
  // const { userLoading, userError, userData } = useQuery(USER, {fetchPolicy: 'network-only'});

  if (loading) return <p>Loading...</p>;
  if (error) {
    navigate("/notfound");
    return <p>Error :(</p>; 
  }

  return <div>
    <h2 className="title title-list">{data.getCatalogsByUsername.length>0 ? 'Katalogs' : ''}</h2>
    {data.getCatalogsByUsername.length===0 ? 
      <div>
      <span>No Katalogs created yet!</span>
      {username === loggedUsername ? 
        <div className="catalogcard-container">
          <Link to="/create-katalog" className="catalogcard catalogcard-create">
            <span>+ New Katalog</span>
          </Link>
        </div>
        : <span></span>
      }
      </div>
      :
      <div className="catalogs-list">
        {username === loggedUsername ? 
          <div className="catalogcard-container">
            <Link to="/create-katalog" className="catalogcard catalogcard-create">
              <span>+ New Katalog</span>
            </Link>
          </div>
          : <span style={{display: 'none'}}></span>
        }
        {data.getCatalogsByUsername.map(({ id, name, description, user, isPrivate }) => (
          <CatalogCard key={id} catalogData={{name, description, user, isPrivate}}></CatalogCard>
        ))}
      </div>
    }
  </div>
}

function Profile() {
  // const firstName = useSelector(state => state.user.firstName);
  // const lastName = useSelector(state => state.user.lastName);
  const {username} = useParams();

  return (
    <div>
      <div className="profile-picture-container">
        <div className="profile-picture-background">
          {/* <img src={logo} className="profile-picture" alt="user"/> */}
          <FaUserAlt className="profile-picture"></FaUserAlt>
        </div>
      </div>
      <h1 className="title profile-username">{username}</h1>
      <UserCatalogs></UserCatalogs>
    </div>
  );
}

export default Profile;