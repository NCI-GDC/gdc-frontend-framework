import { createBuckets } from "./utils";

describe("createBuckets", () => {
  it("standard bucket", () => {
    const stats = {
      count: 1068,
      max: 32475,
      min: 7201,
    };

    expect(createBuckets(stats)).toEqual([
      { from: 7201, to: 12255.8 },
      { from: 12255.8, to: 17310.6 },
      { from: 17310.6, to: 22365.4 },
      { from: 22365.4, to: 27420.2 },
      { from: 27420.2, to: 32476 },
    ]);
  });

  it("zero only bucket", () => {
    const stats = {
      count: 1,
      max: 0,
      min: 0,
    };

    expect(createBuckets(stats)).toEqual([{ from: 0, to: 1 }]);
  });
});
