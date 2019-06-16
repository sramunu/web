import React, { useEffect } from "react";
import styled from "styled-components";
import { themeGet } from "styled-system";

import { useRedux } from "../redux";
import { getThreads } from "../selectors";
import * as unboundActions from "../actions/threads";
import ThreadListItem from "../components/ThreadListItem";

const ThreadsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  margin: ${themeGet("space.5")} auto 0 auto;
  width: 100%;
  max-width: 80rem;
  border-top: 0.2rem solid ${themeGet("colors.primary")};
`;

export default function Main() {
  const [[threads], { fetchThreads }] = useRedux([getThreads], unboundActions);

  useEffect(() => {
    if (threads.length === 0) fetchThreads();
  }, [threads, fetchThreads]);

  return (
    <ThreadsContainer>
      {threads.map(thread => (
        <ThreadListItem key={thread.id} thread={thread} />
      ))}
    </ThreadsContainer>
  );
}
