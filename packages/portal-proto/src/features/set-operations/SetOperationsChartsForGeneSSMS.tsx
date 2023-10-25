import { Loader } from "@mantine/core";
import { SetOperationsChartInputProps } from "./types";
import {
  useSetOperationGeneTotalQuery,
  useSetOperationSsmTotalQuery,
  useGeneSetCountsQuery,
  useSsmSetCountsQuery,
} from "@gff/core";
import { SetOperationsTwo } from "./SetOperationsTwo";
import { SetOperationsThree } from "./SetOperationsThree";

const ENTITY_TYPE_TO_QUERY_HOOK = {
  genes: useSetOperationGeneTotalQuery,
  mutations: useSetOperationSsmTotalQuery,
};
const ENTITY_TYPE_TO_COUNT_HOOK = {
  genes: useGeneSetCountsQuery,
  mutations: useSsmSetCountsQuery,
};

const SetOperationsChartsForGeneSSMS = ({
  selectedEntities,
  selectedEntityType,
  isLoading = false,
}: SetOperationsChartInputProps): JSX.Element => {
  return (
    <>
      {selectedEntities.length === 0 || isLoading ? (
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      ) : selectedEntities.length === 2 ? (
        <SetOperationsTwo
          sets={selectedEntities}
          entityType={selectedEntityType}
          queryHook={ENTITY_TYPE_TO_QUERY_HOOK[selectedEntityType]}
          countHook={ENTITY_TYPE_TO_COUNT_HOOK[selectedEntityType]}
        />
      ) : (
        <SetOperationsThree
          sets={selectedEntities}
          entityType={selectedEntityType}
          queryHook={ENTITY_TYPE_TO_QUERY_HOOK[selectedEntityType]}
          countHook={ENTITY_TYPE_TO_COUNT_HOOK[selectedEntityType]}
        />
      )}
    </>
  );
};

export default SetOperationsChartsForGeneSSMS;
