import "./SharePopUp.scss";
import { AiOutlineClose } from "react-icons/ai";


function SharePopUp(props) {

  const userPermissions = {permissions: [{email: "thisisnormalemail@gmail.com", permission: 2}, {email: "test42@gmail.com", permission: 1}, {email: "test2@gmail.com", permission: 1}]}

  function handleChangeGeneralPermission(permission) {
    console.log(permission);
  }

  function handleChangePermission(email, permission) {
    console.log(email + " " + permission);
  }

  function sharedUsers() {
    return userPermissions.permissions.map(({ email, permission }) => (
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
            <div style={{display: "flex", alignItems: "center", marginBottom: 25}}>
              <input placeholder="Add new user email" style={{padding: 5, width: "100%"}} />&nbsp;
              
              <button className="popup-action button" onClick={() => props.confirmed()} style={{padding: 5, borderRadius: 2}}>Add</button>
            </div>
            <div className="share-users-container">
              <div className="share-user">
                <div style={{width: "100%"}}>Anyone with the link &nbsp;</div>
                <div style={{display: "flex"}}>
                  <select onChange={event => handleChangeGeneralPermission(event.target.value)} style={{padding: 5}} defaultValue="1">
                    <option value="1">Can View</option>
                    <option value="2">Can Edit</option>
                    <option value="0">No Access</option>
                  </select>
                </div>
              </div>
              {sharedUsers()}
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