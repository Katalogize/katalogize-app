import './App.scss';
import ReactGA from "react-ga4";
import Header from './components/header/Header';
import Entry from './pages/entry/Entry';
import SignIn from './pages/signin/SignIn';
import SignUp from './pages/signup/SignUp';
import Home from './pages/home/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  ReactGA.initialize("G-YGXLTYRGCV");
  // ReactGA.initialize("G-YGXLTYRGCV", {debug: true});
  // ReactGA.send({hitType: "pageview"});
  ReactGA.send({ hitType: "pageview", page: "/in-development", title:"In Development" });

  return (
    <div className="App">
      <Router>
        <Header />
        <div className="App-body">
          <Routes>
              <Route path='/' element={<Entry />}/>
              <Route path='/login' element={<SignIn />}/>
              <Route path='/register' element={<SignUp />}/>
              <Route path='/home' element={<Home />}/>
          </Routes>
        </div>
        </Router>
    </div>
  );
}

export default App;
