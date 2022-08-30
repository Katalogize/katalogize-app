import logo from './assets/img/logo.svg';
import logo_k from './assets/img/logo_k.svg';
import './App.scss';
import ReactGA from "react-ga4";
import { useQuery, gql } from '@apollo/client';

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
    <div key={id} className="catalog">
      <img width="100" height="100" alt="location-reference" src={logo_k} />
      <div>
        <b>{name}</b>
        <br />
        <p>{description}</p>
      </div>
    </div>
  ));
}

function App() {
  ReactGA.initialize("G-YGXLTYRGCV");
  // ReactGA.initialize("G-YGXLTYRGCV", {debug: true});
  // ReactGA.send({hitType: "pageview"});
  ReactGA.send({ hitType: "pageview", page: "/in-development", title:"In Development" });


  function sendInfo () {
    console.log("Sending click logo event");
    ReactGA.event({
      category: "Click",
      action: "Click on logo",
      label: "Logo"
    });
  };

  return (
    <div className="App">
      <div className="App-body">
        <span onClick={() => sendInfo()}><img src={logo} className="App-logo" alt="logo"/></span>
        <p>
          Application in development. Please come back later.
        </p>
        <DisplayCatalogs></DisplayCatalogs>
      </div>
    </div>
  );
}

export default App;
