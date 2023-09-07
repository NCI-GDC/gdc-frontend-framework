import { useState, useMemo } from "react";
import { Tooltip } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohort,
  selectAvailableCohorts,
  Cohort,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface AdditionalCohortSelectionProps {
  readonly app: string;
  readonly setActiveApp?: (id: string, demoMode?: boolean) => void;
  readonly setOpen: (open: boolean) => void;
  readonly setComparisonCohort: (cohort: Cohort) => void;
}

const AdditionalCohortSelection: React.FC<AdditionalCohortSelectionProps> = ({
  app,
  setActiveApp,
  setOpen,
  setComparisonCohort,
}: AdditionalCohortSelectionProps) => {
  const primaryCohort = useCoreSelector((state) => selectCurrentCohort(state));
  const availableCohorts = useCoreSelector((state) =>
    selectAvailableCohorts(state),
  );

  const cohorts = useMemo(
    () => availableCohorts.filter((cohort) => cohort.id !== primaryCohort.id),
    [primaryCohort, availableCohorts],
  );

  const [selectedCohort, setSelectedCohort] = useState<Cohort>(null);

  const closeCohortSelection = () => {
    setOpen(false);
    setSelectedCohort(null);
  };

  const tableData = useMemo(
    () =>
      cohorts.map((cohort) => ({
        select: (
          <Tooltip
            label="Cohort is empty"
            disabled={cohort?.counts.caseCount !== 0}
          >
            <span>
              <input
                type="radio"
                name="additional-cohort-selection"
                id={cohort.id}
                onChange={() => setSelectedCohort(cohort)}
                checked={selectedCohort?.id === cohort.id}
                aria-label={`Select ${cohort.name}`}
                disabled={!cohort?.counts.caseCount}
              />
            </span>
          </Tooltip>
        ),
        name: (
          <label
            htmlFor={cohort.id}
            className={
              !cohort?.counts.caseCount ? "text-base-lighter" : undefined
            }
          >
            {cohort.name}
          </label>
        ),
        count: (
          <span
            className={
              !cohort?.counts.caseCount ? "text-base-lighter" : undefined
            }
          >
            {cohort?.counts.caseCount.toLocaleString()}
          </span>
        ),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(cohorts), selectedCohort?.id],
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
    <div className="bg-base-max">
      <div className="p-4">
        <h2 className="font-heading text-lg font-bold py-2 text-primary-content-darkest">
          Select a cohort to compare with {primaryCohort.name}
        </h2>
        <p className="font-content pb-2 w-3/4">
          Display the survival analysis of your cohorts and compare
          characteristics such as gender, vital status and age at diagnosis.
          Create cohorts in the Analysis Center.
        </p>
        <div className="w-3/4">
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
      <div className="flex flex-row justify-end w-full sticky bottom-0 bg-base-lightest py-2 px-4">
        <FunctionButton
          className="mr-auto"
          onClick={() => {
            setActiveApp(app, true);
            closeCohortSelection();
          }}
        >
          Demo
        </FunctionButton>
        <FunctionButton
          className="mr-4"
          onClick={() => {
            setActiveApp(null);
            setOpen(false);
          }}
        >
          Cancel
        </FunctionButton>
        <DarkFunctionButton
          disabled={selectedCohort === null}
          onClick={() => {
            setOpen(false);
            setComparisonCohort(selectedCohort);
          }}
        >
          Run
        </DarkFunctionButton>
      </div>
    </div>
  );
};

export default AdditionalCohortSelection;
