import { coreStore } from "../../store";
import { startCoreListening } from "../../listeners";
import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { userAuthApi, userAuthChanged } from "./usersSlice";

const probeApi = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    userAuthProbe: builder.query<unknown, void>({
      query: () => ({ graphQLQuery: "query Probe", graphQLFilters: {} }),
    }),
  }),
});

const anonymous = () => Promise.resolve({ ok: false, status: 401 });

const loggedInAs = (username: string) => () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ username }),
  });

const networkError = () => Promise.reject(new TypeError("Failed to fetch"));

const serverError = () => Promise.resolve({ ok: false, status: 503 });

let userResponse: () => Promise<unknown>;

const fakeGdcBackend = (url: string) => {
  if (url.endsWith("/user")) return userResponse();
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  });
};

const fetchUserAs = async (response: () => Promise<unknown>) => {
  userResponse = response;
  await coreStore.dispatch(
    userAuthApi.endpoints.fetchUserDetails.initiate(undefined, {
      subscribe: false,
      forceRefetch: true,
    }),
  );
};

describe("user auth changes", () => {
  const authChanges = jest.fn();
  const fetchSpy: jest.SpyInstance = jest
    .spyOn(global, "fetch")
    .mockImplementation(jest.fn(fakeGdcBackend) as jest.Mock);
  startCoreListening({
    actionCreator: userAuthChanged,
    effect: (action) => authChanges(action.payload),
  });

  const requestsTo = (path: string) =>
    fetchSpy.mock.calls.filter(([url]) => url.endsWith(path)).length;

  afterAll(() => {
    coreStore.dispatch(userAuthApi.util.resetApiState());
    coreStore.dispatch(graphqlAPISlice.util.resetApiState());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    coreStore.dispatch(userAuthApi.util.resetApiState());
  });

  test("dispatches when an anonymous user logs in", async () => {
    await fetchUserAs(anonymous);
    await fetchUserAs(loggedInAs("alice"));

    expect(authChanges.mock.calls).toEqual([[{ username: "alice" }]]);
  });

  test("dispatches when a user logs out or their session expires", async () => {
    await fetchUserAs(loggedInAs("alice"));
    await fetchUserAs(anonymous);

    expect(authChanges.mock.calls).toEqual([[{ username: null }]]);
  });

  test("dispatches when a different user is logged in", async () => {
    await fetchUserAs(loggedInAs("alice"));
    await fetchUserAs(loggedInAs("bob"));

    expect(authChanges.mock.calls).toEqual([[{ username: "bob" }]]);
  });

  test("does not dispatch on the first user details response", async () => {
    await fetchUserAs(loggedInAs("alice"));

    expect(authChanges).not.toHaveBeenCalled();
  });

  test("does not dispatch when the same user is fetched again", async () => {
    await fetchUserAs(loggedInAs("alice"));
    await fetchUserAs(loggedInAs("alice"));

    expect(authChanges).not.toHaveBeenCalled();
  });

  test("does not dispatch when the same user is back after a network error", async () => {
    await fetchUserAs(loggedInAs("alice"));
    await fetchUserAs(networkError);
    await fetchUserAs(loggedInAs("alice"));

    expect(authChanges).not.toHaveBeenCalled();
  });

  test("does not dispatch when the same user is back after a server error", async () => {
    await fetchUserAs(loggedInAs("alice"));
    await fetchUserAs(serverError);
    await fetchUserAs(loggedInAs("alice"));

    expect(authChanges).not.toHaveBeenCalled();
  });

  test("dispatches for a login after an error on first load", async () => {
    await fetchUserAs(networkError);
    await fetchUserAs(loggedInAs("alice"));

    expect(authChanges.mock.calls).toEqual([[{ username: "alice" }]]);
  });

  test("does not ask for the user details again after a user change", async () => {
    userResponse = anonymous;
    const subscription = coreStore.dispatch(
      userAuthApi.endpoints.fetchUserDetails.initiate(),
    );
    await subscription;

    await fetchUserAs(loggedInAs("alice"));
    await Promise.all(
      coreStore.dispatch(userAuthApi.util.getRunningQueriesThunk()),
    );

    expect(requestsTo("/user")).toBe(2);
    subscription.unsubscribe();
  });

  test("refetches active data queries when the user changes", async () => {
    await fetchUserAs(anonymous);
    await coreStore.dispatch(probeApi.endpoints.userAuthProbe.initiate());
    fetchSpy.mockClear();

    await fetchUserAs(loggedInAs("alice"));
    await Promise.all(
      coreStore.dispatch(graphqlAPISlice.util.getRunningQueriesThunk()),
    );

    expect(requestsTo("/graphql")).toBe(1);
  });
});
