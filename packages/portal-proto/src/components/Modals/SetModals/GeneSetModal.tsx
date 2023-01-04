import React from "react";
import Link from "next/link";
import { Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useGetGenesQuery,
  useCreateGeneSetMutation,
  Operation,
  useGeneSetCountQuery,
  FilterSet,
} from "@gff/core";
import InputSet from "./InputSet";
import SavedSets from "./SavedSets";
import GenericSetModal from "./GenericSetModal";

interface GeneSetModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
  readonly updateFilters: (field: string, operation: Operation) => void;
  readonly existingFiltersHook: () => FilterSet;
}

const GeneSetModal: React.FC<GeneSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
  updateFilters,
  existingFiltersHook,
}: GeneSetModalProps) => {
  const dispatch = useCoreDispatch();
  return (
    <GenericSetModal modalTitle={modalTitle} tabLabel="Genes" tabbed>
      <Tabs.Panel value="input" className="pt-4">
        <InputSet
          inputInstructions={inputInstructions}
          textInputPlaceholder="e.g. ENSG00000141510, TP53, 7273, HGNC:11998, 191170, P04637"
          setType="genes"
          setTypeLabel="gene"
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
            query: useGetGenesQuery,
            createSet: useCreateGeneSetMutation,
            updateFilters: updateFilters,
            getExistingFilters: existingFiltersHook,
          }}
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
                    className="text-utility-link underline"
                    onClick={() => dispatch(hideModal())}
                  >
                    Mutation Frequency app.
                  </button>
                </a>
              </Link>
            </p>
          }
          selectSetInstructions={selectSetInstructions}
          countHook={useGeneSetCountQuery}
          updateFilters={updateFilters}
          facetField={"genes.gene_id"}
          existingFiltersHook={existingFiltersHook}
        />
      </Tabs.Panel>
    </GenericSetModal>
  );
};

export default GeneSetModal;
