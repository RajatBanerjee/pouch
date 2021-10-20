import React from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { AmplifyAuthenticator,  AmplifyAuthContainer } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import { HashRouter, Switch, Route } from "react-router-dom";
import Signup from './Signup';
import Dashboard from './Dashboard';

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const AuthStateApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      console.log("authdata ==>", authData)
      setUser(authData)

      if (nextAuthState === AuthState.SignedIn) {
        setIsAdmin(authData.signInUserSession.accessToken.payload["cognito:groups"].includes("administrator"))
      }

    });
  }, []);
  return authState === AuthState.SignedIn && user ? (
    <>
        <HashRouter>
          <Switch>
            <Route exact path="/">
              <div className="App">
                <Dashboard user={user} isAdmin={isAdmin}></Dashboard>
              </div>
            </Route>

            <Route exact path="/admin">
              <div className="Admin">
              <Dashboard user={user} isAdmin={isAdmin} isAdminMode={true}></Dashboard>
              </div>
            </Route>
          </Switch>
        </HashRouter>
    </>

  ) : (
    <AmplifyAuthContainer>
      <AmplifyAuthenticator>
        <Signup></Signup>
      </AmplifyAuthenticator>

    </AmplifyAuthContainer>
  );
}

export default AuthStateApp;
