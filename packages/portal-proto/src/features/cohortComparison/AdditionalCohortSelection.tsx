import { useState, useMemo } from "react";
import { Button } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohortName,
  selectAvailableCohorts,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";

interface AdditionalCohortSelectionProps {
  readonly app: Record<string, any>;
  readonly setActiveApp?: (id: string, demoMode?: boolean) => void;
  readonly setOpen: (open: boolean) => void;
  readonly setComparisonCohort: (cohort) => void;
}

const AdditionalCohortSelection: React.FC<AdditionalCohortSelectionProps> = ({
  app,
  setActiveApp,
  setOpen,
  setComparisonCohort,
}: AdditionalCohortSelectionProps) => {
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
        count: cohort?.caseCount,
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

  const columns = [
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
    <div className="bg-base-max flex flex-col flex-grow h-full ">
      <div className="flex flex-row no-wrap items-center pr-4">
        <div className="p-4 font-heading font-semibold text-primary-content-darkest">
          <p>Select a cohort to compare with {primaryCohortName}</p>
        </div>
        <div className="flex flex-row ml-auto">
          <Button
            variant={"filled"}
            onClick={() => {
              setActiveApp(`${app.id}`, true);
              closeCohortSelection();
            }}
            className="bg-primary border-primary-darkest text-primary-contrast hover:bg-primary-lighter mx-2"
          >
            Demo
          </Button>
          <div>
            <Button
              disabled={selectedCohort === null}
              variant={"filled"}
              className="bg-primary border-primary-darkest disabled:text-opacity-80 disabled:bg-base text-primary-contrast hover:bg-primary-lighter"
              onClick={() => {
                setComparisonCohort(selectedCohort);
                closeCohortSelection();
              }}
            >
              Run
            </Button>
          </div>
        </div>
      </div>

      <div className="pl-2">
        <VerticalTable
          tableData={displayedData}
          columns={columns}
          selectableRow={false}
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
      </div>
    </div>
  );
};

export default AdditionalCohortSelection;
