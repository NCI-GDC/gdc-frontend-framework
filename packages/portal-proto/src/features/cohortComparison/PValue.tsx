import { fetchPValue } from "@gff/core";

const noDataKeys = [
  "_missing",
  "not reported",
  "unknown",
  "not allowed to collect",
];

const PValue = ({ values }) => {
  // [[], []]
  const pValueBuckets = values
    .filter((v) => noDataKeys.includes(v.key))
    .map((v) => v);

  if (pValueBuckets.every((bucket) => bucket.length === 2)) {
    const data = fetchPValue(values);
    return <>{`P-Value = ${data}`}</>;
  } else {
    return null;
  }
};

export default PValue;
