import "./Catalog.scss";
import { useQuery, useMutation, gql } from '@apollo/client';
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiUser3Fill } from "react-icons/ri";
// import { HiOutlinePencil } from "react-icons/hi";
// import { BsShare } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { BiAddToQueue } from "react-icons/bi"
import { AiOutlineDelete } from "react-icons/ai"
import ConfirmationPopUp from "../../components/ConfirmationPopUp/ConfirmationPopUp";
import { useState } from "react";
import { useSelector } from "react-redux";

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
          creationDate
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

  return props.items.map(({ id, name, creationDate }) => (
    <tr key={id} onClick={()=> handleRowClick(name)}>
        <td>{name}</td>
        <td className="catalog-table-last">
          {new Date(creationDate).getUTCFullYear()+'/'+new Date(creationDate).getUTCMonth()+'/'+new Date(creationDate).getUTCDate()+
            ' - ' + new Date(creationDate).getUTCHours() +':'+new Date(creationDate).getUTCMinutes() +' UTC'}
        </td>
        {/* <td>{id}</td> */}
    </tr>
  ));
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
            {loggedUsername === username ? <BiAddToQueue className="catalog-actions-item" title="Create new item" onClick={() => {navigate(`/${username}/${catalogname}/create-item`)}} /> : null}
            <MdContentCopy className="catalog-actions-item" title="Copy Link" onClick={() => {navigator.clipboard.writeText(window.location)}} />
            {/* <BsShare className="catalog-actions-item" title="Share" onClick={() => {navigator.clipboard.writeText(window.location)}} /> */}
            {/* <HiOutlinePencil className="catalog-actions-item" title="Edit"></HiOutlinePencil> */}
            {loggedUsername === username ? <AiOutlineDelete className="catalog-actions-item catalog-actions-delete" title="Delete" onClick={() => setShowDeletePopUp(true)} /> : null}
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
              <th className="catalog-table-name">Name</th>
              <th className="catalog-table-date">Created At</th>
            </tr>
          </thead>
          <tbody>
            <Items items={data.getCatalogByUsernameAndCatalogName?.items}></Items>
            {data.getCatalogByUsernameAndCatalogName?.items.length === 0 ? <tr><td>No items created yet.</td><td></td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Catalog;