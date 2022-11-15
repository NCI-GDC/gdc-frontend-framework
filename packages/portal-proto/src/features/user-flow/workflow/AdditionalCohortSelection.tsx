import { useState, useMemo } from "react";
import { Button, Grid } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohortName,
  setComparisonCohorts,
  useCoreDispatch,
  selectAvailableCohorts,
} from "@gff/core";
import { REGISTERED_APPS } from "./registeredApps";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";

interface AdditionalCohortSelectionProps {
  readonly app: string;
  readonly setActiveApp?: (id: string) => void;
  readonly setOpen: (open: boolean) => void;
}

const AdditionalCohortSelection: React.FC<AdditionalCohortSelectionProps> = ({
  app,
  setActiveApp,
  setOpen,
}: AdditionalCohortSelectionProps) => {
  const dispatch = useCoreDispatch();
  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );
  const availableCohorts = useCoreSelector((state) =>
    selectAvailableCohorts(state),
  );

  const cohorts = useMemo(
    () =>
      availableCohorts.filter((cohort) => cohort.name !== primaryCohortName),
    [primaryCohortName, availableCohorts],
  );

  const [selectedCohort, setSelectedCohort] = useState(null);

  const closeCohortSelection = () => {
    setOpen(false);
    setSelectedCohort(null);
  };
  const currentApp = REGISTERED_APPS.find((a) => a.id === app);

  const tableData = useMemo(
    () =>
      cohorts.map((cohort) => ({
        select: (
          <input
            type="radio"
            name="additional-cohort-selection"
            id={cohort.id}
            onChange={() => setSelectedCohort(cohort.name)}
            checked={selectedCohort === cohort.name}
            aria-label={`Select ${cohort.name}`}
          />
        ),
        name: <label htmlFor={cohort.name}>{cohort.name}</label>,
        count: cohort?.counts,
      })),
    [cohorts, selectedCohort],
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
  } = useStandardPagination(tableData);

  const columnListOrder = [
    {
      id: "select",
      columnName: "Select",
      visible: true,
    },
    {
      id: "name",
      columnName: "Name",
      visible: true,
    },
    { id: "count", columnName: "# Cases", visible: true },
  ];
  const columnCells = [
    { Header: "Select", accessor: "select" },
    { Header: "Name", accessor: "name" },
    { Header: "# Cases", accessor: "count" },
  ];

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
    <div className="bg-base-lightest flex flex-col flex-grow h-full ">
      <Grid className={`flex-grow p-2 m-2`}>
        <Grid.Col span={3} className="p-4 text-primary-content-darkest">
          <p>Select a cohort to compare with {primaryCohortName}</p>
        </Grid.Col>
        <Grid.Col span={9}>
          <VerticalTable
            tableData={displayedData}
            columnListOrder={columnListOrder}
            columnCells={columnCells}
            selectableRow={false}
            handleColumnChange={undefined}
            showControls={false}
            pagination={{
              page,
              pages,
              size,
              from,
              total,
              label: "cohorts",
            }}
            handleChange={handleChange}
          />
        </Grid.Col>
      </Grid>
      <div className={`p-4 bg-base-lightest w-full justify-between flex`}>
        <Button
          onClick={() => {
            setActiveApp(`${currentApp.id}Demo`);
            closeCohortSelection();
          }}
          className="bg-base-lightest border-primary-darkest text-primary-content-darkest"
        >
          Demo
        </Button>
        <div>
          <Button
            disabled={selectedCohort === null}
            variant={"filled"}
            className="bg-primary-darkest hover:bg-primary"
            onClick={() => {
              dispatch(setComparisonCohorts([selectedCohort]));
              closeCohortSelection();
            }}
          >
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalCohortSelection;
