import React, { useEffect, useState, useRef } from "react";

import { useSelectors, useActions } from "../redux";
import { getUser, getMessagesByThreadId } from "../selectors";
import * as unboundActions from "../actions/messages";
import Message from "./Message";
import MessageComposer from "./MessageComposer";
import { Ripple } from "./styles";

export default function ThreadViewer({ thread }) {
  const fetched = useRef({});
  const [isLoading, setIsLoading] = useState(false);
  const [messages, user] = useSelectors(
    getMessagesByThreadId(thread.id),
    getUser
  );
  const { fetchMessages } = useActions(unboundActions);
  const { id } = thread;
  const hasMessages = messages.length > 0;

  useEffect(() => {
    async function handleFetchMessages() {
      setIsLoading(true);
      try {
        await fetchMessages(id);
      } catch (e) {}
      setIsLoading(false);
    }

    if (id && !isLoading && !hasMessages && !fetched.current[id]) {
      fetched.current[id] = true;
      handleFetchMessages();
    }
  }, [id, fetchMessages, isLoading, hasMessages, fetched]);

  return (
    <div>
      <MessageComposer />
      {isLoading && <Ripple />}
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          isAuthor={user.id === message.user.id}
        />
      ))}
    </div>
  );
}
