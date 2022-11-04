import { TemplateModels } from "../TemplateModels";
import "../ValuesTemplate.scss";
import "./ImageTemplate.scss";
import { VscLock } from "react-icons/vsc";
import TemplateActions from "../TemplateActions/TemplateActions"
import TemplateHeader from "../TemplateHeader/TemplateHeader"
import { AiFillDelete } from "react-icons/ai";
import { useState, useRef } from "react";

function ImageTemplate(props) {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : []);
  const inputFile = useRef(null);
  // const [imagePaths, setImagePaths] = useState([]);

  function addImage (event) {
    console.log(event);
    if (event.target.files.length === 0) return;
    let fileUrl = URL.createObjectURL(event.target.files[0]);
    // if (event.target.files[0].size > 512000) { //500KB
    if (event.target.files[0].size > 1024000) { //1MB
      event.target.value = null;
      alert ("Sorry, files should have less than 1MB");
      return;
    }
    event.target.value = null;
    getImageUrlData(fileUrl, function(dataUrl) {
      value.push({path: fileUrl, data: dataUrl});
      let imageData = [...value];
      setValue(imageData);
      // console.log(value);
      // uploadPicture({ 
      //   variables: { encodedFile: dataUrl},
      //   onCompleted(data) {
      //     setPicture(data.addUserPicture?.picture);
      //   },
      //   onError(error) {
      //     console.log(error);
      //   }
      // });
    })
  };

  function deleteImage (index) {
    let imageData = [...value];
    imageData.splice(index, 1);
    setValue(imageData);
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

  function images(value) {
    console.log(value);
    return value.map((image, index) => (
      <div key={`${image.path}`}>
        <AiFillDelete className="imagetemplate-delete" onClick={() => deleteImage(index)}/>
        <img src={image.path} alt="Item File" className="imagetemplate-image" />
      </div>
    ));
  }
  
  return (
    <div className="template-container">
      {
        (props.model === TemplateModels.Value || props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue) ?
          <div className="template-title">
            <span><strong>{props.data.name}</strong></span>
          </div>
        :
          <TemplateHeader data={props.data} 
            changeFieldName={props.changeFieldName} changeIsRequired={props.changeIsRequired} />
      }
      <div>
        {
          props.model === TemplateModels.Value ?
            <span>{props.data.stringValue}</span>
          : (props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue) ?
            // <input type="text" className="template-edit-data line-input" placeholder="Text data" 
            //   value={value} onChange={event => {setValue(event.target.value); props.changeFieldData(event.target.value, props.data.order)}}/>
            <div>
              <div>
                <input type="file" name="file" onChange={addImage} accept=".png" ref={inputFile} style={{display: 'none'}} />
                <button onClick={() => inputFile.current.click()}>Add Image</button>
              </div>
              <div className="imagetemplate-imagelist">
                {images(value)}
              </div>
            </div>
          :
            <div className="template-locked-value">
              <span>Image data <VscLock className="template-locked-icon"></VscLock></span>
            </div>
        }
      </div>
      {props.model === TemplateModels.Template ? 
        <TemplateActions order={props.data.order} 
          deleteField={props.deleteField} reorderField={props.reorderField}/>
        :
          <span></span>
      }
    </div>
  );
}
  
  export default ImageTemplate;