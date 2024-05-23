import { render } from "test-utils";
import NumeratorDenominator from "./NumeratorDenominator";

describe("<NumeratorDenominator />", () => {
  it("should return correct for non zero numerator and denominator", () => {
    const { getByTestId } = render(
      <NumeratorDenominator numerator={283} denominator={490} />,
    );
    expect(getByTestId("numeratorDenominatorTest")).toHaveTextContent(
      "283/490(57.76%)",
    );
  });

  it("should return correct for numerator which is 0", () => {
    const { getByTestId } = render(
      <NumeratorDenominator numerator={0} denominator={490} />,
    );

    expect(getByTestId("numeratorDenominatorTest")).toHaveTextContent(
      "0/490(0.00%)",
    );
  });

  it("should return correct for denominator which is 0", () => {
    const { getByTestId } = render(
      <NumeratorDenominator numerator={12} denominator={0} />,
    );

    expect(getByTestId("numeratorDenominatorTest")).toHaveTextContent(
      "0/0(0.00%)",
    );
  });
});
