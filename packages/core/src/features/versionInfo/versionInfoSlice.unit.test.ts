import {
  versionInfoReducer,
  VersionInfoResponse,
  versionInfoSliceInitialStateInterface,
  fetchVersionInfo,
} from "./versionInfoSlice";

const initialState: versionInfoSliceInitialStateInterface = {
  data: undefined,
  status: "uninitialized",
  requestId: "test",
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
      meta: { requestId: "test" },
      payload: { ...mockData },
    });
    expect(state).toEqual({
      data: mockData,
      status: "fulfilled",
      requestId: "test",
    });
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
        meta: { requestId: "test" },
      },
    );
    expect(state).toEqual({ status: "pending", requestId: "test" });
  });
});
