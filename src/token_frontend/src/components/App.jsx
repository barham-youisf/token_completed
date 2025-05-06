import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/token_backend';
import { canisterId } from '../../../declarations/token_backend/index';

import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local

const Button = ({ onClick, children }) => <button onClick={onClick}>{children}</button>;

const App = (props) => {
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: undefined
  });

  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  const updateActor = async () => {
    const authClient = state.authClient || await AuthClient.create();
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();
    const isAuthenticated = await authClient.isAuthenticated();

    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });

    setState(prev => ({
      ...prev,
      actor,
      authClient,
      isAuthenticated,
      principal: isAuthenticated ? principal.toText() : undefined
    }));
  };

  const login = async () => {
    if (!state.authClient) {
      const authClient = await AuthClient.create();
      setState(prev => ({ ...prev, authClient }));
    }

    await state.authClient.login({
      identityProvider,
      onSuccess: updateActor
    });
  };

  const logout = async () => {
    await state.authClient?.logout();
    updateActor();
  };

  return (
    <div>
      <h1 className="blue windoww">Opend Platform</h1>

      {!state.isAuthenticated ? (
        <Button onClick={login}>Login with Internet Identity</Button>
      ) : (
        <>
          <Button onClick={logout}>Logout</Button>
          <p className='pp'>Your principal: {state.principal}</p>
        </>
      )}

      <div id="screen">
        <Header />
        <Faucet userPrincipal={state.principal} />
        <Balance />
        <Transfer />
      </div>
    </div>
  );
};

export default App;