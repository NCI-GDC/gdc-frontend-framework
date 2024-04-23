import { useMemo } from "react";
import { Tooltip } from "@mantine/core";
import { usePValueQuery } from "@gff/core";

const noDataKeys = [
  "missing",
  "not reported",
  "unknown",
  "not allowed to collect",
  "unspecified",
];

interface PValueProps {
  readonly data: Array<
    Array<{
      readonly key: string;
      readonly count: number;
    }>
  >;
}

const PValue: React.FC<PValueProps> = ({ data }: PValueProps) => {
  const pValueBuckets = useMemo(
    () => data.map((val) => val.filter((v) => !noDataKeys.includes(v.key))),
    [data],
  );

  const labels = Array.from(
    new Set(
      pValueBuckets.map((bucket) => bucket.map((facet) => facet.key)).flat(),
    ),
  );

  const values = useMemo(
    () => pValueBuckets.map((bucket) => bucket.map((facet) => facet.count)),
    [pValueBuckets],
  );

  const { data: pValue, isSuccess } = usePValueQuery(values, {
    skip:
      pValueBuckets.length === 0 ||
      !pValueBuckets.every((bucket) => bucket.length === 2),
  });

  if (pValue) {
    return (
      <Tooltip label={`P-Value for ${labels.join(" and ")}`} withArrow>
        <div className="font-content text-sm font-semibold">
          {isSuccess ? `P-Value = ${pValue.toExponential(2)}` : "--"}
        </div>
      </Tooltip>
    );
  } else {
    return null;
  }
};

export default PValue;
