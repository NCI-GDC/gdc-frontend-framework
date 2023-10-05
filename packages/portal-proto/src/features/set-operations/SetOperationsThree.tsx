import { useEffect } from "react";
import { SetOperations } from "./SetOperations";
import { SetOperationsExternalProps } from "./types";
import { createSetFiltersByKey, ENTITY_TYPE_TO_CREATE_SET_HOOK } from "./utils";

export const SetOperationsThree: React.FC<SetOperationsExternalProps> = ({
  sets,
  entityType,
  queryHook,
  countHook,
}: SetOperationsExternalProps) => {
  const [createSet1Intersection, intersectionResponse] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSetS1IntersectS2MinusS3, s1IntersectS2MinusS3Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSetS2IntersectS3MinusS1, s2IntersectS3MinusS1Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSetS1IntersectS3MinusS2, s1IntersectS3MinusS2Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSetS1MinusS2UnionS3, s1MinusS2UnionS3Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSetS2MinusS1UnionS3, s2MinusS1UnionS3Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSetS3MinusS1UnionS2, s3MinusS1UnionS2Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();

  const intersectionFilters = createSetFiltersByKey(
    "S1_intersect_S2_intersect_S3",
    entityType,
    sets,
  );
  const { data: intersectionData, isSuccess: isSuccessIntersection } =
    queryHook({
      filters: {
        filters: intersectionFilters,
      },
    });

  const s1IntersectS2MinusS3DataFilters = createSetFiltersByKey(
    "S1_intersect_S2_minus_S3",
    entityType,
    sets,
  );
  const {
    data: s1IntersectS2MinusS3Data,
    isSuccess: isSuccesS1IntersectS2MinusS3,
  } = queryHook({
    filters: {
      filters: s1IntersectS2MinusS3DataFilters,
    },
  });

  const s2IntersectS3MinusS1DataFilters = createSetFiltersByKey(
    "S2_intersect_S3_minus_S1",
    entityType,
    sets,
  );
  const {
    data: s2IntersectS3MinusS1Data,
    isSuccess: isSuccesS2IntersectS3MinusS1,
  } = queryHook({
    filters: {
      filters: s2IntersectS3MinusS1DataFilters,
    },
  });

  const s1IntersectS3MinusS2Filters = createSetFiltersByKey(
    "S1_intersect_S3_minus_S2",
    entityType,
    sets,
  );
  const {
    data: s1IntersectS3MinusS2,
    isSuccess: isSuccesS1IntersectS3MinusS2,
  } = queryHook({
    filters: {
      filters: s1IntersectS3MinusS2Filters,
    },
  });

  const s1MinusS2UnionS3Filters = createSetFiltersByKey(
    "S1_minus_S2_union_S3",
    entityType,
    sets,
  );
  const { data: s1MinusS2UnionS3, isSuccess: isSuccesS1MinusS2UnionS3 } =
    queryHook({
      filters: {
        filters: s1MinusS2UnionS3Filters,
      },
    });

  const s2MinusS1UnionS3Filters = createSetFiltersByKey(
    "S2_minus_S1_union_S3",
    entityType,
    sets,
  );
  const { data: s2MinusS1UnionS3, isSuccess: isSuccesS2MinusS1UnionS3 } =
    queryHook({
      filters: {
        filters: s2MinusS1UnionS3Filters,
      },
    });

  const s3MinusS1UnionS2Filters = createSetFiltersByKey(
    "S3_minus_S1_union_S2",
    entityType,
    sets,
  );
  const { data: s3MinusS1UnionS2, isSuccess: isSuccesS3MinusS1UnionS2 } =
    queryHook({
      filters: {
        filters: s3MinusS1UnionS2Filters,
      },
    });

  useEffect(() => {
    createSet1Intersection({ filters: intersectionFilters });
    createSetS1IntersectS2MinusS3({
      filters: s1IntersectS2MinusS3DataFilters,
    });
    createSetS2IntersectS3MinusS1({
      filters: s2IntersectS3MinusS1DataFilters,
    });
    createSetS1IntersectS3MinusS2({
      filters: s1IntersectS3MinusS2Filters,
    });
    createSetS1MinusS2UnionS3({ filters: s1MinusS2UnionS3Filters });
    createSetS2MinusS1UnionS3({ filters: s2MinusS1UnionS3Filters });
    createSetS3MinusS1UnionS2({ filters: s3MinusS1UnionS2Filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAllSuccess = [
    isSuccessIntersection,
    isSuccesS1IntersectS2MinusS3,
    isSuccesS2IntersectS3MinusS1,
    isSuccesS1IntersectS3MinusS2,
    isSuccesS1MinusS2UnionS3,
    isSuccesS2MinusS1UnionS3,
    isSuccesS3MinusS1UnionS2,
    intersectionResponse.isSuccess,
    s1IntersectS2MinusS3Response.isSuccess,
    s2IntersectS3MinusS1Response.isSuccess,
    s1IntersectS3MinusS2Response.isSuccess,
    s1MinusS2UnionS3Response.isSuccess,
    s2MinusS1UnionS3Response.isSuccess,
    s3MinusS1UnionS2Response.isSuccess,
  ].every(Boolean);

  const data = [
    {
      label: "( S1 ∩ S2 ∩ S3 )",
      key: "S1_intersect_S2_intersect_S3",
      value: intersectionData,
      caseId: intersectionResponse.isSuccess
        ? intersectionResponse.data
        : undefined,
    },
    {
      label: "( S1 ∩ S2 ) - ( S3 )",
      key: "S1_intersect_S2_minus_S3",
      value: s1IntersectS2MinusS3Data,
      caseId: s1IntersectS2MinusS3Response.isSuccess
        ? s1IntersectS2MinusS3Response.data
        : undefined,
    },
    {
      label: "( S2 ∩ S3 ) - ( S1 )",
      key: "S2_intersect_S3_minus_S1",
      value: s2IntersectS3MinusS1Data,
      caseId: s2IntersectS3MinusS1Response.isSuccess
        ? s2IntersectS3MinusS1Response.data
        : undefined,
    },
    {
      label: "( S1 ∩ S3 ) - ( S2 )",
      key: "S1_intersect_S3_minus_S2",
      value: s1IntersectS3MinusS2,
      caseId: s1IntersectS3MinusS2Response.isSuccess
        ? s1IntersectS3MinusS2Response.data
        : undefined,
    },
    {
      label: "( S1 ) - ( S2 ∪ S3 )",
      key: "S1_minus_S2_union_S3",
      value: s1MinusS2UnionS3,
      caseId: s1MinusS2UnionS3Response.isSuccess
        ? s1MinusS2UnionS3Response.data
        : undefined,
    },
    {
      label: "( S2 ) - ( S1 ∪ S3 )",
      key: "S2_minus_S1_union_S3",
      value: s2MinusS1UnionS3,
      caseId: s2MinusS1UnionS3Response.isSuccess
        ? s2MinusS1UnionS3Response.data
        : undefined,
    },
    {
      label: "( S3 ) - ( S1 ∪ S2 )",
      key: "S3_minus_S1_union_S2",
      value: s3MinusS1UnionS2,
      caseId: s3MinusS1UnionS2Response.isSuccess
        ? s3MinusS1UnionS2Response.data
        : undefined,
    },
  ];

  return (
    <SetOperations
      sets={sets}
      entityType={entityType}
      data={data}
      queryHook={queryHook}
      countHook={countHook}
      isAllSuccess={isAllSuccess}
    />
  );
};
