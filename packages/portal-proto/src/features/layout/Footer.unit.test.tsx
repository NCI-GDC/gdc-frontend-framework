import { render } from "@testing-library/react";
import { Footer } from "./Footer";

describe("</Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the footer", () => {
    const { getByText } = render(<Footer />);

    expect(
      getByText("NIH... Turning Discovery Into Health ®"),
    ).toBeInTheDocument();
  });
});
