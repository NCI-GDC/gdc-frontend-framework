const NumeratorDenominator = ({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}): JSX.Element => (
  <div
    className="flex flex-wrap font-content ml-0"
    data-testid="numeratorDenominatorTest"
  >
    <div>
      <span>{denominator === 0 ? 0 : numerator.toLocaleString()}</span>
      <span className="mx-1">&#47;</span>
      <span className="mr-1">{denominator.toLocaleString()}</span>
    </div>
    <div>
      (
      <span>
        {numerator === 0 || denominator === 0
          ? "0.00%"
          : (numerator / denominator).toLocaleString(undefined, {
              style: "percent",
              minimumFractionDigits: 2,
            })}
      </span>
      )
    </div>
  </div>
);

export default NumeratorDenominator;
