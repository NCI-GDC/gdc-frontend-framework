import { configureStore } from "@reduxjs/toolkit";
import { coreCreateApi, userAuthTagInvalidators } from "./coreCreateApi";

const baseQuery = jest.fn(() => ({ data: "result" }));

const testApi = coreCreateApi({
  reducerPath: "userAuthTagTestApi",
  baseQuery,
  tagTypes: ["Own"],
  endpoints: (builder) => ({
    untagged: builder.query<string, void>({ query: () => "untagged" }),
    taggedWithArray: builder.query<string, void>({
      query: () => "array",
      providesTags: ["Own"],
    }),
    taggedWithFunction: builder.query<string, void>({
      query: () => "function",
      providesTags: (result) => [{ type: "Own", id: result }],
    }),
  }),
});

const setupStore = () => {
  const store = configureStore({
    reducer: { [testApi.reducerPath]: testApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(testApi.middleware),
  });
  const settle = () =>
    Promise.all(store.dispatch(testApi.util.getRunningQueriesThunk()));
  const invalidateUserAuthTag = () => {
    userAuthTagInvalidators.forEach((invalidate) =>
      store.dispatch(invalidate()),
    );
    return settle();
  };
  return { store, settle, invalidateUserAuthTag };
};

describe("coreCreateApi user auth tag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("refetches a subscribed query when the user auth tag is invalidated", async () => {
    const { store, invalidateUserAuthTag } = setupStore();
    await store.dispatch(testApi.endpoints.untagged.initiate());

    await invalidateUserAuthTag();

    expect(baseQuery).toHaveBeenCalledTimes(2);
  });

  test.each([
    ["taggedWithArray", "Own"],
    ["taggedWithFunction", { type: "Own", id: "result" }],
  ] as const)(
    "keeps the tags %s already provides",
    async (endpointName, ownTag) => {
      const { store, settle, invalidateUserAuthTag } = setupStore();
      await store.dispatch(testApi.endpoints[endpointName].initiate());

      store.dispatch(testApi.util.invalidateTags([ownTag]));
      await settle();
      await invalidateUserAuthTag();

      expect(baseQuery).toHaveBeenCalledTimes(3);
    },
  );
});
