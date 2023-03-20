import React, { useState, useMemo, useEffect } from "react";
import { Checkbox, Badge, Tooltip } from "@mantine/core";
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

const GeneCountCell = ({ setId }: { setId: string }): JSX.Element => {
  const { data, isSuccess } = useGeneSetCountQuery({ setId });
  return (
    <Badge radius={"xs"} variant="outline">
      {isSuccess ? data.toLocaleString() : "..."}
    </Badge>
  );
};

const MutationCountCell = ({ setId }: { setId: string }): JSX.Element => {
  const { data, isSuccess } = useSsmSetCountQuery({ setId });
  return (
    <Badge radius={"xs"} variant="outline">
      {isSuccess ? data.toLocaleString() : "..."}
    </Badge>
  );
};

const SelectionPanel = (): JSX.Element => {
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

  const selectEntity = (entity: string) => {
    if (selectedEntites.includes(entity)) {
      setSelectedEntities(selectedEntites.filter((e) => e !== entity));
    } else {
      setSelectedEntities([...selectedEntites, entity]);
    }
  };

  useEffect(() => {
    if (selectedEntites.length === 0) {
      setSelectedEntityType(undefined);
    }
  }, [selectedEntites]);

  const GeneSelectCell = ({ setId }: { setId: string }): JSX.Element => {
    const { data, isSuccess } = useGeneSetCountQuery({ setId });
    const count = isSuccess ? data : 0;
    return (
      <Tooltip label={"Set is either empty or deprecated"} disabled={count > 0}>
        <span>
          <Checkbox
            disabled={
              (selectedEntityType !== undefined &&
                selectedEntityType !== "genes") ||
              count === 0 ||
              (selectedEntites.length === 3 && !selectedEntites.includes(setId))
            }
            checked={selectedEntites.includes(setId)}
            onChange={() => {
              selectEntity(setId);
              setSelectedEntityType("genes");
            }}
          />
        </span>
      </Tooltip>
    );
  };

  const MutationSelectCell = ({ setId }: { setId: string }): JSX.Element => {
    const { data, isSuccess } = useSsmSetCountQuery({ setId });
    const count = isSuccess ? data : 0;

    return (
      <Tooltip label={"Set is either empty or deprecated"} disabled={count > 0}>
        <span>
          <Checkbox
            disabled={
              (selectedEntityType !== undefined &&
                selectedEntityType !== "mutations") ||
              count === 0 ||
              (selectedEntites.length === 3 && !selectedEntites.includes(setId))
            }
            checked={selectedEntites.includes(setId)}
            onChange={() => {
              selectEntity(setId);
              setSelectedEntityType("mutations");
            }}
          />
        </span>
      </Tooltip>
    );
  };

  const tableData = useMemo(() => {
    return [
      ...availableCohorts.map((cohort) => ({
        select: (
          <Tooltip label={"Cohort is empty"} disabled={cohort.caseCount > 0}>
            <span>
              <Checkbox
                disabled={
                  (selectedEntityType !== undefined &&
                    selectedEntityType !== "cohort") ||
                  cohort.caseCount === 0 ||
                  (selectedEntites.length === 3 &&
                    !selectedEntites.includes(cohort.id))
                }
                checked={selectedEntites.includes(cohort.id)}
                onChange={() => {
                  selectEntity(cohort.id);
                  setSelectedEntityType("cohort");
                }}
              />
            </span>
          </Tooltip>
        ),
        entityType: "Cases",
        name: cohort.name,
        count: (
          <Badge radius={"xs"} variant="outline">
            {cohort.caseCount.toLocaleString()}
          </Badge>
        ),
      })),
      ...Object.entries(geneSets).map(([setId, setName]) => ({
        select: <GeneSelectCell setId={setId} />,
        entityType: "Genes",
        name: setName,
        count: <GeneCountCell setId={setId} />,
      })),
      ...Object.entries(mutationSets).map(([setId, setName]) => ({
        select: <MutationSelectCell setId={setId} />,
        entityType: "Mutations",
        name: setName,
        count: <MutationCountCell setId={setId} />,
      })),
    ];
  }, [
    availableCohorts,
    geneSets,
    mutationSets,
    selectedEntites,
    selectedEntityType,
    //GeneSelectCell,
    //MutationSelectCell,
    //selectEntity,
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

  const columns = [
    {
      id: "select",
      columnName: "Select",
      visible: true,
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
    <div className="bg-base-max flex flex-col flex-grow h-full p-4">
      <h2 className="text-heading py-2">Select 2 or 3 of the same set type</h2>
      <p className="pb-2">
        Display a Venn diagram and compare/contrast your cohorts or sets of the
        same type. Create cohorts in the Analysis Center. Create gene/mutation
        sets in Manage Sets or in analysis tools (e.g. Mutation Frequency).
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
          label: "cohorts",
        }}
        handleChange={handleChange}
      />
    </div>
  );
};

export default SelectionPanel;
