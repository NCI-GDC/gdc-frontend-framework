import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  useGetCasesQuery,
  useCoreSelector,
  useCoreDispatch,
  selectAvailableCohorts,
  addNewCohortWithFilterAndMessage,
  FilterSet,
  hideModal,
} from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import UserInputModal from "@/components/Modals/UserInputModal";
import InputEntityList from "@/components/InputEntityList/InputEntityList";
import { SaveOrCreateCohortModal } from "@/components/Modals/SaveOrCreateCohortModal";

interface SubmitButtonProps {
  readonly ids: string[];
  readonly disabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  ids,
  disabled,
}: SubmitButtonProps) => {
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const coreDispatch = useCoreDispatch();

  const createCohortFromCases = (name: string) => {
    const filters: FilterSet = {
      mode: "and",
      root: {
        "cases.case_id": {
          operator: "includes",
          field: "cases.case_id",
          operands: ids,
        },
      },
    };
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: filters,
        message: "newCasesCohort",
        name,
        group:
          ids.length > 1
            ? {
                ids: [...ids],
                field: "cases.case_id",
                groupId: uuidv4(),
              }
            : undefined,
      }),
    );

    coreDispatch(hideModal());
  };

  const onNameChange = (name: string) =>
    cohorts.every((cohort) => cohort.name !== name);
  const [showCreateCohort, setShowCreateCohort] = useState(false);

  return (
    <>
      {showCreateCohort && (
        <SaveOrCreateCohortModal
          entity="cohort"
          action="create"
          opened
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohortFromCases(newName);
          }}
          onNameChange={onNameChange}
        />
      )}
      <DarkFunctionButton
        disabled={disabled}
        onClick={() => setShowCreateCohort(true)}
      >
        Submit
      </DarkFunctionButton>
    </>
  );
};

const ImportCohortModal: React.FC = () => {
  return (
    <UserInputModal modalTitle="Import a New Cohort">
      <InputEntityList
        inputInstructions="Enter one or more case identifiers in the field below or upload a file to import a new cohort."
        identifierToolTip={
          <div>
            <p>
              - Case identifiers accepted: Case UUID, Case ID, Sample UUID,
              Sample ID, Portion UUID, Portion ID,
              <p>
                Slide UUID, Slide ID, Analyte UUID, Analyte ID, Aliquot UUID,
                Aliquot ID
              </p>
            </p>
            <p>
              - Delimiters between case identifiers: comma, space, tab or 1 case
              identifier per line
            </p>
            <p>- File formats accepted: .txt, .csv, .tsv</p>{" "}
          </div>
        }
        textInputPlaceholder={
          "e.g. TCGA-DD-AAVP, TCGA-DD-AAVP-10A-01D-A40U-10, 0004d251-3f70-4395-b175-c94c2f5b1b81"
        }
        entityType="cases"
        entityLabel="case"
        SubmitButton={SubmitButton}
      />
    </UserInputModal>
  );
};

export default ImportCohortModal;
