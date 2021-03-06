import { createSelector } from "reselect";
import orderBy from "lodash/orderBy";
import { isAfter, parseISO } from "date-fns";

export function getGeneralError(store) {
  return (store.errors.auth && store.errors.auth.message) || "";
}

export function getAuthErrors(store) {
  const authErrors = store.errors.auth || {};
  // Massage errors into empty strings when they are undefined
  return Object.keys(authErrors).reduce((result, key) => {
    result[key] = authErrors[key] || "";
    return result;
  }, {});
}

export function getIsLoggedIn(store) {
  return Boolean(store.user);
}

export function getIsLoading(store) {
  return store.loading.global;
}

export function getUser(store) {
  return store.user;
}

export function getThreads(store) {
  return store.threads;
}

export function getEvents(store) {
  return store.events;
}

export function getMessages(store) {
  return store.messages;
}

export function getContacts(store) {
  return store.contacts;
}

export function getIsContactsFetched(store) {
  return store.isContactsFetched;
}

export function getIsThreadsFetched(store) {
  return store.isThreadsFetched;
}

export function getIsEventsFetched(store) {
  return store.isEventsFetched;
}

export function getThreadsPageNum(store) {
  return store.threadsPageNum;
}

export function getEventsPageNum(store) {
  return store.eventsPageNum;
}

export function getIsThreadsExhausted(store) {
  return store.isThreadsExhausted;
}

export function getIsEventsExhausted(store) {
  return store.isEventsExhausted;
}

export const getThreadsPageInfo = createSelector(
  getThreadsPageNum,
  getIsThreadsExhausted,
  (pageNumber, isExhausted) => ({ pageNumber, isExhausted })
);

export const getEventsPageInfo = createSelector(
  getEventsPageNum,
  getIsEventsExhausted,
  (pageNumber, isExhausted) => ({ pageNumber, isExhausted })
);

export function getSelectedResourceId(store) {
  return store.selectedResourceId;
}

export const getThreadsCount = createSelector(getThreads, res => res.length);

export const getEventsCount = createSelector(getEvents, res => res.length);

export const getUpcomingEvents = createSelector(getEvents, events =>
  events.filter(e => isAfter(parseISO(e.timestamp), Date.now()))
);

export const getEventById = id => store => store.events.find(e => e.id === id);

export const getThreadById = id => store =>
  store.threads.find(t => t.id === id);

export function getMessagesByThreadId(id) {
  return store => store.messages.filter(message => message.parentId === id);
}

export const getMessagesBySelectedThread = createSelector(
  getMessages,
  getSelectedResourceId,
  (messages, id) => messages.filter(message => message.parentId === id)
);

export const getInboxContents = createSelector(
  getUser,
  getThreads,
  getEvents,
  (user, threads, events) =>
    orderBy(
      [].concat(threads, events),
      [
        o => o.reads && o.reads.some(r => r.id === (user && user.id)),
        o => (o.preview ? o.preview.timestamp : o.timestamp)
      ],
      ["asc", "desc"]
    )
);

export const getSelectedResource = createSelector(
  getSelectedResourceId,
  getInboxContents,
  (selectedResourceId, resources) =>
    resources.find(resource => resource.id === selectedResourceId) || {}
);

export const getIsOwnerOfSelectedResource = createSelector(
  getSelectedResource,
  getUser,
  (resource, user) =>
    user && resource && resource.owner && user.id === resource.owner.id
);

export const getResourceById = id => store =>
  [].concat(store.threads, store.events).find(r => r.id === id);
