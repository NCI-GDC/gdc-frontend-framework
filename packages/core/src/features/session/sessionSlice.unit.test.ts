import { getInitialCoreState } from "../../store.unit.test";
import { selectSessionId } from "./sessionSlice";

describe("sessionSlice", () => {
  test("session id can be selected", () => {
    const sessionId = selectSessionId({
      ...getInitialCoreState(),
      session: { sessionId: "sessionId-1" },
    });
    expect(sessionId).toEqual("sessionId-1");
  });
});
