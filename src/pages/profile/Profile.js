import "./Profile.scss";
import { useQuery, useMutation, gql } from '@apollo/client';
import CatalogCard from "../../components/CatalogCard/CatalogCard";
import {useParams} from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { useRef, useState } from "react";
import { GCS_API } from "../../utils/constants";
import { toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";
import { updatePicture } from "../../store/userSlice";

const USER_CATALOGS = gql`
  query GetCatalogsByUsername($username: String!) {
    getCatalogsByUsername (username: $username) {
      id,
      name,
      description,
      isPrivate,
      user {
        id,
        displayName
        username
      }
    }
  }
`;

const USER = gql`
  query GetUserByUsername($username: String!){
    getUserByUsername (username: $username) {
      id,
      displayName,
      username,
      picture,
      description
    }
  }
`;

const UPLOAD_PICTURE = gql`
  mutation AddUserPicture($encodedFile: String) {
    addUserPicture (encodedFile: $encodedFile) {
      picture
    }
  }
`;

const DELETE_PICTURE = gql`
  mutation DeleteUserPicture {
    deleteUserPicture {
      picture
    }
  }
`;


function UserCatalogs() {
  const navigate = useNavigate();
  const {username} = useParams();
  const loggedUsername = useSelector(state => state.user.username);
  const { loading, error, data } = useQuery(USER_CATALOGS, {
    variables: {username: username}
  }, 
  {fetchPolicy: 'network-only'});

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
  const {username} = useParams();
  const loggedUsername = useSelector(state => state.user.username);
  const { loading, error, data } = useQuery(USER, {
    variables: {username: username}
  }, 
  {fetchPolicy: 'network-only'});



  const navigate = useNavigate();
  const inputFile = useRef(null) ;
  const [uploadPicture] = useMutation(UPLOAD_PICTURE);
  const [deletePicture] = useMutation(DELETE_PICTURE);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const dispatch = useDispatch();

  const removePicture = () => {
    const id = toastLoading("Removing picture...");
    deletePicture({
      onCompleted(data) {
        toastUpdateSuccess(id, "Picture removed!");
        console.log(data);
        setPicture(null);
      },
      onError(error) {
        toastUpdateError(id, "Error on removing picture, please try again.");
        console.log(error);
      }
    });
  };

  const changePicture = (event) => {
    let fileUrl = URL.createObjectURL(event.target.files[0]);
    const id = toastLoading("Uploading picture...");
    getImageUrlData(fileUrl, function(dataUrl) {
      uploadPicture({ 
        variables: { encodedFile: dataUrl},
        onCompleted(data) {
          toastUpdateSuccess(id, "Picture updated!");
          setPicture(data.addUserPicture?.picture);
        },
        onError(error) {
          toastUpdateError(id, "Error on upload, please try again.");
          console.log(error);
        }
      });
    })
  };

  function getImageUrlData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  if (loading) return <span>Loading...</span>
  if (error) navigate("/notfound");

  function setPicture(relativePath) {
    console.log(relativePath);
    dispatch(updatePicture({picture: relativePath}))
    if (relativePath) {
      setProfilePicture(GCS_API + relativePath);
    } else {
      setProfilePicture(null);
    }
  }

  if (profilePicture === null && data.getUserByUsername?.picture !== null && isUserLoaded === false) {
    setIsUserLoaded(true);
    setPicture(data.getUserByUsername?.picture);
  }
  return (
    <div>
      <div className="profile-picture-container">
        <div className="profile-picture-background">
          {loggedUsername === data.getUserByUsername?.username 
          ?<div className="profile-picture-actions">
            <input type="file" name="file" ref={inputFile} style={{display: 'none'}} onChange={changePicture} accept=".png, .jpg, .jpeg" />
            <button className="profile-picture-action" onClick={() => inputFile.current.click()}>Change Picture</button>
            <HiOutlinePencil title="Edit"></HiOutlinePencil>
            <button className="profile-picture-action" onClick={removePicture}>Remove Picture</button>
          </div>
          :null
          }
          {profilePicture !== null 
          ?<img src={profilePicture} className="profile-picture" alt="user"/>
          :<FaUserAlt className="profile-picture-default"></FaUserAlt>
          }
        </div>
      </div>
      <h1 className="title profile-username">{data.getUserByUsername?.displayName}</h1>
      <h4>@{data.getUserByUsername?.username}</h4>
      <UserCatalogs></UserCatalogs>
    </div>
  );
}

export default Profile;