export const NumeratorDenominator = ({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}): JSX.Element => (
  <span className="flex gap-1">
    <span className="">{numerator.toLocaleString()}</span>
    <span>/</span>
    <span className="">{denominator.toLocaleString()}</span>
    <span>
      (
      {denominator === 0
        ? "0.00%"
        : (numerator / denominator || 1).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
          })}
      )
    </span>
  </span>
);
