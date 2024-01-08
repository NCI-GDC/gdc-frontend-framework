import React from "react";
import Link from "next/link";
import { Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useCreateGeneSetFromValuesMutation,
  useGeneSetCountsQuery,
} from "@gff/core";
import InputEntityList from "@/components/InputEntityList/InputEntityList";
import SavedSets from "./SavedSets";
import UserInputModal from "../UserInputModal";
import { SavedSetModalProps } from "./types";
import UpdateCohortButton from "./UpdateFiltersButton";
import SaveSetButton from "@/components/SaveSetButton";

const GeneSetModal: React.FC<SavedSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
  updateFilters,
  existingFiltersHook,
  opened,
}: SavedSetModalProps) => {
  const dispatch = useCoreDispatch();
  return (
    <UserInputModal
      modalTitle={modalTitle}
      tabs={[
        { label: "Enter Genes", value: "input" },
        { label: "Saved Sets", value: "saved" },
      ]}
      opened={opened}
    >
      <Tabs.Panel value="input" className="pt-4">
        <InputEntityList
          inputInstructions={inputInstructions}
          textInputPlaceholder="e.g. ENSG00000141510, TP53, 7273, HGNC:11998, 191170, P04637"
          entityType="genes"
          entityLabel="gene"
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
          hooks={{
            createSet: useCreateGeneSetFromValuesMutation,
            updateFilters: updateFilters,
            getExistingFilters: existingFiltersHook,
          }}
          LeftButton={SaveSetButton}
          RightButton={UpdateCohortButton}
        />
      </Tabs.Panel>
      <Tabs.Panel value="saved">
        <SavedSets
          setType="genes"
          setTypeLabel="gene"
          createSetsInstructions={
            <p>
              Gene sets can be created from the <b>Enter Genes tab</b>, or from
              the{" "}
              <Link href="/analysis_page?app=MutationFrequencyApp" passHref>
                <a>
                  <button
                    className="text-utility-link underline font-heading"
                    onClick={() => dispatch(hideModal())}
                  >
                    Mutation Frequency app.
                  </button>
                </a>
              </Link>
            </p>
          }
          selectSetInstructions={selectSetInstructions}
          countHook={useGeneSetCountsQuery}
          updateFilters={updateFilters}
          facetField={"genes.gene_id"}
          existingFiltersHook={existingFiltersHook}
        />
      </Tabs.Panel>
    </UserInputModal>
  );
};

export default GeneSetModal;
