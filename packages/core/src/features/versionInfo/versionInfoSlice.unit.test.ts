import {
  versionInfoReducer,
  VersionInfoResponse,
  versionInfoSliceInitialStateInterface,
  fetchVersionInfo,
} from "./versionInfoSlice";

const initialState: versionInfoSliceInitialStateInterface = {
  data: undefined,
  status: "uninitialized",
};

describe("select version info", () => {
  test("should return the default state for unknown actions", () => {
    const state = versionInfoReducer(initialState, { type: "asdf" });
    expect(state).toEqual(initialState);
  });

  test("should return data with fulfilled status", () => {
    const mockData: VersionInfoResponse = {
      commit: "WWW",
      data_release: "XXX",
      tag: "YYY",
      version: "ZZZ",
    };

    const state = versionInfoReducer(initialState, {
      type: fetchVersionInfo.fulfilled,
      payload: { ...mockData },
    });
    expect(state).toEqual({ data: mockData, status: "fulfilled" });
  });

  test("return state with rejected status", () => {
    const state = versionInfoReducer(
      { status: "uninitialized" },
      {
        type: fetchVersionInfo.rejected,
      },
    );
    expect(state).toEqual({ status: "rejected" });
  });

  test("return state with pending status", () => {
    const state = versionInfoReducer(
      { status: "uninitialized" },
      {
        type: fetchVersionInfo.pending,
      },
    );
    expect(state).toEqual({ status: "pending" });
  });
});
