import { DataStatus } from "@gff/core";

function ShowingCount({
  from,
  total,
  label,
  customPluralLabel = undefined,
  dataLength,
  status,
  pageSize,
  customDataTestID = "text-showing-count",
}: {
  from: number;
  total: number;
  label: string;
  customPluralLabel?: string;
  dataLength: number;
  status: DataStatus;
  pageSize: number;
  customDataTestID?: string;
}) {
  let outputString: JSX.Element | null = null;

  if (!isNaN(from) && status === "fulfilled") {
    const paginationFrom = from >= 0 && dataLength > 0 ? from + 1 : 0;
    const paginationTo = Math.min(from + pageSize, total);
    const fromValue = paginationFrom?.toLocaleString();
    const toValue = paginationTo?.toLocaleString();
    const totalValue = total?.toLocaleString();
    const pluralizedLabel =
      label && total > 1 ? customPluralLabel || `${label}s` : label;

    outputString = (
      <span>
        <b>{fromValue}</b> - <b>{toValue}</b> of <b>{totalValue}</b>
        {label && ` ${pluralizedLabel}`}
      </span>
    );
  }

  return (
    <p data-testid={customDataTestID} className="text-heading text-sm">
      Showing {outputString ?? "--"}
    </p>
  );
}

export default ShowingCount;
