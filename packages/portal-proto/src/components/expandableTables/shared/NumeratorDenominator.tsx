const NumeratorDenominator = ({
  project,
  numerator,
  denominator,
}: {
  project?: string;
  numerator: number;
  denominator: number;
}): JSX.Element => (
  <div
    className="flex [overflow-wrap:anywhere] font-content"
    data-testid="numeratorDenominatorTest"
  >
    {project ? <span className="font-bold mx-0.5">{project}:</span> : null}
    <div className="inline-block">
      <span>{denominator === 0 ? 0 : numerator.toLocaleString()}</span> &#47;{" "}
      <span>{denominator.toLocaleString()}</span>
      <span>
        {` (${
          numerator === 0 || denominator === 0
            ? "0.00%"
            : (numerator / denominator).toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              })
        }) `}
      </span>
    </div>
  </div>
);

export default NumeratorDenominator;
