import { selectSessionId } from "./sessionSlice";

describe("sessionSlice", () => {
  test("session id can be selected", () => {
    const sessionId = selectSessionId({
      session: { sessionId: "sessionId-1" },
      cohort: {},
    });
    expect(sessionId).toEqual("sessionId-1");
  });
});
