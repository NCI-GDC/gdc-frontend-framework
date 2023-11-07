import { useEffect, useState } from "react";
import { useCreateCaseSetFromValuesMutation } from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import UserInputModal from "@/components/Modals/UserInputModal";
import InputEntityList from "@/components/InputEntityList/InputEntityList";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";

interface SubmitButtonProps {
  readonly ids: string[];
  readonly disabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  ids,
  disabled,
}: SubmitButtonProps) => {
  const [createSet, response] = useCreateCaseSetFromValuesMutation();

  useEffect(() => {
    if (response.isSuccess) {
      setShowSaveCohort(true);
    }
  }, [response.isSuccess]);

  const [showSaveCohort, setShowSaveCohort] = useState(false);

  return (
    <>
      {showSaveCohort && (
        <SaveCohortModal
          onClose={() => setShowSaveCohort(false)}
          filters={{
            mode: "and",
            root: {
              "cases.case_id": {
                operator: "includes",
                field: "cases.case_id",
                operands: [`set_id:${response.data}`],
              },
            },
          }}
        />
      )}
      <DarkFunctionButton
        disabled={disabled}
        onClick={() => createSet({ values: ids })}
        loading={response.isLoading}
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
        RightButton={SubmitButton}
        hooks={{}}
      />
    </UserInputModal>
  );
};

export default ImportCohortModal;
