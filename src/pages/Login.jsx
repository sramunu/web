import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

import { baseMinHeight } from "./styles";
import { useSelectors } from "../redux";
import { getIsLoggedIn } from "../selectors";
import LoginForm from "../components/LoginForm";
import OauthForm from "../components/OauthForm";
import RegistrationForm from "../components/RegistrationForm";
import { Heading, Text, Box } from "../components/styles";

const CenterContent = styled.div`
  ${baseMinHeight}
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${themeGet("media.tablet")} {
    justify-content: unset;
  }
`;

const Container = styled.div`
  max-width: 30rem;
  width: 100%;
  padding: ${themeGet("space.2")};
`;

export default function Login() {
  const history = useHistory();
  const [isLoggedIn] = useSelectors(getIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn || localStorage.getItem("userToken")) {
      history.push("/");
    }
  }, [isLoggedIn, history]);

  return (
    <CenterContent>
      <Box mb={4} alignItems="center">
        <Heading fontSize={4} fontWeight="semiBold" mb={1}>
          Convo
        </Heading>
        <Text color="darkGray">
          Login or sign up for Convo{" "}
          <span role="img" aria-label="sparkles">
            ✨
          </span>
        </Text>
      </Box>
      <Container>
        <Switch>
          <Route exact path="/login" component={OauthForm} />
          <Route exact path="/login/email" component={LoginForm} />
          <Route path="/login/register" component={RegistrationForm} />
        </Switch>
      </Container>
    </CenterContent>
  );
}
