import './App.scss';
import ReactGA from "react-ga4";
import Header from './components/Header/Header';
import Entry from './pages/Entry/Entry';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import CreateCatalog from './pages/CreateCatalog/CreateCatalog';
import { useDispatch, useSelector } from "react-redux";
import { update } from "./store/userSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useLazyQuery, gql } from '@apollo/client';
import { useState } from 'react';
import NotFound from './pages/NotFound/NotFound';
import Catalog from './pages/Catalog/Catalog';
import CatalogItem from './pages/CatalogItem/CatalogItem';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Zoom } from 'react-toastify';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Settings from './pages/Settings/Settings';

const GET_USERINFO = gql`
  query {
    getLoggedUser {
        id,
        displayName,
        username,
        isAdmin,
        picture
    }
  }
`;

function App() {

  ReactGA.initialize("G-YGXLTYRGCV");
  ReactGA.send({ hitType: "pageview", page: "/in-development", title:"In Development" });
  // ReactGA.initialize("G-YGXLTYRGCV", {debug: true});
  // ReactGA.send({hitType: "pageview"});

  const userId = useSelector(state => state.user.userId);
  const [isLogged, setIsLogged] = useState(false);
  const dispatch = useDispatch();

  const [getUserInfo, {loading}] = useLazyQuery(GET_USERINFO, {
    fetchPolicy: 'network-only', 
    onCompleted(data) {
      console.log("Loaded user info");
      const userInfo = data.getLoggedUser;
      setIsLogged(true);
      dispatch(update({displayName: userInfo.displayName, userId: userInfo.id, username: userInfo.username, isAdmin: userInfo.isAdmin, isLogged: true, picture: userInfo.picture}));
      // if (window.location.pathname === "/") {
      //   window.location.replace(window.location.origin + '/home');
      // }
    }
  });

  const loadUser = async() => {
    await getUserInfo(GET_USERINFO);
  };
  
  useSelector(state => {
    if (loading === false) {
      // eslint-disable-next-line
      if (isLogged === false && localStorage.getItem("refreshToken") && userId === null && localStorage.getItem("isLocked")!= 1 ) {
        console.log("Previously logged!");
        setIsLogged(true);
        loadUser();
      } else if (isLogged === false && state.user.isLogged === true) {
        console.log("Logged in!");
        setIsLogged(true);
        loadUser();
      } else if (isLogged === true && state.user.isLogged === false) {
        setIsLogged(false);
      }
    }
  });

  return (
    <div className="App">
      <Router>
        <Header />
        <ToastContainer 
          position="bottom-center"
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
          style={{marginTop: 100}}/>
        <div className="App-body">
          <Routes>
              <Route path='/' element={ <Entry />}/>
              <Route path='/getstarted' element={ <Entry />}/>
              <Route path='/login' element={<SignIn />}/>
              <Route path='/register' element={<SignUp />}/>
              <Route path='/reset-password' element={<ResetPassword />}/>
              <Route path='/home' element={<Home />}/>
              <Route path='/settings' element={<Settings />}/>
              <Route path='/create-katalog' element={<CreateCatalog />}/>
              <Route path='/:username' element={<Profile />}/>
              <Route path='/:username/:catalogname' element={<Catalog />}/>
              <Route path='/:username/:catalogname/:itemname' element={<CatalogItem />}/>
              <Route path='/notfound' element={<NotFound />}/>
          </Routes>
        </div>
        </Router>
    </div>
  );
}

export default App;
