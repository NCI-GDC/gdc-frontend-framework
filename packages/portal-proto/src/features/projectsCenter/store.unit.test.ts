import { AppStore, AppState } from "./appApi";

export const getInitialAppState = (): AppState => AppStore.getState();

test("placeholder", () => {
  expect(true).toBeTruthy();
});
