import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.scss';
import { AuthClient } from '@dfinity/auth-client';

// Wrap the code in an async function
async function getPrincipal() {
  try {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const principal = identity.getPrincipal();
    console.log("Your principal is: " + principal.toText());

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App loggedInPrincipal={principal} />
      </React.StrictMode>,
    );
    return principal;
  } catch (error) {
    console.error("Error getting principal:", error);
  }
}

// Usage
getPrincipal().then(principal => {
  // Use the principal here
  console.log("Principal to use:", principal.toText());
});



