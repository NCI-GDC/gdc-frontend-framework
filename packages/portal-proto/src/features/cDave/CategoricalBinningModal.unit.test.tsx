import { flattenGroups } from "./CategoricalBinningModal";

describe("<CategoricalBinningModal", () => {
  it("flattenGroups", () => {
    expect(
      flattenGroups({
        male: 800,
        "custom group": { female: 90, unspecified: 100 },
      }),
    ).toEqual({
      male: 800,
      female: 90,
      unspecified: 100,
    });
  });
});
