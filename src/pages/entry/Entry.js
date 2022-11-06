import "./Entry.scss";
import { useQuery, gql } from '@apollo/client';
import ReactGA from "react-ga4";
import logo from '../../assets/img/logo/logo_medium.svg';
import CatalogCard from "../../components/CatalogCard/CatalogCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { GOOGLE_AUTH_URL } from "../constants/constants";
const GET_CATALOGS = gql`
  query {
    getAllCatalogs {
        id,
        name,
        description,
        templates {
            id,
            name,
            templateFields {
                name
            }
        }
        user {
            id,
            displayName,
            username
        }
    }
  }
`;

function DisplayCatalogs() {
  const { loading, error, data } = useQuery(GET_CATALOGS);
  const isLogged = useSelector(state => state.user.isLogged);
  const navigate = useNavigate();

  if (window.location.search !== "") {
    console.log("Redirecting to " + window.location.search);
    setTimeout(() => {
      navigate(window.location.search.split("?/")[1]);
    }, 100);
  } else if (isLogged) {
    console.log("Logged! Redirecting to home...");
    setTimeout(() => {
      navigate("/home");
    }, 200);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Could not load Katalogs, please come back later.</p>;

  return data.getAllCatalogs.map(({ id, name, description, user }) => (
    <CatalogCard key={id} catalogData={{name, description, user}}></CatalogCard>
  ));
}

function Entry() {
  function sendInfo () {
    console.log("Sending click logo event");
    ReactGA.event({
      category: "Click",
      action: "Click on logo",
      label: "Logo"
    });
  };

  return (
    <div>
      <span onClick={() => sendInfo()}><img src={logo} className="entry-logo" alt="logo"/></span>
        <p>
          Catalog anything you need, however you want!
        </p>
        <div className="entry-catalog-list">
          <DisplayCatalogs></DisplayCatalogs>
        </div>
    </div>
  );
}

export default Entry;