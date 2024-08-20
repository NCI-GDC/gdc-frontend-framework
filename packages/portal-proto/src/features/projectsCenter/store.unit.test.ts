import { AppStore, AppState } from "./appApi";

export const getInitialAppState = (): AppState => AppStore.getState();

test("initial state", () => {
  expect(getInitialAppState()).toEqual({
    projectApp: {
      filters: {
        mode: "and",
        root: {},
      },
    },
    projectExpandedState: {},
  });
});
