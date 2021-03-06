import React, { useState } from "react";

import { errorToString } from "../utils";
import { useActions } from "../redux";
import * as unboundActions from "../actions/user";
import { Ripple, CenterContent, Text } from "../components/styles";

export default function VerifyEmail({ match, history }) {
  const [error, setError] = useState("");
  const { email, key, timestamp, signature } = match.params;
  const { verifyEmail } = useActions(unboundActions);

  async function handleVerifyEmail() {
    try {
      await verifyEmail({ userID: key, timestamp, signature, email });
      history.push("/convos");
    } catch (e) {
      setError(errorToString(e));
    }
  }

  handleVerifyEmail();

  return (
    <CenterContent>
      {error ? <Text fontSize={3}>{error}</Text> : <Ripple />}
    </CenterContent>
  );
}
