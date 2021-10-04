import React from 'react';
import './App.css';
import { Amplify, Storage, API } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifyAuthContainer } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import FileUpload from './FileUpload';
import FileRetrieve from './FileRetrieve';
import File from './File';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { HashRouter, Switch, Route } from "react-router-dom";
Amplify.configure(awsconfig);
Amplify.API= [
        {
          name: "pouch-backend",
          endpoint: "https://gpa81z32da.execute-api.us-west-1.amazonaws.com"
        }
    ]
  
const AuthStateApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <>
      <Navbar className="mainNav navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" expand="lg">
        <Container>
          <Navbar.Brand className="navbar-brand" href="#home">Pouch</Navbar.Brand>
          <Nav className="me-auto navbar-nav">
            <Nav.Link className="nav-link py-3 px-0 px-lg-3 rounded" href="/">Home</Nav.Link>
            <Nav.Link className="nav-link py-3 px-0 px-lg-3 rounded" href="/admin">Admin</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
          <NavDropdown title={user.username} id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">
            <AmplifySignOut /></NavDropdown.Item>
            </NavDropdown>

          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
      <header class="masthead bg-primary text-white text-center">
            <div class="container d-flex align-items-center flex-column">

                <img class="masthead-avatar mb-5" src="/mockup-graphics-1CZ7n_bBnhk-unsplash.jpg" alt="..."/>
 
                <h1 class="masthead-heading text-uppercase mb-0">Welcome to Pouch</h1>
 
                <div class="divider-custom divider-light">
                    <div class="divider-custom-line"></div>
                    <div class="divider-custom-icon"><svg class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg><i class="fas fa-star"></i> </div>
                    <div class="divider-custom-line"></div>
                </div>
 
                <p class="masthead-subheading font-weight-light mb-0">store here at your own risk !!!</p>
            </div>
        </header>
        <HashRouter>
          <Switch>
            <Route exact path="/">
              <div className="App">
                <FileUpload/>
                <FileRetrieve />
              </div>
            </Route>
            <Route exact path="/file">
              <div className="App">
                <File></File>
              </div>
            </Route>
          </Switch>
        </HashRouter>

      </Container>
    </>

  ) : (
    <AmplifyAuthContainer>
      <AmplifyAuthenticator>
        <AmplifySignUp slot="sign-up" usernameAlias="email" formFields={[
          {
            type: "email",
            label: "Email Address",
            placeholder: "Email",
            inputProps: { required: true, autocomplete: "username" },
          },
          {
            type: "password",
            label: "Password",
            placeholder: "Password",
            inputProps: { required: true, autocomplete: "new-password" },
          },
          {
            type: "given_name",
            label: "First Name",
            placeholder: "First Name",
          },
          {
            type: "family_name",
            label: "Last Name",
            placeholder: "Last Name",
          }
        ]}
        />
      </AmplifyAuthenticator>

    </AmplifyAuthContainer>
  );
}

export default AuthStateApp;
