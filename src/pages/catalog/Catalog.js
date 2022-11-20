import "./Catalog.scss";
import { useQuery, useMutation, gql } from '@apollo/client';
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiUser3Fill } from "react-icons/ri";
import { BsShare } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { BsHouseDoor } from "react-icons/bs";
import { BiAddToQueue } from "react-icons/bi"
import { AiOutlineDelete } from "react-icons/ai"
import { IoPersonRemoveOutline } from "react-icons/io5"
import ConfirmationPopUp from "../../components/ConfirmationPopUp/ConfirmationPopUp";
import { useState } from "react";
import { GCS_API } from "../../utils/constants";
import logo_k from '../../assets/img/logo/logo_k.svg';
import ReactTooltip from 'react-tooltip';
import { toastInfo, toastLoading, toastUpdateError, toastUpdateSuccess } from "../../utils/ToastService";
import SharePopUp from "../../components/SharePopUp/SharePopUp";

const CATALOG = gql`
  query GetCatalogByUsernameAndCatalogName ($username: String!, $catalogName: String!){
    getCatalogByUsernameAndCatalogName (username: $username, catalogName: $catalogName) {
      id,
      name,
      description,
      generalPermission,
      userPermission,
      isShared,
      user {
          id,
          username
      }
      items{
          id,
          name,
          modifiedDate,
          fields {
            ... on ItemFieldImage {
              imageValue: value {
                path
              }
            }
          }
      }
    }
  }
`;

const DELETE_CATALOG = gql`
  mutation DeleteCatalog($id: ID!) {
    deleteCatalog (id: $id) {
      id
    }
  }
`;

const LEAVE_CATALOG = gql`
  mutation LeaveCatalog($catalogId: ID!) {
    leaveCatalog (catalogId: $catalogId)
  }
`;

function Items(props) {
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();
  
  const handleRowClick = (name) => {
    navigate(`/${username}/${catalogname}/${name}`);
  } 


  return props.items.map(({ id, name, modifiedDate, fields }) => {
    let imageValue = fields.find(field => field?.imageValue !== undefined && field?.imageValue !== null)?.imageValue;
    return(
      <tr key={id} onClick={()=> handleRowClick(name)}>
        {imageValue 
          ? imageValue[0]
            ? <td><img src={GCS_API + imageValue[0].path} alt="Item File" className="catalog-table-image" /></td> 
            : <td><div className="catalog-table-image catalog-table-default"><img className="catalog-table-image-default" alt="logo" src={logo_k} /></div></td>
          : null 
        }
        <td colSpan={2}>{name}</td>
        <td className="catalog-table-last">
          {new Date(modifiedDate).getUTCFullYear()+'/'+new Date(modifiedDate).getUTCMonth()+'/'+new Date(modifiedDate).getUTCDate()+
            ' - ' + new Date(modifiedDate).getUTCHours() +':'+new Date(modifiedDate).getUTCMinutes() +' UTC'}
        </td>
        {/* <td>{id}</td> */}
    </tr>
    )
  });
}

function Catalog() {
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();

  const [showSharePopUp, setShowSharePopUp] = useState(false);

  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteCatalog] = useMutation(DELETE_CATALOG);

  const [showLeavePopUp, setShowLeavePopUp] = useState(false);
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [leaveCatalog] = useMutation(LEAVE_CATALOG);
  
  const { loading, error, data } = useQuery(CATALOG, {
    variables: {username: username, catalogName: catalogname}
  });

  if (loading) return <span key="loading">Loading...</span>;
  if (error) navigate("/notfound");

  const handleDeleteCatalog = async() => {
    setIsDeleteLoading(true);
    const id = toastLoading("Deleting Katalog...");
    deleteCatalog({ 
      variables: { id: data.getCatalogByUsernameAndCatalogName.id },
      onCompleted(data) {
        toastUpdateSuccess(id, "Katalog Deleted!");
        setIsDeleteLoading(false);
        setShowDeletePopUp(false);
        navigate(`/home`);
      },
      onError(error) {
        toastUpdateError(id, "Error while deleting Katalog. " + error.message);
        setIsDeleteLoading(false);
        setDeleteError(error.message);
      }
    });
  };

  const handleLeaveCatalog = async() => {
    setIsLeaveLoading(true);
    const id = toastLoading("Leaving Katalog...");
    leaveCatalog({ 
      variables: { catalogId: data.getCatalogByUsernameAndCatalogName.id },
      onCompleted(data) {
        toastUpdateSuccess(id, "Katalog Left!");
        setIsLeaveLoading(false);
        setShowLeavePopUp(false);
        navigate(`/home`);
      },
      onError(error) {
        toastUpdateError(id, "Error while leaving Katalog. " + error.message);
        setIsLeaveLoading(false);
        setLeaveError(error.message);
      }
    });
  };

  const updateGeneralPermission = (value) => {
    data.getCatalogByUsernameAndCatalogName.generalPermission = value;
  };

  return (
    <div className="catalog">
      <ConfirmationPopUp 
        title="Delete Katalog" 
        text="All items created will be lost forever. Are you sure you want to delete this Katalog? " 
        isLoading={isDeleteLoading}
        errorMessage={deleteError}
        action="Delete Katalog" isCriticalAction={true} showPopUp={showDeletePopUp} 
        confirmed={() => {handleDeleteCatalog()}}
        close={() => {setShowDeletePopUp(false); setDeleteError("")}}
      />
      <ConfirmationPopUp 
        title="Leave Katalog" 
        text="By leaving this Katalog, you will lose direct access and specific permissions assigned to your user. Are you sure you want to leave this Katalog? " 
        isLoading={isLeaveLoading}
        errorMessage={leaveError}
        action="Leave Katalog" isCriticalAction={true} showPopUp={showLeavePopUp} 
        confirmed={() => {handleLeaveCatalog()}}
        close={() => {setShowLeavePopUp(false); setLeaveError("")}}
      />
      {data.getCatalogByUsernameAndCatalogName.userPermission === 3 
      ? <SharePopUp 
          showPopUp={showSharePopUp} 
          catalogId={data.getCatalogByUsernameAndCatalogName.id} 
          generalPermission={data.getCatalogByUsernameAndCatalogName.generalPermission}
          updateGeneralPermission={updateGeneralPermission}
          close={() => {setShowSharePopUp(false)}}
        />
      : null }
      <div className="breadcrumbs">
        <Link to={`/`}><BsHouseDoor /></Link>
        <span>{' > '}</span>
        <Link to={`/${username}`}>{username}</Link>
        <span>{' > '}</span>
        <span>{catalogname}</span>
      </div>
      <div className="catalog-header">
        <h1 className="title catalog-name">{catalogname}</h1>
        <div className="catalog-actions-container">
          <div className="catalog-actions">
            {data.getCatalogByUsernameAndCatalogName.userPermission >= 2 ? <BiAddToQueue className="catalog-actions-item remove-outline" data-tip="Create new item" onClick={() => {navigate(`/${username}/${catalogname}/create-item`)}} /> : null}
            <MdContentCopy className="catalog-actions-item remove-outline" data-tip="Copy Link" onClick={() => {navigator.clipboard.writeText(window.location); toastInfo("Link Copied!");}} />
            {data.getCatalogByUsernameAndCatalogName.userPermission === 3 ?<BsShare className="catalog-actions-item remove-outline" data-tip="Share Katalog" onClick={() => {setShowSharePopUp(true)}} /> : null}
            {/* <HiOutlinePencil className="catalog-actions-item" title="Edit"></HiOutlinePencil> */}
            {data.getCatalogByUsernameAndCatalogName.userPermission === 3 ? <AiOutlineDelete className="catalog-actions-item catalog-actions-delete remove-outline" data-tip="Delete Katalog" onClick={() => setShowDeletePopUp(true)} /> : null}
            {data.getCatalogByUsernameAndCatalogName.isShared === true ? <IoPersonRemoveOutline className="catalog-actions-item catalog-actions-delete remove-outline" data-tip="Leave Katalog" onClick={() => setShowLeavePopUp(true)} /> : null}
            <ReactTooltip place="bottom" effect="solid" />
          </div>
        </div>
      </div>
      <div className="catalog-description">
        <span>{data.getCatalogByUsernameAndCatalogName?.description}</span>
      </div>
      <div className="info-tags">
        <Link to={`/${username}`} className="info-tags">
          <RiUser3Fill className="info-tags-icon" alt="user"/>
          <span>{username}</span>
        </Link>
        {data.getCatalogByUsernameAndCatalogName.generalPermission === 2
          ? <div><RiUser3Fill /> Public View</div>
          : data.getCatalogByUsernameAndCatalogName.generalPermission === 1
        }
      </div>
      <div className="catalog-table-container">
        <table className="catalog-table">
          <thead>
            <tr>
              {data.getCatalogByUsernameAndCatalogName?.items[0]?.fields.find(field => field?.imageValue)?.imageValue ? <th>Image</th> : null}
              <th colSpan={2} className="catalog-table-name">Name</th>
              <th className="catalog-table-date">Last Modified At</th>
            </tr>
          </thead>
          <tbody>
            <Items items={data.getCatalogByUsernameAndCatalogName?.items}></Items>
            {data.getCatalogByUsernameAndCatalogName?.items.length === 0 ? <tr><td colSpan={2}>No items created yet.</td><td></td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Catalog;