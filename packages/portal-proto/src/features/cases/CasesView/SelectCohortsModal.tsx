import FunctionButton from "@/components/FunctionButton";
import { modalStyles } from "@/components/Modals/SetModals/styles";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import {
  Columns,
  HandleChangeInput,
  VerticalTable,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { useCoreSelector, selectAvailableCohorts } from "@gff/core";
import { Modal, Radio, Text } from "@mantine/core";
import { useMemo, useState } from "react";

export type WithOrWithoutCohortType = "with" | "without" | undefined;
export const SelectCohortsModal = ({
  opened,
  onClose,
  withOrWithoutCohort,
}: {
  opened: boolean;
  onClose: () => void;
  withOrWithoutCohort: WithOrWithoutCohortType;
}): JSX.Element => {
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const [checkedValue, setCheckedValue] = useState("");

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
      cohorts?.map((cohort) => ({
        selected: cohort.id,
        name: cohort.name,
        num_cases: cohort.caseCount,
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

  const isWithCohort = withOrWithoutCohort === "with";
  const title = `create new cohort: existing cohort ${
    isWithCohort ? "with" : "without"
  } selected cases`;

  const description = `Select an existing cohort, then click Submit. This will create a new
    cohort that contains all the cases from your selected cohort ${
      isWithCohort ? "and" : "expect"
    } the cases previously selected.`;

  return (
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
        <DarkFunctionButton disabled={true} onClick={() => {}}>
          Submit
        </DarkFunctionButton>
      </div>
    </Modal>
  );
};
