import FunctionButton from "@/components/FunctionButton";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import {
  useCoreSelector,
  selectAvailableCohorts,
  FilterSet,
  addNewCohortWithFilterAndMessage,
  useCoreDispatch,
  selectCohortFilterSetById,
  fetchGdcCases,
  buildCohortGqlOperator,
  graphqlAPI,
} from "@gff/core";
import { LoadingOverlay, Modal, Radio, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { MAX_CASE_IDS } from "./utils";
import { createColumnHelper } from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";

export type WithOrWithoutCohortType = "with" | "without" | undefined;
export const SelectCohortsModal = ({
  opened,
  onClose,
  withOrWithoutCohort,
  pickedCases,
}: {
  opened: boolean;
  onClose: () => void;
  withOrWithoutCohort: WithOrWithoutCohortType;
  pickedCases: readonly string[];
}): JSX.Element => {
  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const [checkedValue, setCheckedValue] = useState("");
  const cohortFilter = useCoreSelector((state) =>
    selectCohortFilterSetById(state, checkedValue),
  );
  const [loading, setLoading] = useState(false);

  const isWithCohort = withOrWithoutCohort === "with";

  const cohortListData = useMemo(
    () =>
      cohorts
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .map((cohort) => ({
          cohort_id: cohort.id,
          name: cohort.name,
          num_cases: cohort.counts.caseCount?.toLocaleString(),
        })),
    [cohorts],
  );

  const cohortListTableColumnHelper =
    createColumnHelper<typeof cohortListData[0]>();

  const cohortListTableColumn = useMemo(
    () => [
      cohortListTableColumnHelper.display({
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <Radio
            value={row.original.cohort_id}
            checked={checkedValue === row.original.cohort_id}
            onChange={(event) => {
              setCheckedValue(event.currentTarget.value);
            }}
          />
        ),
      }),
      cohortListTableColumnHelper.accessor("name", {
        id: "name",
        header: "Name",
      }),
      cohortListTableColumnHelper.accessor("num_cases", {
        id: "num_cases",
        header: "# Cases",
      }),
    ],
    [cohortListTableColumnHelper, checkedValue],
  );

  const { handlePageChange, page, pages, size, from, total, displayedData } =
    useStandardPagination(cohortListData);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
    }
  };

  const createCohortFromCases = async (customName: string) => {
    let resCases: string[];
    setLoading(true);

    try {
      const res = await fetchGdcCases({
        filters: buildCohortGqlOperator(cohortFilter),
        fields: ["case_id"],
        size: MAX_CASE_IDS,
      });
      resCases = res.data.hits.map((hit) => hit.case_id);
    } catch (error) {
      // TODO: how to handle this situation?
      // maybe show a modal and ask user to redo the task
    }

    const updatedCases = Array.from(
      new Set(
        !isWithCohort
          ? resCases.filter((id) => !pickedCases.includes(id))
          : pickedCases.concat(resCases),
      ),
    );

    const response = await graphqlAPI<any>(
      `mutation createSet(
      $input: CreateSetInput
    ) {
      sets {
        create {
          repository {
            case(input: $input) {
              set_id
              size
            }
          }
        }
      }
    }`,
      {
        input: {
          filters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.case_id",
                  value: updatedCases,
                },
              },
            ],
          },
        },
      },
    );
    const setId = response.data.sets.create.repository.case.set_id;

    const pickedCasesfilters: FilterSet = {
      mode: "and",
      root: {
        "cases.case_id": {
          operator: "includes",
          field: "cases.case_id",
          operands: [`set_id:${setId}`],
        },
      },
    };
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: pickedCasesfilters,
        message: "newCasesCohort",
        name: customName,
      }),
    );
    setLoading(false);
  };

  const title = `create new cohort: existing cohort ${
    isWithCohort ? "with" : "without"
  } selected cases`;

  const description = `Select an existing cohort, then click Submit. This will save a new
    cohort that contains all the cases from your selected cohort ${
      isWithCohort ? "and" : "except"
    } the cases previously selected.`;

  const [showCreateCohort, setShowCreateCohorts] = useState(false);
  return (
    <>
      {loading ? (
        <LoadingOverlay data-testid="loading-spinner" visible />
      ) : (
        <Modal
          opened={opened}
          onClose={onClose}
          withCloseButton
          title={title}
          classNames={{
            content: "p-0 drop-shadow-lg",
            body: "flex flex-col justify-between min-h-[300px]",
          }}
          size="xl"
          zIndex={400}
        >
          {showCreateCohort && (
            <CreateCohortModal
              onClose={() => setShowCreateCohorts(false)}
              onActionClick={async (newName: string) => {
                await createCohortFromCases(newName);
                onClose();
              }}
            />
          )}

          <div className="px-4">
            <Text className="text-xs mb-4 block">{description}</Text>

            <VerticalTable
              data={displayedData}
              columns={cohortListTableColumn}
              status="fulfilled"
              pagination={{
                page,
                pages,
                size,
                from,
                total,
                label: "cohorts",
              }}
              handleChange={handleChange}
              disablePageSize={true}
            />
          </div>
          <div className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky">
            <FunctionButton onClick={onClose}>Cancel</FunctionButton>
            <DarkFunctionButton
              disabled={!checkedValue}
              onClick={() => {
                setShowCreateCohorts(true);
              }}
            >
              Submit
            </DarkFunctionButton>
          </div>
        </Modal>
      )}
    </>
  );
};
