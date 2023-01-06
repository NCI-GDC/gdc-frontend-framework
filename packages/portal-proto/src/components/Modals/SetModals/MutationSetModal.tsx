import React from "react";
import Link from "next/link";
import { Tabs } from "@mantine/core";
import {
  useCoreDispatch,
  hideModal,
  useGetSsmsQuery,
  useCreateSsmsSetMutation,
  Operation,
  useSsmSetCountQuery,
  FilterSet,
  FilterGroup,
} from "@gff/core";
import InputSet from "./InputSet";
import SavedSets from "./SavedSets";
import GenericSetModal from "./GenericSetModal";

interface MutationSetModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
  readonly updateFilters: (
    field: string,
    operation: Operation,
    groups?: FilterGroup[],
  ) => void;
  readonly existingFiltersHook: () => FilterSet;
}

const MutationSetModal: React.FC<MutationSetModalProps> = ({
  modalTitle,
  inputInstructions,
  selectSetInstructions,
  updateFilters,
  existingFiltersHook,
}) => {
  const dispatch = useCoreDispatch();

  return (
    <GenericSetModal modalTitle={modalTitle} tabbed tabLabel={"Mutations"}>
      <Tabs.Panel value="input" className="pt-4">
        <InputSet
          inputInstructions={inputInstructions}
          textInputPlaceholder="e.g. chr3:g.179234297A>G, 92b75ae1-8d4d-52c2-8658-9c981eef0e57"
          setType="ssms"
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
          hooks={{
            query: useGetSsmsQuery,
            createSet: useCreateSsmsSetMutation,
            updateFilters: updateFilters,
            getExistingFilters: existingFiltersHook,
          }}
        />
      </Tabs.Panel>
      <Tabs.Panel value="saved">
        <SavedSets
          setType="ssms"
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
          countHook={useSsmSetCountQuery}
          updateFilters={updateFilters}
          existingFiltersHook={existingFiltersHook}
        />
      </Tabs.Panel>
    </GenericSetModal>
  );
};

export default MutationSetModal;
