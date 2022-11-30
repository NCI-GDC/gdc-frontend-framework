import React, { useState } from "react";
import { Modal, Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useCoreSelector,
  selectSets,
} from "@gff/core";
import SetModalButtons from "./SetModalButtons";
import InputSet from "./InputSet";
import SavedSets from "./SavedSets";

interface GeneSetModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
}

const GeneSetModal: React.FC<GeneSetModalProps> = ({
  modalTitle,
  inputInstructions,
}: GeneSetModalProps) => {
  const [activeTab, setActiveTab] = useState<string | null>("input");
  const [savedSetSelected, setSavedSetSelected] = useState(false);
  const sets = useCoreSelector((state) => selectSets(state, "gene"));
  const dispatch = useCoreDispatch();

  return (
    <Modal
      opened
      title={modalTitle}
      onClose={() => dispatch(hideModal())}
      size="xl"
      withinPortal={false}
      classNames={{
        modal: "p-0",
        title: "mt-2 ml-4 uppercase text-primary-darkest lg",
        close: "mt-2 mr-4",
      }}
    >
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="input">Enter Genes</Tabs.Tab>
          <Tabs.Tab value="saved">Saved Sets</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="input" className="p-4">
          <InputSet
            inputInstructions={inputInstructions}
            textInputPlaceholder="e.g. ENSG00000141510, TP53, 7273, HGNC:11998, 191170, P04637"
            identifier="gene"
            identifierToolTip={
              <div>
                <p>
                  - Gene identifiers accepted: Symbol, Ensembl, Entrez, HCNC,
                  UniProtKB/Swiss-Prot, OMIM
                </p>
                <p>
                  - Delimiters between gene identifiers: comma, space, tab or 1
                  gene identifier per line
                </p>
                <p>- File formats accepted: .txt, .csv, .tsv</p>
              </div>
            }
          />
        </Tabs.Panel>
        <Tabs.Panel value="saved" className="p-4">
          <SavedSets
            sets={sets}
            createSetsInstructions={
              <p>
                Gene sets can be created from the <b>Enter Genes tabs</b>, or
                from the Mutation Frequency app.
              </p>
            }
            fieldName={"gene"}
            setSavedSetSelected={setSavedSetSelected}
          />
        </Tabs.Panel>
      </Tabs>
      <SetModalButtons
        saveButtonDisabled={activeTab === "saved"}
        clearButtonDisabled={activeTab === "saved" && !savedSetSelected}
        submitButtonDisabled={activeTab === "saved" && !savedSetSelected}
      />
    </Modal>
  );
};

export default GeneSetModal;
