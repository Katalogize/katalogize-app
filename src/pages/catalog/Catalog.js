import "./Catalog.scss";
import { useQuery, useMutation, gql } from '@apollo/client';
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiUser3Fill } from "react-icons/ri";
// import { BsShare } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { BiAddToQueue } from "react-icons/bi"
import { AiOutlineDelete } from "react-icons/ai"
import ConfirmationPopUp from "../../components/ConfirmationPopUp/ConfirmationPopUp";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GCS_API } from "../../utils/constants";
import logo_k from '../../assets/img/logo/logo_k.svg';
import ReactTooltip from 'react-tooltip';
import { toast } from "react-toastify";

const CATALOG = gql`
  query GetCatalogByUsernameAndCatalogName ($username: String!, $catalogName: String!){
    getCatalogByUsernameAndCatalogName (username: $username, catalogName: $catalogName) {
      id,
      name,
      description,
      isPrivate,
      user {
          id,
          username
      }
      items{
          id,
          name,
          creationDate,
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

function Items(props) {
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();
  
  const handleRowClick = (name) => {
    navigate(`/${username}/${catalogname}/${name}`);
  } 


  return props.items.map(({ id, name, creationDate, fields }) => {
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
          {new Date(creationDate).getUTCFullYear()+'/'+new Date(creationDate).getUTCMonth()+'/'+new Date(creationDate).getUTCDate()+
            ' - ' + new Date(creationDate).getUTCHours() +':'+new Date(creationDate).getUTCMinutes() +' UTC'}
        </td>
        {/* <td>{id}</td> */}
    </tr>
    )
  });
}

function Catalog() {
  const loggedUsername = useSelector(state => state.user.username);
  const navigate = useNavigate();
  const {username} = useParams();
  const {catalogname} = useParams();

  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteCatalog] = useMutation(DELETE_CATALOG);
  
  const { loading, error, data } = useQuery(CATALOG, {
    variables: {username: username, catalogName: catalogname}
  });

  if (loading) return <span key="loading">Loading...</span>;
  if (error) navigate("/notfound");

  const handleDeleteCatalog = async() => {
    setIsDeleteLoading(true);
    deleteCatalog({ 
      variables: { id: data.getCatalogByUsernameAndCatalogName.id },
      onCompleted(data) {
        setIsDeleteLoading(false);
        setShowDeletePopUp(false);
        navigate(`/home`);
      },
      onError(error) {
        setIsDeleteLoading(false);
        setDeleteError(error.message);
      }
    });
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
      {/* <div className="breadcrumbs">
        <Link to={`/`}>Home</Link>
        <span>{' > '}</span>
        <Link to={`/${username}`}>{username}</Link>
        <span>{' > '}</span>
        <span>{catalogname}</span>
      </div> */}
      <div className="catalog-header">
        <h1 className="title catalog-name">{catalogname}</h1>
        <div className="catalog-actions-container">
          <div className="catalog-actions">
            {loggedUsername === username ? <BiAddToQueue className="catalog-actions-item remove-outline" data-tip="Create new item" onClick={() => {navigate(`/${username}/${catalogname}/create-item`)}} /> : null}
            <MdContentCopy className="catalog-actions-item remove-outline" data-tip="Copy Link" onClick={() => {navigator.clipboard.writeText(window.location); toast.info("Link Copied!");}} />
            {/* <BsShare className="catalog-actions-item" title="Share" onClick={() => {navigator.clipboard.writeText(window.location)}} /> */}
            {/* <HiOutlinePencil className="catalog-actions-item" title="Edit"></HiOutlinePencil> */}
            {loggedUsername === username ? <AiOutlineDelete className="catalog-actions-item catalog-actions-delete remove-outline" data-tip="Delete Katalog" onClick={() => setShowDeletePopUp(true)} /> : null}
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