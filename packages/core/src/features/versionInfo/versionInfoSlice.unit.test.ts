import { selectVersionInfo } from "./versionInfoSlice";
import { getInitialCoreState } from "../../store.unit.test";

const mockData = {
  apiCommitHash: "9fbb447b",
  apiVersion: "3.0.0",
  uiCommitHash: "9fbb436b",
  uiVersion: "1.30.0",
  dataRelease: "Data Release 34.0 - July 27, 2022",
};

describe("select version info", () => {
  const state = getInitialCoreState();

  it("Selects app version info", () => {
    const versionInfo = selectVersionInfo({
      ...state,
      versionInfo: mockData,
    });

    expect(versionInfo).toEqual(mockData);
  });
});
