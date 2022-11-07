import "./Entry.scss";
import { useQuery, gql } from '@apollo/client';
import ReactGA from "react-ga4";
import logo from '../../assets/img/logo/logo_medium.svg';
import CatalogCard from "../../components/CatalogCard/CatalogCard";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { GOOGLE_AUTH_URL } from "../constants/constants";
const OFFICIAL_CATALOGS = gql`
  query {
    getOfficialCatalogs {
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
  const { loading, error, data } = useQuery(OFFICIAL_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{whiteSpace: "nowrap", margin: 25}}>Could not load Katalogs, please come back later.</p>;

  return data.getOfficialCatalogs.map(({ id, name, description, user }) => (
    <CatalogCard key={id} catalogData={{name, description, user}}></CatalogCard>
  ));
}

function Entry() {
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
      <div>
        <span onClick={() => sendInfo()}><img src={logo} className="entry-logo" alt="logo"/></span>
        <p>
          Catalog anything you need, however you want!
        </p>
        <div style={{margin: 50}}><Link to="/login" className="primary-button entry-button"><span>Get Started</span></Link></div>
      </div>
      <h2 className="title title-list">Official Katalogs</h2>
      <div className="catalogs-list">
        <DisplayCatalogs></DisplayCatalogs>
      </div>
    </div>
  );
}

export default Entry;