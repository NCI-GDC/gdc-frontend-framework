import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useVersionInfoDetails: jest.fn().mockReturnValue({
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
  }),
}));

describe("</Footer>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the footer", () => {
    const { getByText } = render(<Footer />);
    expect(
      getByText("NIH... Turning Discovery Into Health"),
    ).toBeInTheDocument();
  });

  it("renders the proper data release info text", () => {
    render(<Footer />);
    const el = screen.getByTestId("text-footer-release-notes");
    expect(el).toHaveTextContent("Data Release 34.0 - July 27, 2022");
  });

  it("renders the proper api release info", () => {
    render(<Footer />);
    const el = screen.getByTestId("ftr-api-release");
    expect(el).toHaveTextContent(`API vtest2 @ 13c988d4`);
  });
});
