import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import * as core from "@gff/core";

describe("</Footer>", () => {
  const mockData = {
    apiCommitHash: "9fbb447b",
    apiVersion: "3.0.0",
    uiCommitHash: "9fbb447b",
    uiVersion: "1.30.0",
    dataRelease: "Data Release 34.0 - July 27, 2022",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreSelector").mockReturnValue(mockData);
  });

  it("renders the footer", () => {
    const { getByText } = render(<Footer />);
    expect(
      getByText("NIH... Turning Discovery Into Health ®"),
    ).toBeInTheDocument();
  });

  it("renders the proper UI version info title", () => {
    render(<Footer />);
    const el = screen.getByTestId("ftr-uiversion");
    expect(el.getAttribute("title")).toBe(
      `UI version: ${mockData.uiVersion}, tags: ${mockData.uiVersion}`,
    );
  });

  it("renders the proper UI version info text", () => {
    render(<Footer />);
    const el = screen.getByTestId("ftr-uiversion");
    expect(el).toHaveTextContent(
      `UI v${mockData.uiVersion} @ ${mockData.apiCommitHash}`,
    );
  });

  it("renders the proper API version info title", () => {
    render(<Footer />);
    const el = screen.getByTestId("ftr-apiversion");
    expect(el.getAttribute("title")).toBe(
      `API version: ${mockData.apiVersion}`,
    );
  });

  it("renders the proper API version info text", () => {
    render(<Footer />);
    const el = screen.getByTestId("ftr-apiversion");
    expect(el).toHaveTextContent(
      `API v${mockData.apiVersion} @ ${mockData.apiCommitHash}`,
    );
  });

  it("renders the proper data release info text", () => {
    render(<Footer />);
    const el = screen.getByTestId("ftr-release-notes");
    expect(el).toHaveTextContent(mockData.dataRelease);
  });
});
