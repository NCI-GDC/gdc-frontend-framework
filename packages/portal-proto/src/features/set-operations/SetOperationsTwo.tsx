import { SetOperations } from "./SetOperations";
import { SetOperationsExternalProps } from "./types";
import { createSetFiltersByKey } from "./utils";

export const SetOperationsTwo: React.FC<SetOperationsExternalProps> = ({
  sets,
  entityType,
  queryHook,
  countHook,
}: SetOperationsExternalProps) => {
  const intersectionFilters = createSetFiltersByKey(
    "S1_intersect_S2",
    entityType,
    sets,
  );
  const { data: intersectionData } = queryHook({
    filters: {
      filters: intersectionFilters,
    },
  });

  const s1MinusS2Filters = createSetFiltersByKey(
    "S1_minus_S2",
    entityType,
    sets,
  );
  const { data: s1MinusS2Data } = queryHook({
    filters: {
      filters: s1MinusS2Filters,
    },
  });

  const s2MinusS1Filters = createSetFiltersByKey(
    "S2_minus_S1",
    entityType,
    sets,
  );
  const { data: s2MinusS1Data } = queryHook({
    filters: {
      filters: s2MinusS1Filters,
    },
  });

  const data = [
    {
      label: "( S1 ∩ S2 )",
      key: "S1_intersect_S2",
      value: intersectionData,
    },
    {
      label: "( S1 ) - ( S2 )",
      key: "S1_minus_S2",
      value: s1MinusS2Data,
    },
    {
      label: "( S2 ) - ( S1 )",
      key: "S2_minus_S1",
      value: s2MinusS1Data,
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
