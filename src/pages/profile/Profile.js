import "./Profile.scss";
import { useQuery, gql } from '@apollo/client';
import CatalogCard from "../../components/catalogcard/CatalogCard";
import { useSelector } from "react-redux";
import {useParams} from "react-router-dom";
import logo from '../../assets/img/logo/logo_k.svg';
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const USER = gql`
  query GetUserByUsername {
    getUserByUsername {
      id,
      firstName,
      lastName,
      username
    }
  }
`;



function UserCatalogs() {
  const navigate = useNavigate();
  const {username} = useParams();
  const { loading, error, data } = useQuery(USER_CATALOGS, {
    variables: {username: username}
  }, 
  {fetchPolicy: 'network-only'});
  const { userLoading, userError, userData } = useQuery(USER, {fetchPolicy: 'network-only'});

  if (loading) return <p>Loading...</p>;
  if (error) {
    navigate("/notfound");
    return <p>Error :(</p>; 
  }

  return data.getCatalogsByUsername.map(({ id, name, description, user, isPrivate }) => (
    <CatalogCard key={id} catalogData={{name, description, user, isPrivate}}></CatalogCard>
  ));
}

function Profile() {
  const firstName = useSelector(state => state.user.firstName);
  const lastName = useSelector(state => state.user.lastName);
  const {username} = useParams();

  return (
    <div>
      <div className="profile-picture-container">
        <div className="profile-picture-background">
          {/* <img src={logo} className="profile-picture" alt="user"/> */}
          <FaUserAlt className="profile-picture"></FaUserAlt>
        </div>
      </div>
      <h1>{username}</h1>
      <h1>Katalogs</h1>
      <div className="catalogs-list">
        <UserCatalogs></UserCatalogs>
      </div>
    </div>
  );
}

export default Profile;