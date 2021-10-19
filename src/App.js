import React from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { AmplifyAuthenticator,  AmplifyAuthContainer } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import File from './File';
import { HashRouter, Switch, Route } from "react-router-dom";
import AdminFileretrieve from './AdminFileretrieve';
import Signup from './Signup';
import Dashboard from './Dashboard';

Amplify.configure(awsconfig);
Auth.configure(awsconfig);
const AuthStateApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, []);
console.log(user)
  return authState === AuthState.SignedIn && user ? (
    <>
        <HashRouter>
          <Switch>
            <Route exact path="/">
              <div className="App">
                <Dashboard user={user}></Dashboard>
              </div>
            </Route>

            <Route exact path="/admin">
              <div className="Admin">
                <AdminFileretrieve />
              </div>
            </Route>
            <Route exact path="/file">
              <div className="App">
                <File></File>
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
