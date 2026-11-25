import { configureStore } from "@reduxjs/toolkit";
import { coreCreateApi, userAuthTagInvalidators } from "./coreCreateApi";

test("a user change refetches queries of APIs built with coreCreateApi", async () => {
  const baseQuery = jest.fn(() => ({ data: "result" }));
  const api = coreCreateApi({
    reducerPath: "testApi",
    baseQuery,
    endpoints: (builder) => ({
      item: builder.query<string, void>({ query: () => "item" }),
    }),
  });
  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
  await store.dispatch(api.endpoints.item.initiate());

  userAuthTagInvalidators.forEach((invalidate) => store.dispatch(invalidate()));
  // wait for the refetch to finish
  await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));

  expect(baseQuery).toHaveBeenCalledTimes(2);
});
