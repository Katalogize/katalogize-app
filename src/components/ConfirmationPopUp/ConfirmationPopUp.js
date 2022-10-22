import "./ConfirmationPopUp.scss";
import { AiOutlineClose } from "react-icons/ai";


function ConfirmationPopUp(props) {


  return (
    <div id="popup-confirmation">
      {props.showPopUp === true ?
      <div className="popup-background">
        <div className="popup-container">
          <div className="popup">
            <button className="popup-close-button" title="Close" onClick={() => props.close()}><AiOutlineClose /></button>
            <h1 className="title">{props.title}</h1>
            <p>{props.text}</p>
            <p className="critical-color popup-message">{props.errorMessage}</p>
            {props.isLoading === true ?
              <p className="popup-message">Loading...</p>
              :
              <button 
                className={`${props.isCriticalAction ? "button popup-action  popup-critical-action" : "button popup-action"}`}
                onClick={() => props.confirmed()}
                >{props.action}
              </button>
            }
          </div>
        </div>
      </div> 
      : null}
    </div>
  );
}
  
  export default ConfirmationPopUp;