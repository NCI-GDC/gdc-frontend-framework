import React, { useState } from "react";
import {
  useCreateSsmsSetFromFiltersMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateCaseSetFromFiltersMutation,
  GqlOperation,
  FilterSet,
} from "@gff/core";
import { SetOperationEntityType } from "@/features/set-operations/types";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import { Loader, Tooltip } from "@mantine/core";
import { FaPlus as PlusIcon } from "react-icons/fa";
import CohortCreationButton, {
  CohortCreationStyledButton,
  IconWrapper,
} from "@/components/CohortCreationButton";

export const CreateFromCountButton = ({
  tooltipLabel,
  ariaLabel,
  disabled,
  handleOnClick,
  count,
  loading = false,
}: {
  tooltipLabel: string;
  ariaLabel?: string;
  disabled: boolean;
  handleOnClick: () => void;
  count: number;
  loading?: boolean;
}): JSX.Element => {
  return (
    <div className="p-1">
      <Tooltip label={tooltipLabel} withArrow>
        <span>
          <CohortCreationStyledButton
            disabled={disabled}
            onClick={handleOnClick}
            aria-label={ariaLabel}
          >
            <IconWrapper $disabled={disabled}>
              <PlusIcon color="white" size={12} aria-disabled />
            </IconWrapper>
            <span className="w-fit">
              {loading ? (
                <Loader size="xs" />
              ) : count !== undefined ? (
                count.toLocaleString()
              ) : null}
            </span>
          </CohortCreationStyledButton>
        </span>
      </Tooltip>
    </div>
  );
};

interface CountButtonWrapperForSetProps {
  readonly count: number | undefined;
  readonly filters: GqlOperation;
  readonly entityType?: SetOperationEntityType;
}

/**
 * CountButtonWrapperForSet: handles the count button to create sets for mutations, or genes.
 */
const CountButtonWrapperForSet: React.FC<CountButtonWrapperForSetProps> = ({
  count,
  filters,
  entityType,
}: CountButtonWrapperForSetProps) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const disabled = count === 0;

  return (
    <>
      <SaveSelectionAsSetModal
        opened={showSaveModal && entityType === "mutations"}
        filters={filters}
        sort="occurrence.case.project.project_id"
        initialSetName="Custom Mutation Selection"
        saveCount={count}
        setType="ssms"
        setTypeLabel="mutation"
        createSetHook={useCreateSsmsSetFromFiltersMutation}
        closeModal={() => setShowSaveModal(false)}
      />

      <SaveSelectionAsSetModal
        opened={showSaveModal && entityType === "genes"}
        filters={filters}
        initialSetName={"Custom Gene Selection"}
        sort="case.project.project_id"
        saveCount={count}
        setType="genes"
        setTypeLabel="gene"
        createSetHook={useCreateGeneSetFromFiltersMutation}
        closeModal={() => setShowSaveModal(false)}
      />

      <CreateFromCountButton
        tooltipLabel={
          entityType !== "cohort"
            ? "Save as new set"
            : disabled
            ? "No cases available"
            : `Create a new unsaved cohort`
        }
        ariaLabel={
          entityType !== "cohort"
            ? `Save new set with ${count && count.toLocaleString()} item${
                count > 1 ? "s" : ""
              }`
            : disabled
            ? "No cases available"
            : `Create a new unsaved cohort of ${
                count > 1
                  ? "these " + count.toLocaleString() + " cases"
                  : "this case"
              }`
        }
        disabled={disabled}
        handleOnClick={() => setShowSaveModal(true)}
        count={count}
      />
    </>
  );
};

const CountButtonWrapperForSetsAndCases: React.FC<
  CountButtonWrapperForSetProps
> = ({ count, filters, entityType }: CountButtonWrapperForSetProps) => {
  const [createSet] = useCreateCaseSetFromFiltersMutation();

  const createCohort = async () => {
    return await createSet({
      // TODO: possibly add error handling
      filters: filters,
      intent: "user",
      set_type: "frozen",
    })
      .unwrap()
      .then((setId) => {
        return {
          mode: "and",
          root: {
            "cases.case_id": {
              field: "cases.case_id",
              operands: [`set_id:${setId}`],
              operator: "includes",
            },
          },
        } as FilterSet;
      });
  };

  if (entityType === "cohort") {
    return (
      <CohortCreationButton
        numCases={count}
        label={count?.toLocaleString()}
        filtersCallback={createCohort}
      />
    );
  } else {
    return (
      <CountButtonWrapperForSet
        count={count}
        filters={filters}
        entityType={entityType}
      />
    );
  }
};
export default CountButtonWrapperForSetsAndCases;
