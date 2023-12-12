import { useState, useMemo } from "react";
import { Tooltip } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohort,
  selectAvailableCohorts,
  Cohort,
} from "@gff/core";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { createColumnHelper } from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";
import { useDeepCompareMemo } from "use-deep-compare";

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

  const cohorts = useDeepCompareMemo(
    () => availableCohorts.filter((cohort) => cohort.id !== primaryCohort.id),
    [primaryCohort, availableCohorts],
  );

  const [selectedCohort, setSelectedCohort] = useState<Cohort>(null);

  const closeCohortSelection = () => {
    setOpen(false);
    setSelectedCohort(null);
  };

  const cohortListTableColumnHelper = createColumnHelper<typeof cohorts[0]>();

  const cohortListTableColumns = useMemo(
    () => [
      cohortListTableColumnHelper.display({
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <Tooltip
            label="Cohort is empty"
            disabled={row.original?.counts.caseCount !== 0}
          >
            <span>
              <input
                type="radio"
                name="additional-cohort-selection"
                id={row.original.id}
                onChange={() => setSelectedCohort(row.original)}
                checked={selectedCohort?.id === row.original.id}
                aria-label={`Select ${row.original.name}`}
                disabled={!row.original?.counts.caseCount}
              />
            </span>
          </Tooltip>
        ),
      }),
      cohortListTableColumnHelper.display({
        id: "name",
        header: "Name",
        cell: ({ row }) => (
          <label
            htmlFor={row.original.id}
            className={
              !row.original.counts.caseCount ? "text-base-lighter" : undefined
            }
          >
            {row.original.name}
          </label>
        ),
      }),
      cohortListTableColumnHelper.display({
        id: "count",
        header: "# Cases",
        cell: ({ row }) => (
          <span
            className={
              !row.original.counts.caseCount ? "text-base-lighter" : undefined
            }
          >
            {row.original.counts.caseCount?.toLocaleString()}
          </span>
        ),
      }),
    ],
    [cohortListTableColumnHelper, selectedCohort?.id],
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
  } = useStandardPagination(cohorts);

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
            data={displayedData}
            columns={cohortListTableColumns}
            pagination={{
              page,
              pages,
              size,
              from,
              total,
              label: "cohorts",
            }}
            status="fulfilled"
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
