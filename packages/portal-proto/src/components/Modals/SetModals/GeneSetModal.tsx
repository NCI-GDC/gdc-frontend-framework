import React, { useState } from "react";
import Link from "next/link";
import { Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useGetGenesQuery,
  useCreateGeneSetMutation,
  useGeneSetInfoQuery,
  Operation,
} from "@gff/core";
import InputSet from "./InputSet";
import SavedSets from "./SavedSets";
import GenericSetModal from "./GenericSetModal";

interface GeneSetModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
  readonly updateFilters: (field: string, operation: Operation) => void;
  readonly global?: boolean;
}

const GeneSetModal: React.FC<GeneSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
  updateFilters,
  global = false,
}: GeneSetModalProps) => {
  const dispatch = useCoreDispatch();
  const [userEnteredInput, setUserEnteredInput] = useState(false);

  return (
    <GenericSetModal
      modalTitle={modalTitle}
      userEnteredInput={userEnteredInput}
      tabLabel="Genes"
      tabbed
    >
      <Tabs.Panel value="input" className="pt-4">
        <InputSet
          inputInstructions={inputInstructions}
          textInputPlaceholder="e.g. ENSG00000141510, TP53, 7273, HGNC:11998, 191170, P04637"
          setType="gene"
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
          searchField="gene_autocomplete.lowercase"
          mappedToFields={["gene_id", "symbol"]}
          matchAgainstIdentifiers={[
            "gene_id",
            "symbol",
            "external_db_ids.entrez_gene",
            "external_db_ids.hgnc",
            "external_db_ids.omim_gene",
            "external_db_ids.uniprotkb_swissprot",
          ]}
          fieldDisplay={{
            symbol: "Symbol",
            gene_id: "Ensembl",
            "external_db_ids.entrez_gene": "Entrez",
            "external_db_ids.hgnc": "HGNC",
            "external_db_ids.uniprotkb_swissprot": "UniProtKB/Swiss-Prot",
            "external_db_ids.omim_gene": "OMIM",
          }}
          createSetField={"gene_id"}
          facetField={"genes.gene_id"}
          hooks={{
            query: useGetGenesQuery,
            createSet: useCreateGeneSetMutation,
            updateFilters: updateFilters,
          }}
          setUserEnteredInput={setUserEnteredInput}
          userEnteredInput={userEnteredInput}
        />
      </Tabs.Panel>
      <Tabs.Panel value="saved">
        <SavedSets
          setType="gene"
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
          getSetInfo={useGeneSetInfoQuery}
          updateFilters={updateFilters}
          facetField={"genes.gene_id"}
          global={global}
          setUserEnteredInput={setUserEnteredInput}
          userEnteredInput={userEnteredInput}
        />
      </Tabs.Panel>
    </GenericSetModal>
  );
};

export default GeneSetModal;
