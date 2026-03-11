import { coreStore, CoreState } from "./store";

export const getInitialCoreState = (): CoreState => coreStore.getState();

test("placeholder", () => {
  expect(true).toBeTruthy();
});
