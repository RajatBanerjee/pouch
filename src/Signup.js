import React from 'react';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifyAuthContainer } from '@aws-amplify/ui-react';

const Signup = () => {
return(
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
)
 }

 export default Signup