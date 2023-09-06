// Takes an array of strings, sorts it out in ascending and creates a comma separated spans.
export const ArraySeparatedSpan = ({
  data,
}: {
  data: string[];
}): JSX.Element => (
  <div className="w-96">
    {data.length > 0 ? (
      data
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((datum, idx) => (
          <span key={`datum-${idx}`} data-testid="item-span">
            {datum}
            {idx < data.length - 1 && ", "}
          </span>
        ))
    ) : (
      <span>--</span>
    )}
  </div>
);