import "./Entry.scss";
import { useQuery, gql } from '@apollo/client';
import logo_k from '../../assets/img/logo/logo_k.svg';
import ReactGA from "react-ga4";
import logo from '../../assets/img/logo/logo_medium.svg';
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
            firstName
        }
    }
  }
`;

function DisplayCatalogs() {
  const { loading, error, data } = useQuery(GET_CATALOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getAllCatalogs.map(({ id, name, description }) => (
    <div key={id} className="entry-catalog">
      <img width="100" height="100" alt="location-reference" src={logo_k} />
      <div>
        <b>{name}</b>
        <br />
        <p>{description}</p>
      </div>
    </div>
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
          Application in development. Please come back later.
        </p>
        <div className="entry-catalog-list">
          <DisplayCatalogs></DisplayCatalogs>
        </div>
    </div>
  );
}

export default Entry;