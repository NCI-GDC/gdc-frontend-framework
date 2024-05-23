import { render } from "test-utils";
import { FileAccessBadge } from ".";

describe("<FileAccessBadge />", () => {
  it("certain class with shade of green for open access", () => {
    const { getByTestId } = render(<FileAccessBadge access="open" />);
    expect(getByTestId("badgeElement")).toHaveClass(
      "capitalize text-xs font-bold bg-nci-green-lighter/50 text-nci-green-darkest",
    );
  });

  it("certain class with shade of red for controlled access", () => {
    const { getByTestId } = render(<FileAccessBadge access="controlled" />);
    expect(getByTestId("badgeElement")).toHaveClass(
      "capitalize text-xs font-bold bg-nci-red-lighter/50 text-nci-red-darkest",
    );
  });
});
