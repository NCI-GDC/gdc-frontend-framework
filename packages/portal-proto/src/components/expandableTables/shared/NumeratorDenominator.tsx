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
    className="flex flex-wrap font-content min-w-[100px]"
    data-testid="numeratorDenominatorTest"
  >
    <span className={boldNumerator ? "font-bold flex-none" : "flex-none"}>
      {denominator === 0 ? 0 : numerator.toLocaleString()}
    </span>
    <span className="mx-0.5 flex-none">&#47;</span>
    <span className="mr-0.5 flex-none">{denominator.toLocaleString()}</span>
    <span className="flex-wrap">
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
