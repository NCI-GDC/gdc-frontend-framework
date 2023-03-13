export const NumeratorDenominator = ({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}): JSX.Element => (
  <span className="flex gap-1">
    <span>{numerator.toLocaleString()}</span>
    <span>&#47;</span>
    <span>{denominator.toLocaleString()}</span>
    <span>
      (
      {numerator === 0 || denominator === 0
        ? "0.00%"
        : (numerator / denominator || 1).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          })}
      )
    </span>
  </span>
);
