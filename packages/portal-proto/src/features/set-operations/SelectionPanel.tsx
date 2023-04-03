import React, { useMemo, useEffect } from "react";
import Link from "next/link";
import { Checkbox, Tooltip } from "@mantine/core";
import {
  useCoreSelector,
  //selectAvailableCohorts,
  selectSetsByType,
  useGeneSetCountQuery,
  useSsmSetCountQuery,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { GeneCountCell, MutationCountCell } from "./CountCell";
import {
  SelectedEntities,
  SelectedEntity,
  SetOperationEntityType,
} from "./types";

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
  readonly selectedEntities: SelectedEntities;
  readonly selectedEntityType: SetOperationEntityType;
  readonly setSelectedEntities: (entities: SelectedEntities) => void;
  readonly setSelectedEntityType: (type: SetOperationEntityType) => void;
  readonly name: string;
}

const GeneSelectCell: React.FC<SelectCellProps> = ({
  setId,
  selectedEntities,
  selectedEntityType,
  setSelectedEntities,
  setSelectedEntityType,
  name,
}: SelectCellProps) => {
  const { data, isSuccess } = useGeneSetCountQuery({ setId });
  const count = isSuccess ? data : 0;
  return (
    <Tooltip label={"Set is either empty or deprecated"} disabled={count > 0}>
      <span>
        <Checkbox
          classNames={{
            input: "checked:bg-accent",
          }}
          disabled={shouldDisableInput(
            "genes",
            count,
            setId,
            selectedEntityType,
            selectedEntities,
          )}
          checked={selectedEntities.map((e) => e.id).includes(setId)}
          onChange={() => {
            selectEntity(
              { id: setId, name },
              selectedEntities,
              setSelectedEntities,
            );
            setSelectedEntityType("genes");
          }}
          aria-labelledby={`gene-selection-${setId}`}
        />
      </span>
    </Tooltip>
  );
};

const MutationSelectCell: React.FC<SelectCellProps> = ({
  setId,
  selectedEntities,
  selectedEntityType,
  setSelectedEntities,
  setSelectedEntityType,
  name,
}: SelectCellProps) => {
  const { data, isSuccess } = useSsmSetCountQuery({ setId });
  const count = isSuccess ? data : 0;

  return (
    <Tooltip label={"Set is either empty or deprecated"} disabled={count > 0}>
      <span>
        <Checkbox
          classNames={{
            input: "checked:bg-accent",
          }}
          disabled={shouldDisableInput(
            "mutations",
            count,
            setId,
            selectedEntityType,
            selectedEntities,
          )}
          checked={selectedEntities.map((e) => e.id).includes(setId)}
          onChange={() => {
            selectEntity(
              { id: setId, name },
              selectedEntities,
              setSelectedEntities,
            );
            setSelectedEntityType("mutations");
          }}
          aria-labelledby={`mutation-selection-${setId}`}
        />
      </span>
    </Tooltip>
  );
};

interface LabelCellProps {
  readonly setId: string;
  readonly setName: string;
  readonly selectedEntities: SelectedEntities;
  readonly selectedEntityType: SetOperationEntityType;
}

const GeneLabelCell: React.FC<LabelCellProps> = ({
  setId,
  setName,
  selectedEntities,
  selectedEntityType,
}: LabelCellProps) => {
  const { data, isSuccess } = useGeneSetCountQuery({ setId });
  const count = isSuccess ? data : 0;

  return (
    <label
      id={`gene-selection-${setId}`}
      className={
        shouldDisableInput(
          "genes",
          count,
          setId,
          selectedEntityType,
          selectedEntities,
        )
          ? "text-base-lighter"
          : undefined
      }
    >
      {setName}
    </label>
  );
};

const MutationLabelCell: React.FC<LabelCellProps> = ({
  setId,
  setName,
  selectedEntities,
  selectedEntityType,
}: LabelCellProps) => {
  const { data, isSuccess } = useSsmSetCountQuery({ setId });
  const count = isSuccess ? data : 0;

  return (
    <label
      id={`mutation-selection-${setId}`}
      className={
        shouldDisableInput(
          "mutations",
          count,
          setId,
          selectedEntityType,
          selectedEntities,
        )
          ? "text-base-lighter"
          : undefined
      }
    >
      {setName}
    </label>
  );
};

interface EntityTypeCellProps {
  readonly setId: string;
  readonly selectedEntities: SelectedEntities;
  readonly selectedEntityType: SetOperationEntityType;
}

const GeneEntityTypeCell: React.FC<EntityTypeCellProps> = ({
  setId,
  selectedEntities,
  selectedEntityType,
}: EntityTypeCellProps) => {
  const { data, isSuccess } = useGeneSetCountQuery({ setId });
  const count = isSuccess ? data : 0;
  return (
    <span
      className={
        shouldDisableInput(
          "genes",
          count,
          setId,
          selectedEntityType,
          selectedEntities,
        )
          ? "text-base-lighter"
          : undefined
      }
    >
      Genes
    </span>
  );
};

const MutationEntityTypeCell: React.FC<EntityTypeCellProps> = ({
  setId,
  selectedEntities,
  selectedEntityType,
}: EntityTypeCellProps) => {
  const { data, isSuccess } = useSsmSetCountQuery({ setId });
  const count = isSuccess ? data : 0;
  return (
    <span
      className={
        shouldDisableInput(
          "mutations",
          count,
          setId,
          selectedEntityType,
          selectedEntities,
        )
          ? "text-base-lighter"
          : undefined
      }
    >
      Mutations
    </span>
  );
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
  // TODO: implement cohorts in set operations
  //const availableCohorts = useCoreSelector((state) =>
  //  selectAvailableCohorts(state),
  //);
  const availableCohorts = [];
  const geneSets = useCoreSelector((state) => selectSetsByType(state, "genes"));
  const mutationSets = useCoreSelector((state) =>
    selectSetsByType(state, "ssms"),
  );

  useEffect(() => {
    if (selectedEntities.length === 0) {
      setSelectedEntityType(undefined);
    }
  }, [selectedEntities, setSelectedEntityType]);

  const tableData = useMemo(() => {
    return [
      ...availableCohorts.map((cohort) => ({
        select: (
          <Tooltip label={"Cohort is empty"} disabled={cohort.caseCount > 0}>
            <span>
              <Checkbox
                classNames={{
                  input: "checked:bg-accent",
                }}
                disabled={shouldDisableInput(
                  "cohort",
                  cohort?.caseCount || 0,
                  cohort.id,
                  selectedEntityType,
                  selectedEntities,
                )}
                checked={selectedEntities.map((e) => e.id).includes(cohort.id)}
                onChange={() => {
                  selectEntity(
                    {
                      id: cohort.id,
                      name: cohort.name,
                    },
                    selectedEntities,
                    setSelectedEntities,
                  );
                  setSelectedEntityType("cohort");
                }}
                aria-labelledby={`cohort-selection-${cohort.id}`}
              />
            </span>
          </Tooltip>
        ),
        entityType: (
          <span
            className={
              shouldDisableInput(
                "cohort",
                cohort?.caseCount || 0,
                cohort.id,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            Cases
          </span>
        ),
        name: (
          <label
            id={`cohort-selection-${cohort.id}`}
            className={
              shouldDisableInput(
                "cohort",
                cohort?.caseCount || 0,
                cohort.id,
                selectedEntityType,
                selectedEntities,
              )
                ? "text-base-lighter"
                : undefined
            }
          >
            {cohort.name}
          </label>
        ),
        count: (cohort?.caseCount || 0).toLocaleString(),
      })),
      ...Object.entries(geneSets).map(([setId, setName]) => ({
        select: (
          <GeneSelectCell
            setId={setId}
            selectedEntities={selectedEntities}
            selectedEntityType={selectedEntityType}
            setSelectedEntities={setSelectedEntities}
            setSelectedEntityType={setSelectedEntityType}
            name={setName}
          />
        ),
        entityType: (
          <GeneEntityTypeCell
            setId={setId}
            selectedEntities={selectedEntities}
            selectedEntityType={selectedEntityType}
          />
        ),
        name: (
          <GeneLabelCell
            setId={setId}
            setName={setName}
            selectedEntities={selectedEntities}
            selectedEntityType={selectedEntityType}
          />
        ),
        count: <GeneCountCell setId={setId} />,
      })),
      ...Object.entries(mutationSets).map(([setId, setName]) => ({
        select: (
          <MutationSelectCell
            setId={setId}
            selectedEntities={selectedEntities}
            selectedEntityType={selectedEntityType}
            setSelectedEntities={setSelectedEntities}
            setSelectedEntityType={setSelectedEntityType}
            name={setName}
          />
        ),
        entityType: (
          <MutationEntityTypeCell
            setId={setId}
            selectedEntities={selectedEntities}
            selectedEntityType={selectedEntityType}
          />
        ),
        name: (
          <MutationLabelCell
            setId={setId}
            setName={setName}
            selectedEntities={selectedEntities}
            selectedEntityType={selectedEntityType}
          />
        ),
        count: <MutationCountCell setId={setId} />,
      })),
    ];
    // Prevent infinite rerender issue
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    JSON.stringify(availableCohorts),
    JSON.stringify(geneSets),
    JSON.stringify(mutationSets),
    selectedEntities,
    selectedEntityType,
    setSelectedEntityType,
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
      },
      {
        id: "name",
        columnName: "Name",
        visible: true,
      },
      { id: "count", columnName: "# Items", visible: true },
    ],
    [],
  );

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
        <h2 className="font-heading text-lg font-bold py-2">
          Select 2 or 3 of the same set type
        </h2>
        <p className="pb-2">
          Display a Venn diagram and compare/contrast your cohorts or sets of
          the same type. Create cohorts in the Analysis Center. Create
          gene/mutation sets in Manage Sets or in analysis tools (e.g.{" "}
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
          columnSorting={"enable"}
        />
      </div>
      <div className="flex flex-row justify-end w-full sticky bottom-0 bg-base-lightest py-2 px-4">
        <FunctionButton
          className="mr-auto"
          onClick={() => {
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
