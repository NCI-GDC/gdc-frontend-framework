import { render } from "@testing-library/react";
import { SingularOrPluralSpan } from "./SingularOrPluralSpan";

describe("<SingularOrPluralSpan />", () => {
  it("should show plural form of the title when count is > 1", () => {
    const { getByText } = render(
      <SingularOrPluralSpan count={10} title="Test" />,
    );
    expect(getByText("10") && getByText("Tests")).toBeInTheDocument();
  });

  it("should show singular form of the title when count is <= 1", () => {
    const { getByText } = render(
      <SingularOrPluralSpan count={1} title="Test" />,
    );
    expect(getByText("1") && getByText("Test")).toBeInTheDocument();
  });
});
