import React from "react";
import Link from "next/link";
import { Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useCreateSsmsSetFromValuesMutation,
  useSsmSetCountsQuery,
} from "@gff/core";
import InputEntityList from "@/components/InputEntityList/InputEntityList";
import SavedSets from "./SavedSets";
import UserInputModal from "../UserInputModal";
import { SavedSetModalProps } from "./types";
import UpdateCohortButton from "./UpdateFiltersButton";
import SaveSetButton from "@/components/InputEntityList/SaveSetButton";

const MutationSetModal: React.FC<SavedSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
  updateFilters,
  existingFiltersHook,
}: SavedSetModalProps) => {
  const dispatch = useCoreDispatch();

  return (
    <UserInputModal
      modalTitle={modalTitle}
      tabs={[
        { label: "Enter Mutations", value: "input" },
        { label: "Saved Sets", value: "saved" },
      ]}
    >
      <Tabs.Panel value="input" className="pt-4">
        <InputEntityList
          inputInstructions={inputInstructions}
          textInputPlaceholder="e.g. chr3:g.179234297A>G, 92b75ae1-8d4d-52c2-8658-9c981eef0e57"
          entityType="ssms"
          entityLabel="mutation"
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
          hooks={{
            createSet: useCreateSsmsSetFromValuesMutation,
            updateFilters: updateFilters,
            getExistingFilters: existingFiltersHook,
          }}
          LeftButton={SaveSetButton}
          RightButton={UpdateCohortButton}
        />
      </Tabs.Panel>
      <Tabs.Panel value="saved">
        <SavedSets
          setType="ssms"
          setTypeLabel="mutation"
          createSetsInstructions={
            <p>
              Mutation sets can be created from the <b>Enter Mutations tab</b>,
              or from the{" "}
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
          facetField="ssms.ssm_id"
          countHook={useSsmSetCountsQuery}
          updateFilters={updateFilters}
          existingFiltersHook={existingFiltersHook}
        />
      </Tabs.Panel>
    </UserInputModal>
  );
};

export default MutationSetModal;
