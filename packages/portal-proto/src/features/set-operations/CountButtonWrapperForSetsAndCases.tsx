import React, { useState } from "react";
import {
  useCreateSsmsSetFromFiltersMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateCaseSetFromFiltersMutation,
  addNewCohortWithFilterAndMessage,
  useCoreDispatch,
} from "@gff/core";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { CountButton } from "@/components/CountButton/CountButton";
import { SetOperationEntityType } from "@/features/set-operations/types";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";

interface CountButtonWrapperForSetProps {
  readonly count: number | undefined;
  readonly filters: Record<string, any>;
  readonly entityType?: SetOperationEntityType;
}

/**
 * CountButtonWrapperForSet: handles the count button to create sets for mutations, or genes.
 * @param count
 * @param filters
 * @param entityType
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
      {showSaveModal &&
        (entityType === "mutations" ? (
          <SaveSelectionAsSetModal
            filters={filters}
            sort="occurrence.case.project.project_id"
            initialSetName="Custom Mutation Selection"
            saveCount={count}
            setType="ssms"
            setTypeLabel="mutation"
            createSetHook={useCreateSsmsSetFromFiltersMutation}
            closeModal={() => setShowSaveModal(false)}
          />
        ) : (
          entityType === "genes" && (
            <SaveSelectionAsSetModal
              filters={filters}
              initialSetName={"Custom Gene Selection"}
              sort="case.project.project_id"
              saveCount={count}
              setType="genes"
              setTypeLabel="gene"
              createSetHook={useCreateGeneSetFromFiltersMutation}
              closeModal={() => setShowSaveModal(false)}
            />
          )
        ))}

      <CountButton
        tooltipLabel={
          entityType !== "cohort"
            ? "Save as new set"
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

/**
 * CountButtonWrapperForCohort: handles the count button to create case sets for cohorts.
 * @param count
 * @param filters
 */
const CountButtonWrapperForCohort: React.FC<CountButtonWrapperForSetProps> = ({
  count,
  filters,
}: CountButtonWrapperForSetProps) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const disabled = count === 0;
  const [createSet] = useCreateCaseSetFromFiltersMutation();
  const coreDispatch = useCoreDispatch();

  const createCohort = (name: string) => {
    createSet({
      // TODO: possibly add error handling
      filters: filters,
    })
      .unwrap()
      .then((setId) => {
        coreDispatch(
          addNewCohortWithFilterAndMessage({
            filters: {
              mode: "and",
              root: {
                "cases.case_id": {
                  field: "cases.case_id",
                  operands: [`set_id:${setId}`],
                  operator: "includes",
                },
              },
            },
            name,
            message: "newCasesCohort",
          }),
        );
      });
  };

  return (
    <>
      {showSaveModal && (
        <CreateCohortModal
          onClose={() => setShowSaveModal(false)}
          onActionClick={(newName: string) => {
            createCohort(newName);
          }}
        />
      )}

      <CountButton
        tooltipLabel={
          disabled
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
  if (entityType === "cohort") {
    return <CountButtonWrapperForCohort count={count} filters={filters} />;
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
