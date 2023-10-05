import { useEffect } from "react";
import { SetOperations } from "./SetOperations";
import { SetOperationsExternalProps } from "./types";
import { createSetFiltersByKey, ENTITY_TYPE_TO_CREATE_SET_HOOK } from "./utils";

export const SetOperationsTwo: React.FC<SetOperationsExternalProps> = ({
  sets,
  entityType,
  queryHook,
  countHook,
}: SetOperationsExternalProps) => {
  const [createSet1Intersection, intersectionResponse] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSetS1MinusS2, s1MinusS2Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();
  const [createSet3S2MinusS1, s2MinusS1Response] =
    ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]();

  const intersectionFilters = createSetFiltersByKey(
    "S1_intersect_S2",
    entityType,
    sets,
  );
  const { data: intersectionData, isSuccess: isSuccessIntersection } =
    queryHook({
      filters: {
        filters: intersectionFilters,
      },
    });

  const s1MinusS2Filters = createSetFiltersByKey(
    "S1_minus_S2",
    entityType,
    sets,
  );
  const { data: s1MinusS2Data, isSuccess: isSuccessS1MinusS2 } = queryHook({
    filters: {
      filters: s1MinusS2Filters,
    },
  });

  const s2MinusS1Filters = createSetFiltersByKey(
    "S2_minus_S1",
    entityType,
    sets,
  );
  const { data: s2MinusS1Data, isSuccess: isSuccessS2MinusS1 } = queryHook({
    filters: {
      filters: s2MinusS1Filters,
    },
  });

  useEffect(() => {
    createSet1Intersection({ filters: intersectionFilters });
    createSetS1MinusS2({
      filters: s1MinusS2Filters,
    });
    createSet3S2MinusS1({
      filters: s2MinusS1Filters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = [
    {
      label: "( S1 ∩ S2 )",
      key: "S1_intersect_S2",
      value: intersectionData,
      caseId: intersectionResponse.isSuccess
        ? intersectionResponse.data
        : undefined,
    },
    {
      label: "( S1 ) - ( S2 )",
      key: "S1_minus_S2",
      value: s1MinusS2Data,
      caseId: s1MinusS2Response.isSuccess ? s1MinusS2Response.data : undefined,
    },
    {
      label: "( S2 ) - ( S1 )",
      key: "S2_minus_S1",
      value: s2MinusS1Data,
      caseId: s2MinusS1Response.isSuccess ? s2MinusS1Response.data : undefined,
    },
  ];

  const isAllSuccess = [
    isSuccessIntersection,
    intersectionResponse.isSuccess,
    isSuccessS1MinusS2,
    s1MinusS2Response.isSuccess,
    isSuccessS2MinusS1,
    s2MinusS1Response.isSuccess,
  ].every(Boolean);

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
