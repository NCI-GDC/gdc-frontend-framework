import { coreStore } from "./store";
import { CoreState } from "./reducers";

export const getInitialCoreState = (): CoreState => coreStore.getState();

test("placeholder", () => {
  expect(true).toBeTruthy();
});
