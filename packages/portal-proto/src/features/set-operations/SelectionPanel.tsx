// This table can be found at /analysis_page?app=SetOperations
import React, { useMemo, useEffect, useState, useId } from "react";
import { shallowEqual } from "react-redux";
import Link from "next/link";
import { Checkbox, Tooltip } from "@mantine/core";
import { upperFirst } from "lodash";
import {
  useCoreSelector,
  selectSetsByType,
  useGeneSetCountsQuery,
  useSsmSetCountsQuery,
  selectAvailableCohorts,
} from "@gff/core";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import {
  SelectedEntities,
  SelectedEntity,
  SetOperationEntityType,
} from "./types";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import { entityTypes } from "@/components/BioTree/types";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";

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
  readonly componentId: string;
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
  componentId,
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
          data-testid={`checkbox-${name}-set-operations`}
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
          aria-labelledby={`${componentId}-${entityType}-selection-${setId}`}
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
          caseCounts: {
            [cohort.id]: cohort.counts.caseCount,
            ...acc.caseCounts,
          },
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
  setActiveApp,
  setOpen,
  selectedEntities,
  setSelectedEntities,
  selectedEntityType,
  setSelectedEntityType,
}: SelectionPanelProps) => {
  const componentId = useId();
  const [sortBy, setSortBy] = useState<SortingState>([]);
  const geneSets = useCoreSelector((state) => selectSetsByType(state, "genes"));
  const mutationSets = useCoreSelector((state) =>
    selectSetsByType(state, "ssms"),
  );

  const { data: geneCounts, isSuccess: isGeneSuccess } = useGeneSetCountsQuery({
    setIds: Object.keys(geneSets),
  });

  const { data: mutationCounts, isSuccess: isMutationSuccess } =
    useSsmSetCountsQuery({
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

  const tableData = useDeepCompareMemo(() => {
    return [
      ...Object.entries(geneSets).map(([setId, setName]) => {
        const count = geneCounts?.[setId] || 0;

        return {
          entity_type: "genes",
          name: setName,
          setId,
          count,
        };
      }),
      ...Object.entries(mutationSets).map(([setId, setName]) => {
        const count = mutationCounts?.[setId] || 0;

        return {
          entity_type: "mutations",
          name: setName,
          setId,
          count: count,
        };
      }),
      ...Object.entries(caseSetsAndCounts.caseSets).map(([setId, setName]) => {
        const count = caseSetsAndCounts.caseCounts?.[setId] || 0;

        return {
          entity_type: "cohort",
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
  }, [
    caseSetsAndCounts,
    geneSets,
    geneCounts,
    mutationSets,
    mutationCounts,
    sortBy,
  ]);

  const setSelectionPanelColumnHelper =
    createColumnHelper<typeof tableData[0]>();
  const [sorting, setSorting] = useState<SortingState>([]);

  const setSelectionPanelColumns = useMemo(
    () => [
      setSelectionPanelColumnHelper.display({
        id: "select",
        header: "Select",
        cell: ({ row }) => {
          const disabled = shouldDisableInput(
            row.original.entity_type,
            row.original.count,
            row.original.setId,
            selectedEntityType,
            selectedEntities,
          );

          return (
            <SelectCell
              setId={row.original.setId}
              name={row.original.name}
              disabled={disabled}
              count={row.original.count}
              entityType={row.original.entity_type as SetOperationEntityType}
              selectedEntities={selectedEntities}
              selectedEntityType={selectedEntityType}
              setSelectedEntities={setSelectedEntities}
              setSelectedEntityType={setSelectedEntityType}
              key={`${entityTypes}-select-${row.original.setId}`}
              componentId={componentId}
            />
          );
        },
      }),
      setSelectionPanelColumnHelper.accessor("entity_type", {
        id: "entity_type",
        header: "Entity Type",
        cell: ({ getValue, row }) => (
          <span
            data-testid="text-entity-type-set-operations"
            className={
              shouldDisableInput(
                row.original.entity_type,
                row.original.count,
                (row.original as Record<string, any>).setId,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            {upperFirst(getValue())}
          </span>
        ),
      }),
      setSelectionPanelColumnHelper.accessor("name", {
        id: "name",
        header: "Name",
        cell: ({ getValue, row }) => (
          <span
            data-testid="text-entity-name-set-operations"
            id={`${componentId}-${row.original.entity_type}-selection-${
              (row.original as Record<string, any>).setId
            }`}
            className={
              shouldDisableInput(
                row.original.entity_type,
                row.original.count,
                (row.original as Record<string, any>).setId,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            {getValue()}
          </span>
        ),
      }),
      setSelectionPanelColumnHelper.accessor("count", {
        id: "count",
        header: "# Items",
        cell: ({ getValue, row }) => (
          <span
            data-testid={`text-${row.original.name}-item-count-set-operations`}
            className={
              shouldDisableInput(
                row.original.entity_type,
                row.original.count,
                (row.original as Record<string, any>).setId,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            {getValue().toLocaleString()}
          </span>
        ),
      }),
    ],
    [
      selectedEntities,
      selectedEntityType,
      setSelectedEntities,
      setSelectedEntityType,
      setSelectionPanelColumnHelper,
      componentId,
    ],
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

  useDeepCompareEffect(() => {
    setSortBy(sorting);
  }, [sorting]);

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
          Select 2 or 3 of the same set type
        </h2>
        <p className="font-content">
          Display a Venn diagram and compare/contrast your cohorts or sets of
          the same type.
        </p>
        <p className="pb-2 font-content">
          Create cohorts in the Analysis Center. Create gene/mutation sets in{" "}
          <Link
            data-testid="link-manage-sets"
            href="/manage_sets"
            className="text-utility-link font-content underline"
          >
            Manage Sets
          </Link>{" "}
          or in analysis tools (e.g.{" "}
          <Link
            data-testid="link-mutation-frequency"
            href="/analysis_page?app=MutationFrequencyApp"
            className="text-utility-link font-content underline"
          >
            Mutation Frequency
          </Link>
          ).
        </p>
        <div className="w-3/4">
          <VerticalTable
            data={displayedData}
            columns={setSelectionPanelColumns}
            pagination={{
              page,
              pages,
              size,
              from,
              total,
              label: "set",
            }}
            status={
              isGeneSuccess && isMutationSuccess ? "fulfilled" : "pending"
            }
            sorting={sorting}
            setSorting={setSorting}
            handleChange={handleChange}
            columnSorting="manual"
          />
        </div>
      </div>
      <div className="flex flex-row justify-end w-full sticky bottom-0 bg-base-lightest py-2 px-4">
        <FunctionButton
          data-testid="button-cancel-set-operations"
          className="mr-4"
          onClick={() => {
            setActiveApp(null);
            setOpen(false);
          }}
        >
          Cancel
        </FunctionButton>
        <DarkFunctionButton
          data-testid="button-run-set-operations"
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
