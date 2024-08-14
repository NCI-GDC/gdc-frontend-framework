import { DataStatus } from "@gff/core";

function ShowingCount({
  from,
  total,
  label,
  dataLength,
  status,
  pageSize,
  customDataTestID = "text-showing-count",
}: {
  from: number;
  total: number;
  label: string;
  dataLength: number;
  status: DataStatus;
  pageSize: number;
  customDataTestID?: string;
}) {
  let outputString: JSX.Element | null = null;

  if (!isNaN(from) && status === "fulfilled") {
    const paginationFrom = from >= 0 && dataLength > 0 ? from + 1 : 0;
    const paginationTo = Math.min(from + pageSize, total);
    const totalValue = total.toLocaleString();
    const updatedLabel = label && total > 1 ? `${label}s` : label;

    outputString = (
      <span>
        <b>{paginationFrom}</b> - <b>{paginationTo}</b> of <b>{totalValue}</b>
        {label && ` ${updatedLabel}`}
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
