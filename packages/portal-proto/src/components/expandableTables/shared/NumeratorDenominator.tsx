const NumeratorDenominator = ({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}): JSX.Element => (
  <div
    className="flex flex-wrap justify-center font-content ml-1"
    data-testid="numeratorDenominatorTest"
  >
    <div className="table mr-1">
      <span>{denominator === 0 ? 0 : numerator.toLocaleString()}</span>
      <span className="mx-1">&#47;</span>
      <span className="mr-0.5">{denominator.toLocaleString()}</span>
    </div>
    <div className="table ml-0">
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
