export const NumeratorDenominator = ({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}): JSX.Element => (
  <span
    className="flex flex-wrap font-content"
    data-testid="numeratorDenominatorTest"
  >
    <span>{denominator === 0 ? 0 : numerator.toLocaleString()}</span>
    <span className="mx-0.5">&#47;</span>
    <span className="mr-0.5">{denominator.toLocaleString()}</span>
    <span>
      (
      {numerator === 0 || denominator === 0
        ? "0.00%"
        : (numerator / denominator).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          })}
      )
    </span>
  </span>
);
