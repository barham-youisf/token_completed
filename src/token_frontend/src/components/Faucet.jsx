import React from "react";
import { canisterId, createActor } from "../../../declarations/token_backend";
import { AuthClient } from "@dfinity/auth-client";

function Faucet(props) {
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [result, setResult] = React.useState("Gimme gimme");

  async function handleClick(event) {
    setIsDisabled(true);

    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });


    // const isAuthenticated = await authClient.isAuthenticated();

    const result = await authenticatedCanister.payOut();
    console.log(result);

    setResult(result);
    // setIsDisabled(false);

  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DBarham tokens here! Claim 8,888 BARHAM tokens {props.principal}  .</label>
      <p className="trade-buttons">
        <button id="btn-payout"
          onClick={handleClick}
          disabled={isDisabled}

        >
          {result}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
