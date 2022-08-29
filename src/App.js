import logo from './assets/img/logo.svg';
import './App.scss';
import ReactGA from "react-ga4";

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
      <header className="App-header">
        <span onClick={() => sendInfo()}><img src={logo} className="App-logo" alt="logo"/></span>
        <p>
          Application in development. Please come back later.
        </p>
      </header>
    </div>
  );
}

export default App;
