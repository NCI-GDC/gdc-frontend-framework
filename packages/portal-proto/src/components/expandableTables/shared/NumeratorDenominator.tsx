const NumeratorDenominator = ({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}): JSX.Element => (
  <div
    className="flex flex-wrap font-content p-0.5"
    data-testid="numeratorDenominatorTest"
  >
    <div className="whitespace-break-spaces mx-auto">
      <span>{denominator === 0 ? 0 : numerator.toLocaleString()}</span>
      <span className="mx-0.5">&#47;</span>
      <span className="mr-0.5">{denominator.toLocaleString()}</span>
    </div>
    <div className="flex mx-auto">
      (
      {numerator === 0 || denominator === 0
        ? "0.00%"
        : (numerator / denominator).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          })}
      )
    </div>
  </div>
);

export default NumeratorDenominator;
