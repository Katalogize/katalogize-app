import "./CreateCatalog.scss";
import {useState} from 'react';
import { GrTextAlignLeft } from "react-icons/gr";
import { TbNumbers } from "react-icons/tb";


function CreateCatalog() {
  const [catalogName, setCatalogName] = useState('Untitled Katalog');

  return (
    <div className="createcatalog">
      <div className="createcatalog-info">
        <h3 className="title">Create new Katalog</h3>
        <input className="title createcatalog-name line-input" value={catalogName} onChange={event => setCatalogName(event.target.value)}/>
        <textarea type="text" className="createcatalog-description" placeholder="Katalog Description"></textarea>
        <h3 className="title createcatalog-data">Katalog Template</h3>
        <div className="template-options">
          <div className="template-option">
            <div className="template-option-icon">
              <GrTextAlignLeft></GrTextAlignLeft>
            </div>
            Add Text
          </div>
          <div className="template-option">
            <div className="template-option-icon">
              <TbNumbers></TbNumbers>
            </div>
            Add Number
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCatalog;