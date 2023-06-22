const NumeratorDenominator = ({
  numerator,
  denominator,
  boldNumerator = false,
}: {
  numerator: number;
  denominator: number;
  boldNumerator?: boolean;
}): JSX.Element => (
  <span
    className="flex flex-wrap font-content"
    data-testid="numeratorDenominatorTest"
  >
    <span className={boldNumerator ? "font-bold" : undefined}>
      {denominator === 0 ? 0 : numerator.toLocaleString()}
    </span>
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

export default NumeratorDenominator;
