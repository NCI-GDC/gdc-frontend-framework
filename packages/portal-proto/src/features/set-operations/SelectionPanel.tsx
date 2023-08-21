import React, { useMemo, useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import Link from "next/link";
import { Checkbox, Tooltip } from "@mantine/core";
import { upperFirst } from "lodash";
import { Row } from "react-table";
import {
  useCoreSelector,
  selectSetsByType,
  useGeneSetCountsQuery,
  useSsmSetCountsQuery,
  selectAvailableCohorts,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import {
  SelectedEntities,
  SelectedEntity,
  SetOperationEntityType,
} from "./types";
import { SortingState } from "@tanstack/react-table";

const shouldDisableInput = (
  entityType: string,
  count: number,
  id: string,
  selectedEntityType: SetOperationEntityType,
  selectedEntities: SelectedEntities,
): boolean => {
  return (
    (selectedEntityType !== undefined && selectedEntityType !== entityType) ||
    count === 0 ||
    (selectedEntities.length === 3 &&
      !selectedEntities.map((e) => e.id).includes(id))
  );
};

const selectEntity = (
  entity: SelectedEntity,
  selectedEntities: SelectedEntities,
  setSelectedEntities: (entities: SelectedEntities) => void,
) => {
  if (selectedEntities.map((e) => e.id).includes(entity.id)) {
    setSelectedEntities(selectedEntities.filter((e) => e.id !== entity.id));
  } else {
    setSelectedEntities([...selectedEntities, entity]);
  }
};

interface SelectCellProps {
  readonly setId: string;
  readonly name: string;
  readonly count: number;
  readonly disabled: boolean;
  readonly entityType: SetOperationEntityType;
  readonly selectedEntities: SelectedEntities;
  readonly selectedEntityType: SetOperationEntityType;
  readonly setSelectedEntities: (entities: SelectedEntities) => void;
  readonly setSelectedEntityType: (type: SetOperationEntityType) => void;
}

const SelectCell: React.FC<SelectCellProps> = ({
  setId,
  name,
  entityType,
  disabled,
  count,
  selectedEntities,
  selectedEntityType,
  setSelectedEntities,
  setSelectedEntityType,
}: SelectCellProps) => {
  return (
    <Tooltip
      label={
        selectedEntityType !== undefined && selectedEntityType !== entityType
          ? "Please choose only one entity type"
          : count === 0
          ? "Set is either empty or deprecated"
          : undefined
      }
      disabled={
        count > 0 &&
        (selectedEntityType === undefined || selectedEntityType === entityType)
      }
    >
      <span>
        <Checkbox
          classNames={{
            input: "checked:bg-accent checked:border-accent",
          }}
          disabled={disabled}
          checked={selectedEntities.map((e) => e.id).includes(setId)}
          onChange={() => {
            selectEntity(
              { id: setId, name },
              selectedEntities,
              setSelectedEntities,
            );
            setSelectedEntityType(entityType);
          }}
          aria-labelledby={`${entityType}-selection-${setId}`}
        />
      </span>
    </Tooltip>
  );
};

interface CohortSetItem {
  caseSets: Record<string, string>;
  caseCounts: Record<string, number>;
}

// custom hook to get all cohorts and counts
const useCasesSets = () => {
  const [casesSets, setCasesSets] = useState<CohortSetItem>({
    caseSets: {},
    caseCounts: {},
  });
  const cohorts = useCoreSelector(
    (state) => selectAvailableCohorts(state),
    shallowEqual,
  );

  useEffect(() => {
    const data: CohortSetItem = Object.values(cohorts).reduce(
      (acc, cohort) => {
        return {
          caseSets: { [cohort.id]: cohort.name, ...acc.caseSets },
          caseCounts: { [cohort.id]: cohort.caseCount, ...acc.caseCounts },
        };
      },
      {
        caseSets: {},
        caseCounts: {},
      },
    );
    setCasesSets(data);
  }, [cohorts]);
  return casesSets;
};

interface SelectionPanelProps {
  readonly app: string;
  readonly setActiveApp?: (id: string, demoMode?: boolean) => void;
  readonly setOpen: (open: boolean) => void;
  readonly selectedEntities: SelectedEntities;
  readonly setSelectedEntities: (entites: SelectedEntities) => void;
  readonly selectedEntityType: SetOperationEntityType;
  readonly setSelectedEntityType: (type: SetOperationEntityType) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  app,
  setActiveApp,
  setOpen,
  selectedEntities,
  setSelectedEntities,
  selectedEntityType,
  setSelectedEntityType,
}: SelectionPanelProps) => {
  const [sortBy, setSortBy] = useState<SortingState>([]);
  const geneSets = useCoreSelector((state) => selectSetsByType(state, "genes"));
  const mutationSets = useCoreSelector((state) =>
    selectSetsByType(state, "ssms"),
  );

  const { data: geneCounts } = useGeneSetCountsQuery({
    setIds: Object.keys(geneSets),
  });

  const { data: mutationCounts } = useSsmSetCountsQuery({
    setIds: Object.keys(mutationSets),
  });

  // cohorts are not sets, but we want to display them in the same table
  // the associated case set will be created when a cohort is selected
  const caseSetsAndCounts = useCasesSets();

  useEffect(() => {
    if (selectedEntities.length === 0) {
      setSelectedEntityType(undefined);
    }
  }, [selectedEntities, setSelectedEntityType]);

  const tableData = useMemo(() => {
    return [
      ...Object.entries(geneSets).map(([setId, setName]) => {
        const count = geneCounts?.[setId] || 0;
        const disabled = shouldDisableInput(
          "genes",
          count,
          setId,
          selectedEntityType,
          selectedEntities,
        );
        return {
          select: (
            <SelectCell
              setId={setId}
              name={setName}
              disabled={disabled}
              count={count}
              entityType="genes"
              selectedEntities={selectedEntities}
              selectedEntityType={selectedEntityType}
              setSelectedEntities={setSelectedEntities}
              setSelectedEntityType={setSelectedEntityType}
              key={`gene-select-${setId}`}
            />
          ),
          entityType: "genes",
          name: setName,
          setId,
          count,
        };
      }),
      ...Object.entries(mutationSets).map(([setId, setName]) => {
        const count = mutationCounts?.[setId] || 0;
        const disabled = shouldDisableInput(
          "mutations",
          count,
          setId,
          selectedEntityType,
          selectedEntities,
        );
        return {
          select: (
            <SelectCell
              setId={setId}
              name={setName}
              disabled={disabled}
              count={count}
              entityType="mutations"
              selectedEntities={selectedEntities}
              selectedEntityType={selectedEntityType}
              setSelectedEntities={setSelectedEntities}
              setSelectedEntityType={setSelectedEntityType}
              key={`mutation-select-${setId}`}
            />
          ),
          entityType: "mutations",
          name: setName,
          setId,
          count: count,
        };
      }),
      ...Object.entries(caseSetsAndCounts.caseSets).map(([setId, setName]) => {
        const count = caseSetsAndCounts.caseCounts?.[setId] || 0;
        const disabled = shouldDisableInput(
          "cohort",
          count,
          setId,
          selectedEntityType,
          selectedEntities,
        );
        return {
          select: (
            <SelectCell
              setId={setId}
              name={setName}
              disabled={disabled}
              count={count}
              entityType="cohort"
              selectedEntities={selectedEntities}
              selectedEntityType={selectedEntityType}
              setSelectedEntities={setSelectedEntities}
              setSelectedEntityType={setSelectedEntityType}
              key={`cohort-select-${setId}`}
            />
          ),
          entityType: "cohort",
          name: setName,
          setId,
          count,
        };
      }),
    ].sort((a, b) => {
      for (const sort of sortBy) {
        if (typeof a[sort.id] === "string") {
          return sort.desc
            ? b[sort.id].localeCompare(a[sort.id])
            : a[sort.id].localeCompare(b[sort.id]);
        } else {
          if (a[sort.id] > b[sort.id]) return sort.desc ? -1 : 1;
          if (a[sort.id] < b[sort.id]) return sort.desc ? 1 : -1;
        }
      }
      return 0;
    });
    // Prevent infinite rerender issue
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    JSON.stringify(caseSetsAndCounts),
    JSON.stringify(geneSets),
    JSON.stringify(geneCounts),
    JSON.stringify(mutationSets),
    JSON.stringify(mutationCounts),
    selectedEntities,
    setSelectedEntities,
    selectedEntityType,
    setSelectedEntityType,
    sortBy,
  ]);
  /* eslint-enable */

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

  const columns = useMemo(
    () => [
      {
        id: "select",
        columnName: "Select",
        visible: true,
        disableSortBy: true,
      },
      {
        id: "entityType",
        columnName: "Entity Type",
        visible: true,
        Cell: ({ value, row }: { value: string; row: Row }) => (
          <span
            className={
              shouldDisableInput(
                row.values.entityType,
                row.values.count,
                (row.original as Record<string, any>).setId,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            {upperFirst(value)}
          </span>
        ),
      },
      {
        id: "name",
        columnName: "Name",
        visible: true,
        Cell: ({ value, row }: { value: string; row: Row }) => (
          <label
            id={`${row.values.entityType}-selection-${
              (row.original as Record<string, any>).setId
            }`}
            className={
              shouldDisableInput(
                row.values.entityType,
                row.values.count,
                (row.original as Record<string, any>).setId,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            {value}
          </label>
        ),
      },
      {
        id: "count",
        columnName: "# Items",
        visible: true,
        Cell: ({ value, row }: { value: number; row: Row }) => (
          <span
            className={
              shouldDisableInput(
                row.values.entityType,
                row.values.count,
                (row.original as Record<string, any>).setId,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            {value.toLocaleString()}
          </span>
        ),
      },
    ],
    [selectedEntityType, selectedEntities],
  );

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "sortBy":
        setSortBy(obj.sortBy);
        break;
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
          Select 2 or 3 of the same set type
        </h2>
        <p className="font-content">
          Display a Venn diagram and compare/contrast your cohorts or sets of
          the same type.
        </p>
        <p className="pb-2 font-content">
          Create cohorts in the Analysis Center. Create gene/mutation sets in
          Manage Sets or in analysis tools (e.g.{" "}
          <Link
            className="text-utility-link"
            href="/analysis_page?app=MutationFrequencyApp"
          >
            <a className="text-utility-link font-content underline">
              Mutation Frequency
            </a>
          </Link>
          ).
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
              label: "sets",
            }}
            handleChange={handleChange}
            columnSorting={"manual"}
          />
        </div>
      </div>
      <div className="flex flex-row justify-end w-full sticky bottom-0 bg-base-lightest py-2 px-4">
        <FunctionButton
          className="mr-auto"
          onClick={() => {
            setSelectedEntityType(undefined);
            setSelectedEntities([]);
            setActiveApp(app, true);
            setOpen(false);
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
          disabled={selectedEntities.length < 2}
          onClick={() => setOpen(false)}
        >
          Run
        </DarkFunctionButton>
      </div>
    </div>
  );
};

export default SelectionPanel;
