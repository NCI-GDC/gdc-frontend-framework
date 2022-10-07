import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import * as core from "@gff/core";

describe("</Footer>", () => {
  const mockData = {
    data: {
      data_release: "Data Release 34.0 - July 27, 2022",
    },
    status: "fulfilled",
  };

  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => dispatch);
  });

  it("renders the footer", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue(mockData);
    const { getByText } = render(<Footer />);
    expect(
      getByText("NIH... Turning Discovery Into Health ®"),
    ).toBeInTheDocument();
  });

  it("renders the proper data release info text", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue(mockData);
    render(<Footer />);
    const el = screen.getByTestId("ftr-release-notes");
    expect(el).toHaveTextContent(mockData.data.data_release);
  });
});
