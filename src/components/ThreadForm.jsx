import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";
import { Editor } from "slate-react";
import Plain from "slate-plain-serializer";
import { withRouter } from "react-router";

import { getUser } from "../api/user";
import { theme, Text, FloatingPill } from "./styles";
import Controls from "./MessageComposerControls";
import MultiMemberPickerField from "./MultiMemberPickerField";
import { useActions } from "../redux";
import * as unboundActions from "../actions/threads";
import * as unboundNotifActions from "../actions/notifications";

const Container = styled.main`
  display: block;
  padding: 0 ${themeGet("space.5")};

  ${themeGet("media.tablet")} {
    padding-left: ${themeGet("space.5")};
    padding-right: 0;
  }

  ${themeGet("media.phone")} {
    padding: 0;
  }
`;

const Form = styled.form``;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: ${themeGet("space.1")};
  width: 100%;
`;

const Input = styled.input`
  padding: ${themeGet("space.2")};
  margin: ${themeGet("space.1")} 0;
  border: none;
  border-radius: ${themeGet("radii.small")};
  outline: none;
  font-family: ${themeGet("fonts.sans")};
  width: 100%;
  font-size: ${themeGet("fontSizes.2")};
`;

const nullValue = Plain.deserialize("");

function ThreadForm(props) {
  const subjectEl = useRef(null);
  const [messageValue, setMessageValue] = useState(nullValue);
  const [subject, setSubject] = useState("");
  const [members, setMembers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const { createThread, setSelectedThread } = useActions(unboundActions);
  const { dispatchNotification } = useActions(unboundNotifActions);

  function handleMessageChange({ value }) {
    setMessageValue(value);
  }

  function handleSubjectChange(e) {
    setSubject(e.target.value);
  }

  async function handleSend(e) {
    e.preventDefault();

    const body = Plain.serialize(messageValue);

    if (body.length === 0) {
      return dispatchNotification({
        type: "ERROR",
        message: "Your message cannot be empty"
      });
    }

    if (members.length === 0) {
      return dispatchNotification({
        type: "ERROR",
        message: "You need to add at least one member"
      });
    }

    setIsDisabled(true);
    let thread;
    try {
      thread = await createThread({
        subject,
        users: members,
        body
      });
    } catch (e) {
      setIsDisabled(false);
      return;
    }

    setSelectedThread(thread.id);
    props.history.push("/convos");
  }

  useEffect(() => {
    subjectEl.current.focus();

    if (props.history.location && props.history.location.search) {
      const [, id] = props.history.location.search.match(/\?userId=(.+)/);
      getUser(id).then(user => setMembers([user]));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <FloatingPill>
        <Form>
          <Label>
            <Text fontSize={1} mr={1}>
              Subject:
            </Text>
            <Input
              type="text"
              placeholder="Give your Convo a subject"
              value={subject}
              onChange={handleSubjectChange}
              ref={subjectEl}
              required
              maxLength="255"
              fontSize={4}
            />
          </Label>
          <Label>
            <Text fontSize={1} mr={1}>
              To:
            </Text>
            <MultiMemberPickerField members={members} setMembers={setMembers} />
          </Label>

          <Editor
            onChange={handleMessageChange}
            value={messageValue}
            placeholder="Compose your message..."
            style={{
              width: `calc(100% - ${theme.space[3]} * 2)`,
              marginBottom: "1rem",
              backgroundColor: theme.colors.snow,
              border: `0.1rem solid ${theme.colors.veryLightGray}`,
              borderRadius: theme.radii.normal,
              padding: theme.space[3],
              minHeight: "16rem",
              marginTop: theme.space[3]
            }}
          />
          <Controls
            value={messageValue}
            onClick={handleSend}
            isDisabled={isDisabled}
          />
        </Form>
      </FloatingPill>
    </Container>
  );
}

export default withRouter(ThreadForm);
