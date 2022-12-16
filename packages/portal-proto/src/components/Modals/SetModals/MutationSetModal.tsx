import React, { useState } from "react";
import Link from "next/link";
import { Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useGetSsmsQuery,
  useCreateSsmsSetMutation,
  useSsmSetInfoQuery,
  Operation,
} from "@gff/core";
import InputSet from "./InputSet";
import SavedSets from "./SavedSets";
import GenericSetModal from "./GenericSetModal";

interface MutationSetModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
  readonly updateFilters: (field: string, operation: Operation) => void;
  readonly global?: boolean;
}

const MutationSetModal: React.FC<MutationSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
  updateFilters,
  global = false,
}) => {
  const dispatch = useCoreDispatch();
  const [userEnteredInput, setUserEnteredInput] = useState(false);

  return (
    <GenericSetModal
      modalTitle={modalTitle}
      tabbed
      tabLabel={"Mutations"}
      userEnteredInput={userEnteredInput}
    >
      <Tabs.Panel value="input" className="pt-4">
        <InputSet
          inputInstructions={inputInstructions}
          textInputPlaceholder="e.g. chr3:g.179234297A>G, 92b75ae1-8d4d-52c2-8658-9c981eef0e57"
          setType="ssm"
          setTypeLabel="mutation"
          identifierToolTip={
            <div>
              <p>- Mutation identifiers accepted: Mutation UUID, DNA Change</p>
              <p>
                - Delimiters between mutation identifiers: comma, space, tab or
                1 mutation identifier per line
              </p>
              <p>- File formats accepted: .txt, .csv, .tsv</p>
            </div>
          }
          searchField={"ssm_autocomplete.lowercase"}
          mappedToFields={["ssm_id"]}
          matchAgainstIdentifiers={["ssm_id", "genomic_dna_change"]}
          fieldDisplay={{
            ssm_id: "Mutation UUID",
            genomic_dna_change: "DNA Change",
          }}
          createSetField="ssm_id"
          facetField="ssms.ssm_id"
          hooks={{
            query: useGetSsmsQuery,
            createSet: useCreateSsmsSetMutation,
            updateFilters: updateFilters,
          }}
          setUserEnteredInput={setUserEnteredInput}
          userEnteredInput={userEnteredInput}
        />
      </Tabs.Panel>
      <Tabs.Panel value="saved">
        <SavedSets
          setType="ssm"
          setTypeLabel="mutation"
          createSetsInstructions={
            <p>
              Mutation sets can be created from the <b>Enter Mutation tab</b>,
              or from the{" "}
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
          facetField="ssms.ssm_id"
          getSetInfo={useSsmSetInfoQuery}
          updateFilters={updateFilters}
          global={global}
          setUserEnteredInput={setUserEnteredInput}
          userEnteredInput={userEnteredInput}
        />
      </Tabs.Panel>
    </GenericSetModal>
  );
};

export default MutationSetModal;
