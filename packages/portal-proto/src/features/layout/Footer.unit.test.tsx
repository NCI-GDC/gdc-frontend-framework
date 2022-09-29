import { render } from "@testing-library/react";
import { Footer } from "./Footer";
import * as core from "@gff/core";

describe("</Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the footer", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      data: {
        apiCommitHash: "9fbb447b",
        apiVersion: "3.0.0",
        uiCommitHash: "9fbb447b",
        uiVersion: "1.30.0",
        dataRelease: "Data Release 34.0 - July 27, 2022",
      },
    });
    const { getByText } = render(<Footer />);

    expect(
      getByText("NIH... Turning Discovery Into Health ®"),
    ).toBeInTheDocument();
  });
});
