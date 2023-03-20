import React, { useState, useMemo, useEffect } from "react";
import { Checkbox, Badge } from "@mantine/core";
import {
  useCoreSelector,
  selectAvailableCohorts,
  selectSetsByType,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";

const SelectionPanel = () => {
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

  const tableData = useMemo(() => {
    return [
      ...availableCohorts.map((cohort) => ({
        select: (
          <Checkbox
            disabled={
              selectedEntityType !== undefined &&
              selectedEntityType !== "cohort"
            }
            checked={selectedEntites.includes(cohort.id)}
            onChange={() => {
              selectEntity(cohort.id);
              setSelectedEntityType("cohort");
            }}
          />
        ),
        entityType: "Cohort",
        name: cohort.name,
        count: <Badge>{cohort.caseCount.toLocaleString()}</Badge>,
      })),
      ...Object.entries(geneSets).map(([setId, setName]) => ({
        select: (
          <Checkbox
            disabled={
              selectedEntityType !== undefined && selectedEntityType !== "genes"
            }
            checked={selectedEntites.includes(setId)}
            onChange={() => {
              selectEntity(setId);
              setSelectedEntityType("genes");
            }}
          />
        ),
        entityType: "Genes",
        name: setName,
        count: 0,
      })),
      ...Object.entries(mutationSets).map(([setId, setName]) => ({
        select: (
          <Checkbox
            disabled={
              selectedEntityType !== undefined &&
              selectedEntityType !== "mutations"
            }
            checked={selectedEntites.includes(setId)}
            onChange={() => {
              selectEntity(setId);
              setSelectedEntityType("mutations");
            }}
          />
        ),
        entityType: "Mutations",
        name: setName,
        count: 0,
      })),
    ];
  }, [
    availableCohorts,
    geneSets,
    mutationSets,
    selectedEntites,
    selectedEntityType,
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
