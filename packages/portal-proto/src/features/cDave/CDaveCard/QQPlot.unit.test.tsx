import { getQ1Q3Line } from "./QQPlot";

describe("getQ1Q3Line", () => {
  it("draws line through Q1 and Q3 of data", () => {
    const chartData = [
      { x: 1, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },
      { x: 6, y: 6 },
    ];

    expect(getQ1Q3Line(chartData)).toEqual([
      {
        x: 2.6666666666666665,
        y: 1,
      },
      {
        x: 3,
        y: 2,
      },
      {
        x: 4,
        y: 5,
      },
      {
        x: 4.333333333333333,
        y: 6,
      },
    ]);
  });
});
