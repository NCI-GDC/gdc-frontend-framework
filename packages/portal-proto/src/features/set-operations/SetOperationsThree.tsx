import { SetOperations } from "./SetOperations";
import { SetOperationsExternalProps } from "./types";
import { createSetFiltersByKey } from "./utils";

export const SetOperationsThree: React.FC<SetOperationsExternalProps> = ({
  sets,
  entityType,
  queryHook,
  countHook,
}: SetOperationsExternalProps) => {
  const intersectionFilters = createSetFiltersByKey(
    "S1_intersect_S2_intersect_S3",
    entityType,
    sets,
  );
  const { data: intersectionData } = queryHook({
    filters: {
      filters: intersectionFilters,
    },
  });

  const s1IntersectS2MinusS3DataFilters = createSetFiltersByKey(
    "S1_intersect_S2_minus_S3",
    entityType,
    sets,
  );
  const { data: s1IntersectS2MinusS3Data } = queryHook({
    filters: {
      filters: s1IntersectS2MinusS3DataFilters,
    },
  });

  const s2IntersectS3MinusS1DataFilters = createSetFiltersByKey(
    "S2_intersect_S3_minus_S1",
    entityType,
    sets,
  );
  const { data: s2IntersectS3MinusS1Data } = queryHook({
    filters: {
      filters: s2IntersectS3MinusS1DataFilters,
    },
  });

  const s1IntersectS3MinusS2Filters = createSetFiltersByKey(
    "S1_intersect_S3_minus_S2",
    entityType,
    sets,
  );
  const { data: s1IntersectS3MinusS2 } = queryHook({
    filters: {
      filters: s1IntersectS3MinusS2Filters,
    },
  });

  const s1MinusS2UnionS3Filters = createSetFiltersByKey(
    "S1_minus_S2_union_S3",
    entityType,
    sets,
  );
  const { data: s1MinusS2UnionS3 } = queryHook({
    filters: {
      filters: s1MinusS2UnionS3Filters,
    },
  });

  const s2MinusS1UnionS3Filters = createSetFiltersByKey(
    "S2_minus_S1_union_S3",
    entityType,
    sets,
  );
  const { data: s2MinusS1UnionS3 } = queryHook({
    filters: {
      filters: s2MinusS1UnionS3Filters,
    },
  });

  const s3MinusS1UnionS2Filters = createSetFiltersByKey(
    "S3_minus_S1_union_S2",
    entityType,
    sets,
  );
  const { data: s3MinusS1UnionS2 } = queryHook({
    filters: {
      filters: s3MinusS1UnionS2Filters,
    },
  });

  const data = [
    {
      label: "( S1 ∩ S2 ∩ S3 )",
      key: "S1_intersect_S2_intersect_S3",
      value: intersectionData,
    },
    {
      label: "( S1 ∩ S2 ) - ( S3 )",
      key: "S1_intersect_S2_minus_S3",
      value: s1IntersectS2MinusS3Data,
    },
    {
      label: "( S2 ∩ S3 ) - ( S1 )",
      key: "S2_intersect_S3_minus_S1",
      value: s2IntersectS3MinusS1Data,
    },
    {
      label: "( S1 ∩ S3 ) - ( S2 )",
      key: "S1_intersect_S3_minus_S2",
      value: s1IntersectS3MinusS2,
    },
    {
      label: "( S1 ) - ( S2 ∪ S3 )",
      key: "S1_minus_S2_union_S3",
      value: s1MinusS2UnionS3,
    },
    {
      label: "( S2 ) - ( S1 ∪ S3 )",
      key: "S2_minus_S1_union_S3",
      value: s2MinusS1UnionS3,
    },
    {
      label: "( S3 ) - ( S1 ∪ S2 )",
      key: "S3_minus_S1_union_S2",
      value: s3MinusS1UnionS2,
    },
  ];

  return (
    <SetOperations
      sets={sets}
      entityType={entityType}
      data={data}
      queryHook={queryHook}
      countHook={countHook}
    />
  );
};
