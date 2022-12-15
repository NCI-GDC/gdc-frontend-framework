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
  hideModal,
  useCoreDispatch,
  useCoreSelector,
  selectAvailableCohorts,
} from "@gff/core";
import { Modal, Radio } from "@mantine/core";
import { useMemo } from "react";

export const SelectCohortsModal = ({ opened }: { opened: boolean }) => {
  const dispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const columnListOrder: Columns[] = [
    {
      id: "selected",
      visible: true,
      columnName: "Select",
      Cell: ({ value }: { value: string }): JSX.Element => {
        return <Radio value={value} />;
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
        num_cases: "--",
      })),
    [cohorts],
  );

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(info);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => dispatch(hideModal())}
      withCloseButton
      title="create new cohort: existing cohort with selected cases"
      withinPortal={false}
      classNames={modalStyles}
      size="xl"
      zIndex={400}
    >
      <div>
        <span>
          Select an existing cohort, then click Submit. This will create a new
          cohort that contains all the cases from your selected cohort and the
          cases previously selected.
        </span>

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
        />

        <div className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky">
          <FunctionButton onClick={() => dispatch(hideModal())}>
            Cancel
          </FunctionButton>
          <DarkFunctionButton disabled={true} onClick={() => {}}>
            Clear
          </DarkFunctionButton>
        </div>
      </div>
    </Modal>
  );
};
