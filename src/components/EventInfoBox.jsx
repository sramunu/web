import React, { useState } from "react";
import { useHistory } from "react-router";
import orderBy from "lodash/orderBy";

import { useSelectors } from "../redux";
import AddUserForm from "./AddUserForm";
import InfoBoxMemberItem from "./InfoBoxMemberItem";
import DeleteEventButton from "./DeleteEventButton";
import LeaveEventButton from "./LeaveEventButton";
import UserOverflowList from "./UserOverflowList";
import { getUser } from "../selectors";
import { Box, Heading } from "./styles";
import { Label, Action } from "./styles/InfoBox";

export default function EventInfoBox({ event }) {
  const history = useHistory();
  const [user] = useSelectors(getUser);
  const [isGuestEditing, setIsGuestEditing] = useState(false);
  const { id, owner } = event;
  const isOwner = user.id === owner.id;

  return (
    <React.Fragment>
      <Label>Name</Label>
      <Heading fontFamily="sans" fontSize={4} mb={4} mt="0">
        {event.name}
      </Heading>

      <Label>Host</Label>
      <Box as="ul" mb={4}>
        <InfoBoxMemberItem member={owner} event={event} ml="-0.8rem" mb={1} />
      </Box>

      <Label>Guests</Label>
      <UserOverflowList
        users={
          event.users &&
          orderBy(
            event.users.filter(guest => guest.id !== owner.id),
            [u => event.rsvps && event.rsvps.some(rsvp => rsvp.id === u.id)],
            ["desc"]
          )
        }
        transformUserProps={props => ({
          ...props,
          event,
          canDelete: isOwner,
          isChecked:
            event.rsvps && event.rsvps.some(rsvp => rsvp.id === props.user.id)
        })}
        renderExtraChildren={() =>
          isGuestEditing && (
            <AddUserForm
              resourceType={event.resourceType}
              resource={event}
              onBlur={() => setIsGuestEditing(false)}
            />
          )
        }
      />

      <Label>Actions</Label>
      <Box as="ul" mb={4}>
        {(isOwner || event.guestsCanInvite) && (
          <Action
            onClick={() => setIsGuestEditing(true)}
            ml="-1.2rem"
            text="Invite others"
            iconName="group_add"
          />
        )}

        {isOwner && (
          <React.Fragment>
            <Action
              onClick={() => history.push(`/events/${id}/edit`)}
              ml="-1.2rem"
              text="Edit"
              iconName="edit"
            />
            <DeleteEventButton
              event={event}
              render={onClick => (
                <Action
                  onClick={onClick}
                  ml="-1.2rem"
                  text="Delete"
                  iconName="remove_circle"
                />
              )}
            />
          </React.Fragment>
        )}

        {!isOwner && (
          <LeaveEventButton
            event={event}
            user={user}
            render={onClick => (
              <Action
                onClick={onClick}
                ml="-1.2rem"
                text="Leave"
                iconName="remove_circle"
              />
            )}
          />
        )}
      </Box>
    </React.Fragment>
  );
}
