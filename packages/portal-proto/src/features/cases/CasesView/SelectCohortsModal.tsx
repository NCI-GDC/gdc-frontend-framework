import FunctionButton from "@/components/FunctionButton";
import { modalStyles } from "@/components/Modals/SetModals/styles";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import {
  Columns,
  HandleChangeInput,
  VerticalTable,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import {
  useCoreSelector,
  selectAvailableCohorts,
  FilterSet,
  resetSelectedCases,
  addNewCohortWithFilterAndMessage,
  useCoreDispatch,
  selectCohortFilterSetById,
  fetchGdcCases,
  buildCohortGqlOperator,
} from "@gff/core";
import { LoadingOverlay, Modal, Radio, Text } from "@mantine/core";
import { useMemo, useState } from "react";

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

  const columnListOrder: Columns[] = [
    {
      id: "selected",
      visible: true,
      columnName: "Select",
      Cell: ({ value }: { value: string }): JSX.Element => {
        return (
          <Radio
            value={value}
            checked={checkedValue === value}
            onChange={(event) => {
              setCheckedValue(event.currentTarget.value);
            }}
          />
        );
      },
      disableSortBy: true,
    },
    {
      id: "name",
      columnName: "Name",
      visible: true,
      disableSortBy: true,
    },
    {
      id: "num_cases",
      columnName: "# Cases",
      visible: true,
      disableSortBy: true,
    },
  ];

  const info = useMemo(
    () =>
      cohorts
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .map((cohort) => ({
          selected: cohort.id,
          name: cohort.name,
          num_cases: cohort.caseCount?.toLocaleString(),
        })),
    [cohorts],
  );

  const { handlePageChange, page, pages, size, from, total, displayedData } =
    useStandardPagination(info);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
    }
  };

  const createCohortFromCases = async () => {
    let resCases: string[];
    setLoading(true);

    try {
      const res = await fetchGdcCases({
        filters: buildCohortGqlOperator(cohortFilter),
        fields: ["case_id"],
        size: 100000,
      });
      resCases = res.data.hits.map((hit) => hit.case_id);
    } catch (error) {
      // TODO: how to handle this situation?
      // maybe show a model and ask user to redo the task
    }

    const updatedCases = Array.from(
      new Set(
        !isWithCohort
          ? resCases.filter((id) => !pickedCases.includes(id))
          : pickedCases.concat(resCases),
      ),
    );
    const pickedCasesfilters: FilterSet = {
      mode: "and",
      root: {
        "cases.case_id": {
          operator: "includes",
          field: "cases.case_id",
          operands: updatedCases,
        },
      },
    };
    coreDispatch(resetSelectedCases());
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: pickedCasesfilters,
        message: "newCasesCohort",
        case_ids: updatedCases,
      }),
    );
    setLoading(false);
  };

  const title = `create new cohort: existing cohort ${
    isWithCohort ? "with" : "without"
  } selected cases`;

  const description = `Select an existing cohort, then click Submit. This will create a new
    cohort that contains all the cases from your selected cohort ${
      isWithCohort ? "and" : "expect"
    } the cases previously selected.`;

  return (
    <>
      {loading ? (
        <LoadingOverlay visible />
      ) : (
        <Modal
          opened={opened}
          onClose={onClose}
          withCloseButton
          title={title}
          withinPortal={false}
          classNames={modalStyles}
          size="xl"
          zIndex={400}
        >
          <div className="px-4">
            <Text className="text-xs mb-4 block">{description}</Text>

            <VerticalTable
              tableData={displayedData}
              selectableRow={false}
              columns={columnListOrder}
              showControls={false}
              status="fulfilled"
              pagination={{
                page,
                pages,
                size,
                from,
                total,
              }}
              handleChange={handleChange}
              disablePageSize={true}
            />
          </div>

          <div className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky">
            <FunctionButton onClick={onClose}>Cancel</FunctionButton>
            <DarkFunctionButton
              disabled={!checkedValue}
              onClick={async () => {
                await createCohortFromCases();
                onClose();
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
