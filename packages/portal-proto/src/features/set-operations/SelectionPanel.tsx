import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Checkbox, Tooltip } from "@mantine/core";
import {
  useCoreSelector,
  selectAvailableCohorts,
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

const GeneCountCell = ({ setId }: { setId: string }): JSX.Element => {
  const { data, isSuccess } = useGeneSetCountQuery({ setId });
  return isSuccess ? data.toLocaleString() : "...";
};

const MutationCountCell = ({ setId }: { setId: string }): JSX.Element => {
  const { data, isSuccess } = useSsmSetCountQuery({ setId });
  return isSuccess ? data.toLocaleString() : "...";
};

interface SelectionPanelProps {
  readonly app: Record<string, any>;
  readonly setActiveApp?: (id: string, demoMode?: boolean) => void;
  readonly setOpen: (open: boolean) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  app,
  setActiveApp,
  setOpen,
}: SelectionPanelProps) => {
  const [selectedEntites, setSelectedEntities] = useState<string[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<
    "cohort" | "genes" | "mutations" | undefined
  >(undefined);

  const availableCohorts = useCoreSelector((state) =>
    selectAvailableCohorts(state),
  );
  const geneSets = useCoreSelector((state) => selectSetsByType(state, "genes"));
  const mutationSets = useCoreSelector((state) =>
    selectSetsByType(state, "ssms"),
  );

  useEffect(() => {
    if (selectedEntites.length === 0) {
      setSelectedEntityType(undefined);
    }
  }, [selectedEntites]);

  const tableData = useMemo(() => {
    const selectEntity = (entity: string) => {
      if (selectedEntites.includes(entity)) {
        setSelectedEntities(selectedEntites.filter((e) => e !== entity));
      } else {
        setSelectedEntities([...selectedEntites, entity]);
      }
    };

    const GeneSelectCell = ({ setId }: { setId: string }): JSX.Element => {
      const { data, isSuccess } = useGeneSetCountQuery({ setId });
      const count = isSuccess ? data : 0;
      return (
        <Tooltip
          label={"Set is either empty or deprecated"}
          disabled={count > 0}
        >
          <span>
            <Checkbox
              classNames={{
                input: "checked:bg-accent",
              }}
              disabled={
                (selectedEntityType !== undefined &&
                  selectedEntityType !== "genes") ||
                count === 0 ||
                (selectedEntites.length === 3 &&
                  !selectedEntites.includes(setId))
              }
              checked={selectedEntites.includes(setId)}
              onChange={() => {
                selectEntity(setId);
                setSelectedEntityType("genes");
              }}
              aria-labelledby={`gene-selection-${setId}`}
            />
          </span>
        </Tooltip>
      );
    };

    const MutationSelectCell = ({ setId }: { setId: string }): JSX.Element => {
      const { data, isSuccess } = useSsmSetCountQuery({ setId });
      const count = isSuccess ? data : 0;

      return (
        <Tooltip
          label={"Set is either empty or deprecated"}
          disabled={count > 0}
        >
          <span>
            <Checkbox
              classNames={{
                input: "checked:bg-accent",
              }}
              disabled={
                (selectedEntityType !== undefined &&
                  selectedEntityType !== "mutations") ||
                count === 0 ||
                (selectedEntites.length === 3 &&
                  !selectedEntites.includes(setId))
              }
              checked={selectedEntites.includes(setId)}
              onChange={() => {
                selectEntity(setId);
                setSelectedEntityType("mutations");
              }}
              aria-labelledby={`mutation-selection-${setId}`}
            />
          </span>
        </Tooltip>
      );
    };

    return [
      ...availableCohorts.map((cohort) => ({
        select: (
          <Tooltip label={"Cohort is empty"} disabled={cohort.caseCount > 0}>
            <span>
              <Checkbox
                classNames={{
                  input: "checked:bg-accent",
                }}
                disabled={
                  (selectedEntityType !== undefined &&
                    selectedEntityType !== "cohort") ||
                  (cohort?.caseCount || 0) === 0 ||
                  (selectedEntites.length === 3 &&
                    !selectedEntites.includes(cohort.id))
                }
                checked={selectedEntites.includes(cohort.id)}
                onChange={() => {
                  selectEntity(cohort.id);
                  setSelectedEntityType("cohort");
                }}
                aria-labelledby={`cohort-selection-${cohort.id}`}
              />
            </span>
          </Tooltip>
        ),
        entityType: "Cases",
        name: <label id={`cohort-selection-${cohort.id}`}>{cohort.name}</label>,
        count: cohort.caseCount.toLocaleString(),
      })),
      ...Object.entries(geneSets).map(([setId, setName]) => ({
        select: <GeneSelectCell setId={setId} />,
        entityType: "Genes",
        name: <label id={`gene-selection-${setId}`}>{setName}</label>,
        count: <GeneCountCell setId={setId} />,
      })),
      ...Object.entries(mutationSets).map(([setId, setName]) => ({
        select: <MutationSelectCell setId={setId} />,
        entityType: "Mutations",
        name: <label id={`mutation-selection-${setId}`}>{setName}</label>,
        count: <MutationCountCell setId={setId} />,
      })),
    ];
  }, [
    JSON.stringify(availableCohorts),
    JSON.stringify(geneSets),
    JSON.stringify(mutationSets),
    selectedEntites,
    selectedEntityType,
    setSelectedEntityType,
  ]);

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
    <div>
      <div className="bg-base-max flex flex-col flex-grow h-full p-4">
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
      <div className="flex flex-row justify-end ml-auto sticky bg-base-lightest py-2 px-4">
        <FunctionButton
          className="mr-auto"
          onClick={() => {
            setActiveApp(`${app.id}`, true);
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
        <DarkFunctionButton disabled={selectedEntites.length < 2}>
          Run
        </DarkFunctionButton>
      </div>
    </div>
  );
};

export default SelectionPanel;
