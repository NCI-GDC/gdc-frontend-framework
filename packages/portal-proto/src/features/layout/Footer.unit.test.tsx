import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import * as core from "@gff/core";

describe("</Footer>", () => {
  const mockData = {
    data: {
      data_release: "Data Release 34.0 - July 27, 2022",
      commit: "13c988d4f15e06bcdd0b0af290086a30test0001",
      tag: "test2",
      version: "test3",
    },
    status: "fulfilled",
    isUninitialized: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useVersionInfoDetails").mockImplementation(jest.fn());
  });

  it("renders the footer", () => {
    jest.spyOn(core, "useVersionInfoDetails").mockReturnValue(mockData);
    const { getByText } = render(<Footer />);
    expect(
      getByText("NIH... Turning Discovery Into Health"),
    ).toBeInTheDocument();
  });

  it("renders the proper data release info text", () => {
    jest.spyOn(core, "useVersionInfoDetails").mockReturnValue(mockData);
    render(<Footer />);
    const el = screen.getByTestId("text-footer-release-notes");
    expect(el).toHaveTextContent(mockData.data.data_release);
  });

  it("renders the proper api release info", () => {
    jest.spyOn(core, "useVersionInfoDetails").mockReturnValue(mockData);
    render(<Footer />);
    const el = screen.getByTestId("ftr-api-release");
    expect(el).toHaveTextContent(
      `API v${mockData.data.tag} @ ${mockData.data.commit?.slice(0, 8)}`,
    );
  });
});
