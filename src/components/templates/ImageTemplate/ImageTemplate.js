import { TemplateModels } from "../TemplateModels";
import "../ValuesTemplate.scss";
import "./ImageTemplate.scss";
import { IoImagesOutline } from "react-icons/io5";
import TemplateActions from "../TemplateActions/TemplateActions"
import TemplateHeader from "../TemplateHeader/TemplateHeader"
import { AiFillDelete } from "react-icons/ai";
import { useState, useRef } from "react";
import { GCS_API } from "../../../utils/constants";


function ImageTemplate(props) {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : []);
  const inputFile = useRef(null);
  // const [imagePaths, setImagePaths] = useState([]);

  function updateData (data) {
    let updatedData = [];
    data.forEach((el) => {
      updatedData.push({data: el.data ? el.data : null, path: el.path ? el.path : null});
    });
    props.changeFieldData(updatedData, props.data.order);
  }

  function addImage (event) {
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
      value.push({localPath: fileUrl, data: dataUrl});
      let imageData = [...value];
      setValue(imageData);
      updateData([...imageData]);
    })
  };

  function deleteImage (index) {
    let imageData = [...value];
    imageData.splice(index, 1);
    setValue(imageData);
    props.changeFieldData(imageData, props.data.order);
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

  function images(model) {
    return value.map((image, index) => (
      <div key={`${image.localPath ? image.localPath : image.path}`}>
        { model === TemplateModels.CreateValue 
          ? <AiFillDelete className="imagetemplate-delete" onClick={() => deleteImage(index)}/> 
          : null
        }
        <img src={image.localPath ? image.localPath : GCS_API + image.path} alt="Item File" className="imagetemplate-image" />
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
          <div className="imagetemplate-imagelist">
            {images(TemplateModels.Value)}
          </div>
          : (props.model === TemplateModels.EditValue || props.model === TemplateModels.CreateValue) ?
            // <input type="text" className="template-edit-data line-input" placeholder="Text data" 
            //   value={value} onChange={event => {setValue(event.target.value); props.changeFieldData(event.target.value, props.data.order)}}/>
            <div>
              <div>
                <input type="file" name="file" onChange={addImage} accept=".png" ref={inputFile} style={{display: 'none'}} />
                <button onClick={() => inputFile.current.click()}>Add Image</button>
              </div>
              <div className="imagetemplate-imagelist">
                {images(TemplateModels.CreateValue)}
              </div>
            </div>
          :
            <div className="template-locked-value" title="This will be an available field for all items in this Katalog">
              <span>Image field &nbsp; <IoImagesOutline className="template-locked-icon" /></span>
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