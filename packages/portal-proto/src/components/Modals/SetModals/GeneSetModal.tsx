import React from "react";
import Link from "next/link";
import { Modal, Tabs } from "@mantine/core";
import { useCoreDispatch, hideModal, useGetGenesQuery } from "@gff/core";
import InputSet from "./InputSet";
import SavedSets from "./SavedSets";
import { modalStyles, tabStyles } from "./constants";

interface GeneSetModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
}

const GeneSetModal: React.FC<GeneSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
}: GeneSetModalProps) => {
  const dispatch = useCoreDispatch();

  return (
    <Modal
      opened
      title={modalTitle}
      onClose={() => dispatch(hideModal())}
      size="xl"
      withinPortal={false}
      classNames={modalStyles}
      closeButtonLabel="close modal"
    >
      <Tabs defaultValue="input" classNames={tabStyles}>
        <Tabs.List>
          <Tabs.Tab value="input">Enter Genes</Tabs.Tab>
          <Tabs.Tab value="saved">Saved Sets</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="input" className="pt-4">
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
            dataHook={useGetGenesQuery}
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
          />
        </Tabs.Panel>
        <Tabs.Panel value="saved">
          <SavedSets
            sets={{}}
            fieldName={"gene"}
            createSetsInstructions={
              <p>
                Gene sets can be created from the <b>Enter Genes tabs</b>, or
                from the{" "}
                <Link
                  href="/user-flow/workbench/analysis_page?app=MutationFrequencyApp"
                  passHref
                >
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
          />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default GeneSetModal;
