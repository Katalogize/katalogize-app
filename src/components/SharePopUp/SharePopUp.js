import "./SharePopUp.scss";
import { AiOutlineClose } from "react-icons/ai";
import { useQuery, useMutation, gql } from '@apollo/client';
import { toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";
import { useState } from "react";

const UPDATE_GENERAL_PERMISSION = gql`
  mutation UpdateCatalogGeneralPermission($catalogId: ID!, $permission: Int!) {
    updateCatalogGeneralPermission (catalogId: $catalogId, permission: $permission) {
      id
    }
  }
`;

const SHARE_CATALOG = gql`
  mutation ShareCatalog($catalogId: ID!, $email: String!, $permission: Int!) {
    shareCatalog (catalogId: $catalogId, email: $email, permission: $permission) {
      email,
      permission
    }
  }
`;

const GET_PERMISSIONS = gql`
  query GetCatalogPermissions ($catalogId: ID!){
    getCatalogPermissions (catalogId: $catalogId) {
      email,
      permission
    }
  }
`;


function SharePopUp(props) {

  const [updateGeneralPermission] = useMutation(UPDATE_GENERAL_PERMISSION);
  const [shareCatalog] = useMutation(SHARE_CATALOG);
  const [permissions, setPermissions] = useState({});
  const [userEmail, setUserEmail] = useState("");
  // const userPermissions = {permissions: [{email: "thisisnormalemail@gmail.com", permission: 2}, {email: "test42@gmail.com", permission: 1}, {email: "test2@gmail.com", permission: 1}]}

  const { loading, error } = useQuery(GET_PERMISSIONS, {
    variables: {catalogId: props.catalogId},
    onCompleted (data) {
      setPermissions(data.getCatalogPermissions);
    }
  });

  function handleChangeGeneralPermission(permission) {
    console.log(props.catalogId);
    const id = toastLoading("Updating permissions...");
    updateGeneralPermission({ 
      variables: { catalogId: props.catalogId, permission: permission },
      onCompleted(data) {
        toastUpdateSuccess(id, "Permission updated!");
        props.updateGeneralPermission(permission);
      },
      onError(error) {
        toastUpdateError(id, "Error while updating permission. " + error.message);
      }
    });
  }

  function handleChangePermission(email, permission) {
    console.log(email + " " + permission);
    const id = toastLoading("Updating permissions...");
    shareCatalog({ 
      variables: { catalogId: props.catalogId, email: email, permission: permission },
      onCompleted(data) {
        setPermissions(data.shareCatalog);
        toastUpdateSuccess(id, "Permission updated!");
      },
      onError(error) {
        toastUpdateError(id, "Error while updating permission. " + error.message);
      }
    });
  }

  function sharedUsers() {
    if (loading) return <span>Loading... </span>
    if (error) return <span>Error while retrieving permission... </span>
    if (permissions.length === 0) return <div style={{fontSize: 14, opacity: 0.8}}>Not shared yet.</div>
    return permissions?.map(({ email, permission }) => (
      <div key={`permission-${email}`} className="share-user">
        <div className="share-user-email">{email} &nbsp;</div>
        <div style={{display: "flex"}}>
          <select onChange={event => handleChangePermission(email, event.target.value)} style={{padding: 5}} defaultValue={permission}>
            <option value="1">Can View</option>
            <option value="2">Can Edit</option>
            <option value="0">Remove</option>
          </select>
        </div>
      </div>
    ));
  }
  
  return (
    <div id="popup">
      {props.showPopUp === true ?
      <div className="popup-background">
        <div className="popup-container">
          <div className="popup-info">
            <button className="popup-close-button" title="Close" onClick={() => props.close()}><AiOutlineClose /></button>
            <h1 className="title" style={{marginBottom: 0}}>Share Katalog</h1>
            <div style={{marginBottom: 25, fontSize: 14, opacity: 0.8}}>Only Katalog owners can share.</div>
            <p>{props.text}</p>
            
            <div className="share-users-container">
              <div className="share-user">
                <div style={{width: "100%"}}>Anyone with the link &nbsp;</div>
                <div style={{display: "flex"}}>
                  <select onChange={event => handleChangeGeneralPermission(event.target.value)} style={{padding: 5}} defaultValue={props.generalPermission}>
                    <option value="1">Can View</option>
                    <option value="2">Can Edit</option>
                    <option value="0">No Access</option>
                  </select>
                </div>
              </div>
              <h5 style={{marginBottom: 14}}>Katalog Shared With</h5>
              {sharedUsers()}
            </div>
            <div style={{display: "flex", alignItems: "center", marginTop: 12}}>
              <input placeholder="Add new user email" style={{padding: 5, width: "100%"}} value={userEmail} onChange={e => setUserEmail(e.target.value)} />&nbsp;
              
              <button className="popup-action button" onClick={() => handleChangePermission(userEmail, 1)} style={{padding: 5, borderRadius: 2}}>Add</button>
            </div>
            <p className="critical-color popup-message">{props.errorMessage}</p>
            {/* {props.isLoading === true ?
              <p className="popup-message">Loading...</p>
              :
              <button className="button popup-action" onClick={() => props.confirmed()}>Save</button>
            } */}
          </div>
        </div>
      </div> 
      : null}
    </div>
  );
}
  
  export default SharePopUp;