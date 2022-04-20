import { useState, useEffect, useMemo } from "react";
import { Tooltip } from "@mantine/core";
import { fetchPValue } from "@gff/core";

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
  const [pValue, setPValue] = useState(null);
  const pValueBuckets = useMemo(
    () => data.map((val) => val.filter((v) => !noDataKeys.includes(v.key))),
    [data],
  );

  const labels = Array.from(
    new Set(
      pValueBuckets.map((bucket) => bucket.map((facet) => facet.key)).flat(),
    ),
  );

  useEffect(() => {
    const determinePValue = async () => {
      if (
        pValueBuckets.length > 0 &&
        pValueBuckets.every((bucket) => bucket.length === 2)
      ) {
        const values = pValueBuckets.map((bucket) =>
          bucket.map((facet) => facet.count),
        );
        const pValue = await fetchPValue(values);

        setPValue(pValue);
      } else {
        setPValue(null);
      }
    };
    determinePValue();
  }, [JSON.stringify(pValueBuckets), JSON.stringify(data)]);

  if (pValue) {
    return (
      <Tooltip
        label={`P-Value for ${labels.join(" and ")}`}
        withArrow
      >{`P-Value = ${pValue.toPrecision(3)}`}</Tooltip>
    );
  } else {
    return null;
  }
};

export default PValue;
