import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { themeGet } from "styled-system";

import { useRedux } from "../redux";
import { getIsLoggedIn } from "../selectors";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";

const CenterContent = styled.div`
  height: calc(100vh - ${themeGet("headerHeight")});
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const Container = styled.div`
  max-width: 30rem;
  width: 100%;
  padding: ${themeGet("space.2")};
`;

export default function Login(props) {
  // eslint-disable-next-line no-unused-vars
  const [[isLoggedIn], _] = useRedux([getIsLoggedIn], {});

  useEffect(() => {
    if (isLoggedIn) {
      props.history.push("/");
    }
  }, [isLoggedIn, props.history]);

  return (
    <CenterContent>
      <Container>
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Route path="/login/register" component={RegistrationForm} />
        </Switch>
      </Container>
    </CenterContent>
  );
}