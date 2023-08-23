import React from "react";
import SubrowPrimarySiteDiseaseType from "../SubrowPrimarySiteDiseaseType";
import { Row } from "@tanstack/react-table";
import { render } from "@testing-library/react";

jest.mock("react-use", () => ({
  useMeasure: jest.fn(() => [
    jest.fn(),
    {
      height: 100,
      width: 100,
    },
  ]),
}));

jest.mock("@react-spring/web", () => ({
  useSpring: jest.fn().mockReturnValue({}),
  animated: {
    div: "div",
  },
}));

describe("SubrowPrimarySiteDiseaseType", () => {
  const mockData = {
    disease_type: ["Type A", "Type B"],
    primary_site: ["Site X", "Site Y"],
  };

  it("renders disease type values correctly", () => {
    const { getByText } = render(
      <SubrowPrimarySiteDiseaseType
        row={{ original: mockData } as Row<typeof mockData>}
        columnId="disease_type"
      />,
    );

    expect(getByText("Disease Type")).toBeInTheDocument();
    expect(getByText("Type A")).toBeInTheDocument();
    expect(getByText("Type B")).toBeInTheDocument();
  });

  it("renders primary site values correctly", () => {
    const { getByText } = render(
      <SubrowPrimarySiteDiseaseType
        row={{ original: mockData } as Row<typeof mockData>}
        columnId="primary_site"
      />,
    );

    expect(getByText("Primary Site")).toBeInTheDocument();
    expect(getByText("Site X")).toBeInTheDocument();
    expect(getByText("Site Y")).toBeInTheDocument();
  });
});
