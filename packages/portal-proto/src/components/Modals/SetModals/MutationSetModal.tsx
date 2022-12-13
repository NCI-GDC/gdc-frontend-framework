import React from "react";
import Link from "next/link";
import { Modal, Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useGetSsmsQuery,
  useCreateSsmsSetMutation,
  useSsmSetCountQuery,
} from "@gff/core";
import InputSet from "./InputSet";
import SavedSets from "./SavedSets";
import { modalStyles, tabStyles } from "./styles";

interface MutationSetModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
}

const MutationSetModal: React.FC<MutationSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
}) => {
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
          <Tabs.Tab value="input">Enter Mutations</Tabs.Tab>
          <Tabs.Tab value="saved">Saved Sets</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="input" className="pt-4">
          <InputSet
            inputInstructions={inputInstructions}
            textInputPlaceholder="e.g. chr3:g.179234297A>G, 92b75ae1-8d4d-52c2-8658-9c981eef0e57"
            setType="ssm"
            setTypeLabel="mutation"
            identifierToolTip={
              <div>
                <p>
                  - Mutation identifiers accepted: Mutation UUID, DNA Change
                </p>
                <p>
                  - Delimiters between mutation identifiers: comma, space, tab
                  or 1 mutation identifier per line
                </p>
                <p>- File formats accepted: .txt, .csv, .tsv</p>
              </div>
            }
            dataHook={useGetSsmsQuery}
            searchField={"ssm_autocomplete.lowercase"}
            mappedToFields={["ssm_id"]}
            matchAgainstIdentifiers={["ssm_id", "genomic_dna_change"]}
            fieldDisplay={{
              ssm_id: "Mutation UUID",
              genomic_dna_change: "DNA Change",
            }}
            createSetHook={useCreateSsmsSetMutation}
            createSetField="ssm_id"
          />
        </Tabs.Panel>
        <Tabs.Panel value="saved">
          <SavedSets
            setType="ssm"
            setTypeLabel="mutation"
            createSetsInstructions={
              <p>
                Mutation sets can be created from the <b>Enter Mutation tabs</b>
                , or from the{" "}
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
            countHook={useSsmSetCountQuery}
          />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default MutationSetModal;
