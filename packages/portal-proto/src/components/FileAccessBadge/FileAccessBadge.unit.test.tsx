import { render } from "@testing-library/react";
import { FileAccessBadge } from ".";

describe("<FileAccessBadge />", () => {
  it("certain class with shade of green for open access", () => {
    const { getByTestId } = render(<FileAccessBadge access="open" />);
    expect(getByTestId("badgeElement")).toHaveClass(
      "capitalize text-xs font-bold bg-accent-cool-light text-accent-cool-dark bg-opacity-15",
    );
  });

  it("certain class with shade of red for controlled access", () => {
    const { getByTestId } = render(<FileAccessBadge access="controlled" />);
    expect(getByTestId("badgeElement")).toHaveClass(
      "capitalize text-xs font-bold bg-nci-red-lighter/50 text-nci-red-darkest",
    );
  });
});
