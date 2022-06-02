import './App.css';
import { Route, Switch, useHistory } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { User, AddUser, ActivateUser, ForgotUser, OpenedEmailUser } from './user';
import { ShowPosts } from './showPosts';
export const userContext = createContext(null);
function App() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [picture, setPicture] = useState("");
  return (
    <>
      <userContext.Provider value={{
        user: user, setUser: setUser, email:email, setEmail:setEmail, posts:posts, setPosts:setPosts,
        firstName:firstName, setFirstName:setFirstName, lastName:lastName, setLastName:setLastName,
        picture:picture, setPicture:setPicture
      }}>
        <Navigation />
      </userContext.Provider>
    </>
  );
}
function Navigation() {
  const history = useHistory();
  const { setUser, user, setFirstName, setLastName, setPicture } = useContext(userContext);
  const User = localStorage.getItem('User');
  useEffect(() => {
    setUser(User);
    // eslint-disable-next-line
  }, [User]);
  function clearUser() {
    localStorage.setItem('User', '');
    localStorage.setItem('FirstName', '');
    localStorage.setItem('LastName', '');
    localStorage.setItem('Picture', '');
    setUser('');
    setFirstName('');
    setLastName('');
    setPicture('');
    alert("Thanks for visiting");
    history.push("/")
  }
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">ConNxt</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            
            <Nav>
              {user  ?
                <NavDropdown title="log out" id="collasible-nav-dropdown">
                    <NavDropdown.Item to="/" onClick={() => clearUser()}>User logout</NavDropdown.Item>
                </NavDropdown> : ""}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes />

    </>
  )
}
function Routes() {
  return (
    <Switch>
      <Route path="/loginUser">
        <User />
      </Route>
      <Route path="/signUpUser">
        <AddUser />
      </Route>
      <Route path="/activateUser/:email/:token">
        <ActivateUser />
      </Route>
      <Route path="/forgotUser">
        <ForgotUser />
      </Route>
      <Route path="/retrieveUser/:email/:token">
        <OpenedEmailUser />
      </Route>
      <Route path="/showPosts">
        <ShowPosts />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}
function Home() {
  return (
    <Container >
      <div className="home-header">Welcome!!!</div>
      <User />
    </Container>
  )
}
export default App;