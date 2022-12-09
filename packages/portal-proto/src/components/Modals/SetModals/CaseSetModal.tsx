import { useCoreDispatch, hideModal } from "@gff/core";
import { Modal } from "@mantine/core";
import { modalStyles } from "./constants";
import InputSet from "./InputSet";

const CaseSetModal: React.FC = () => {
  const dispatch = useCoreDispatch();

  return (
    <Modal
      opened
      title={"Filter Current Cohort by Cases"}
      onClose={() => dispatch(hideModal())}
      size="xl"
      withinPortal={false}
      classNames={modalStyles}
      closeButtonLabel="close modal"
    >
      <InputSet
        inputInstructions="Enter one or more case identifiers in the field below or upload a file to filter your cohort."
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
        identifier="case"
      />
    </Modal>
  );
};

export default CaseSetModal;
