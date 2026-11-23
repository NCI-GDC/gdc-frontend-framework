import { isUserAuthChange, UserAuth } from "./usersSlice";

const alice: UserAuth = {
  username: "alice",
  projects: { gdc_ids: { "TCGA-BRCA": ["read"] }, phs_ids: {} },
};
const loggedOut: UserAuth = { username: null, projects: null };

describe("isUserAuthChange", () => {
  test("is false for the first /auth/user answer", () => {
    expect(isUserAuthChange(null, alice)).toBe(false);
  });

  test("is false when the same user comes back", () => {
    const aliceAgain: UserAuth = {
      username: "alice",
      projects: { gdc_ids: { "TCGA-BRCA": ["read"] }, phs_ids: {} },
    };
    expect(isUserAuthChange(alice, aliceAgain)).toBe(false);
  });

  test("is true when a user logs in", () => {
    expect(isUserAuthChange(loggedOut, alice)).toBe(true);
  });

  test("is true when the user logs out", () => {
    expect(isUserAuthChange(alice, loggedOut)).toBe(true);
  });

  test("is true when the user's project access changes", () => {
    const aliceWithMoreAccess: UserAuth = {
      username: "alice",
      projects: {
        gdc_ids: { "TCGA-BRCA": ["read"], "TCGA-LUAD": ["read"] },
        phs_ids: {},
      },
    };
    expect(isUserAuthChange(alice, aliceWithMoreAccess)).toBe(true);
  });
});
