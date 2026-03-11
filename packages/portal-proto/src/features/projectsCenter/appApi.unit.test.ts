import { reducers } from "./appApi";

test("initial state", () => {
  const state = reducers(undefined, { type: "TEST_INIT" });

  expect(state).toEqual({
    projectApp: {
      filters: {
        mode: "and",
        root: {},
      },
    },
    projectExpandedState: {},
  });
});
