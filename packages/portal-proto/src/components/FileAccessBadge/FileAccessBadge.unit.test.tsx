import { render } from "@testing-library/react";
import { FileAccessBadge } from ".";

describe("<FileAccessBadge />", () => {
  it("certain class with shade of green for open access", () => {
    const { getByTestId } = render(<FileAccessBadge access="open" />);
    expect(getByTestId("badgeElement")).toHaveClass(
      "font-heading bg-nci-green-lighter/50 text-nci-green-darkest capitalize text-xs",
    );
  });

  it("certain class with shade of red for controlled access", () => {
    const { getByTestId } = render(<FileAccessBadge access="controlled" />);
    expect(getByTestId("badgeElement")).toHaveClass(
      "font-heading bg-nci-red-lighter/50 text-nci-red-darkest capitalize text-xs",
    );
  });
});
