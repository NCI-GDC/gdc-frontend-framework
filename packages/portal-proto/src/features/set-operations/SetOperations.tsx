import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { pickBy, upperFirst } from "lodash";
import { Checkbox, Badge, Tooltip } from "@mantine/core";
import {
  useCreateSsmsSetFromFiltersMutation,
  useCreateGeneSetFromFiltersMutation,
} from "@gff/core";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { GeneCountCell, MutationCountCell } from "./CountCell";
import { SelectedEntities, SetOperationEntityType } from "./types";
const VennDiagram = dynamic(() => import("../charts/VennDiagram"), {
  ssr: false,
});

const ENTITY_TYPE_TO_FIELD = {
  genes: "genes.gene_id",
  mutations: "ssms.ssm_id",
};

interface SetOperationsExternalProps {
  readonly sets: SelectedEntities;
  readonly entityType: SetOperationEntityType;
  readonly queryHook: UseQuery<QueryDefinition<any, any, any, any, string>>;
}

const createSetFiltersByKey = (
  key: string,
  entityType: SetOperationEntityType,
  sets: SelectedEntities,
) => {
  let filters;

  const set1Filters = {
    content: {
      field: ENTITY_TYPE_TO_FIELD[entityType],
      value: `set_id:${sets[0].id}`,
    },
  };

  const set2Filters = {
    content: {
      field: ENTITY_TYPE_TO_FIELD[entityType],
      value: `set_id:${sets[1].id}`,
    },
  };

  const set3Filters = sets[2]
    ? {
        content: {
          field: ENTITY_TYPE_TO_FIELD[entityType],
          value: `set_id:${sets[2].id}`,
        },
      }
    : {};

  switch (key) {
    case "S1_intersect_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set2Filters,
          },
        ],
      };
      break;
    case "S1_minus_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
        ],
      };
      break;
    case "S2_minus_S1":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
        ],
      };
      break;
    case "S1_intersect_S2_intersect_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "in",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S1_intersect_S2_minus_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S2_intersect_S3_minus_S1":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "in",
            ...set3Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
        ],
      };
      break;
    case "S1_intersect_S3_minus_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set3Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
        ],
      };
      break;
    case "S1_minus_S2_union_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S2_minus_S1_union_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S3_minus_S1_union_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set3Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
        ],
      };
      break;
  }

  return filters;
};

export const SetOperationsTwo: React.FC<SetOperationsExternalProps> = ({
  sets,
  entityType,
  queryHook,
}: SetOperationsExternalProps) => {
  const { data: intersectionData } = queryHook({
    filters: {
      filters: createSetFiltersByKey("S1_intersect_S2", entityType, sets),
    },
  });

  const { data: s1MinusS2Data } = queryHook({
    filters: {
      filters: createSetFiltersByKey("S1_minus_S2", entityType, sets),
    },
  });

  const { data: s2MinusS1Data } = queryHook({
    filters: {
      filters: createSetFiltersByKey("S2_minus_S1", entityType, sets),
    },
  });

  const data = [
    { label: "( S1 ∩ S2 )", key: "S1_intersect_S2", value: intersectionData },
    { label: "( S1 ) - ( S2 )", key: "S1_minus_S2", value: s1MinusS2Data },
    { label: "( S2 ) - ( S1 )", key: "S2_minus_S1", value: s2MinusS1Data },
  ];

  return (
    <SetOperations
      sets={sets}
      entityType={entityType}
      data={data}
      queryHook={queryHook}
    />
  );
};

export const SetOperationsThree: React.FC<SetOperationsExternalProps> = ({
  sets,
  entityType,
  queryHook,
}: SetOperationsExternalProps) => {
  const { data: intersectionData } = queryHook({
    filters: {
      filters: createSetFiltersByKey(
        "S1_intersect_S2_intersect_S3",
        entityType,
        sets,
      ),
    },
  });

  const { data: s1IntersectS2MinusS3Data } = queryHook({
    filters: {
      filters: createSetFiltersByKey(
        "S1_intersect_S2_minus_S3",
        entityType,
        sets,
      ),
    },
  });

  const { data: s2IntersectS3MinusS1Data } = queryHook({
    filters: {
      filters: createSetFiltersByKey(
        "S2_intersect_S3_minus_S1",
        entityType,
        sets,
      ),
    },
  });

  const { data: s1IntersectS3MinusS2 } = queryHook({
    filters: {
      filters: createSetFiltersByKey(
        "S1_intersect_S3_minus_S2",
        entityType,
        sets,
      ),
    },
  });

  const { data: s1MinusS2UnionS3 } = queryHook({
    filters: {
      filters: createSetFiltersByKey("S1_minus_S2_union_S3", entityType, sets),
    },
  });

  const { data: s2MinusS1UnionS3 } = queryHook({
    filters: {
      filters: createSetFiltersByKey("S2_minus_S1_union_S3", entityType, sets),
    },
  });

  const { data: s3MinusS1UnionS2 } = queryHook({
    filters: {
      filters: createSetFiltersByKey("S3_minus_S1_union_S2", entityType, sets),
    },
  });

  const data = [
    {
      label: "( S1 ∩ S2 ∩ S3 )",
      key: "S1_intersect_S2_intersect_S3",
      value: intersectionData,
    },
    {
      label: "( S1 ∩ S2 ) - ( S3 )",
      key: "S1_intersect_S2_minus_S3",
      value: s1IntersectS2MinusS3Data,
    },
    {
      label: "( S2 ∩ S3 ) - ( S1 )",
      key: "S2_intersect_S3_minus_S1",
      value: s2IntersectS3MinusS1Data,
    },
    {
      label: "( S1 ∩ S3 ) - ( S2 )",
      key: "S1_intersect_S3_minus_S2",
      value: s1IntersectS3MinusS2,
    },
    {
      label: "( S1 ) - ( S2 ∪ S3 )",
      key: "S1_minus_S2_union_S3",
      value: s1MinusS2UnionS3,
    },
    {
      label: "( S2 ) - ( S1 ∪ S3 )",
      key: "S2_minus_S1_union_S3",
      value: s2MinusS1UnionS3,
    },
    {
      label: "( S3 ) - ( S1 ∪ S2 )",
      key: "S3_minus_S1_union_S2",
      value: s3MinusS1UnionS2,
    },
  ];
  return (
    <SetOperations
      sets={sets}
      entityType={entityType}
      data={data}
      queryHook={queryHook}
    />
  );
};

interface CountButtonProps {
  readonly count: number | undefined;
  readonly filters: Record<string, any>;
  readonly entityType: SetOperationEntityType;
}

const CountButton: React.FC<CountButtonProps> = ({
  count,
  filters,
  entityType,
}: CountButtonProps) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const disabled = count === 0;

  return (
    <>
      {showSaveModal &&
        (entityType === "mutations" ? (
          <SaveSelectionAsSetModal
            filters={filters}
            sort="occurrence.case.project.project_id"
            initialSetName={"Custom Mutation Selection"}
            saveCount={count}
            setType={"ssms"}
            setTypeLabel="mutation"
            createSetHook={useCreateSsmsSetFromFiltersMutation}
            closeModal={() => setShowSaveModal(false)}
          />
        ) : (
          entityType === "genes" && (
            <SaveSelectionAsSetModal
              filters={filters}
              initialSetName={"Custom Gene Selection"}
              sort="case.project.project_id"
              saveCount={count}
              setType={"genes"}
              setTypeLabel="gene"
              createSetHook={useCreateGeneSetFromFiltersMutation}
              closeModal={() => setShowSaveModal(false)}
            />
          )
        ))}
      <Tooltip label={"Save as new set"} withArrow>
        <button
          className="w-full"
          disabled={disabled}
          onClick={() => setShowSaveModal(true)}
        >
          <Badge
            variant="outline"
            radius="xs"
            className={`${disabled ? "bg-base-lighter" : "bg-base-max"} w-full`}
            color={disabled ? "base" : "primary"}
          >
            {count !== undefined ? count.toLocaleString() : undefined}
          </Badge>
        </button>
      </Tooltip>
    </>
  );
};

interface SetOperationsProps {
  readonly sets: SelectedEntities;
  readonly entityType: "cohort" | "genes" | "mutations";
  readonly data: {
    readonly label: string;
    readonly key: string;
    readonly value: number;
  }[];
  readonly queryHook: UseQuery<QueryDefinition<any, any, any, any, string>>;
}

const SetOperations: React.FC<SetOperationsProps> = ({
  sets,
  entityType,
  data,
  queryHook,
}: SetOperationsProps) => {
  const isDemoMode = useIsDemoApp();

  const [selectedSets, setSelectedSets] = useState(
    Object.fromEntries(data.map((set) => [set.key, false])),
  );

  const chartData = data.map((set) => ({
    key: set.key,
    value: set.value,
    highlighted: selectedSets[set.key],
  }));

  const summaryTableColumns = useMemo(
    () => [
      {
        id: "alias",
        columnName: "Alias",
        visible: true,
        disableSortBy: true,
      },
      {
        id: "entityType",
        columnName: "Entity Type",
        visible: true,
        disableSortBy: true,
      },
      {
        id: "name",
        columnName: "Name",
        visible: true,
        disableSortBy: true,
      },
      { id: "count", columnName: "# Items", visible: true },
    ],
    [],
  );

  const setOperationTableColumns = useMemo(
    () => [
      {
        id: "select",
        columnName: "Select",
        visible: true,
        disableSortBy: true,
      },
      {
        id: "setOperation",
        columnName: "Set Operation",
        visible: true,
        disableSortBy: true,
      },
      { id: "count", columnName: "# Items", visible: true },
    ],
    [],
  );

  const summaryTableData = useMemo(
    () =>
      sets.map((set, idx) => ({
        alias: (
          <span>
            S<sub>{idx + 1}</sub>
          </span>
        ),
        entityType: upperFirst(entityType),
        name: set.name,
        count:
          entityType === "genes" ? (
            <GeneCountCell setId={set.id} />
          ) : (
            <MutationCountCell setId={set.id} />
          ),
      })),
    [entityType, sets],
  );

  const tableData = useMemo(
    () =>
      data.map((row) => ({
        select: (
          <Checkbox
            classNames={{
              input: "checked:bg-accent",
            }}
            checked={selectedSets[row.key]}
            value={row.key}
            onChange={(e) =>
              setSelectedSets({
                ...selectedSets,
                [e.target.value]: !selectedSets[e.target.value],
              })
            }
          />
        ),
        setOperation: row.label,
        count: (
          <CountButton
            count={row.value}
            filters={createSetFiltersByKey(row.key, entityType, sets)}
            entityType={entityType}
          />
        ),
      })),
    [selectedSets, data, entityType, sets],
  );

  const unionFilter = {
    op: "or",
    content: Object.keys(pickBy(selectedSets, (v) => v)).map((set) =>
      createSetFiltersByKey(set, entityType, sets),
    ),
  };
  const { data: totalSelectedSets } = queryHook({
    filters: {
      filters: unionFilter,
    },
  });

  const onClickHandler = (clickedKey: string) => {
    setSelectedSets({
      ...selectedSets,
      [clickedKey]: !selectedSets[clickedKey],
    });
  };

  return (
    <div className="flex flex-col p-2">
      <div>
        <h1 className="text-2xl">Set Operations</h1>
        {isDemoMode && (
          <p>
            Demo showing high impact mutations overlap in Bladder between
            Mutect, Varscan and Muse pipelines.
          </p>
        )}
      </div>
      <div className="flex flex-row pt-2">
        <VennDiagram
          labels={["S<sub>1</sub>", "S<sub>2</sub>", "S<sub>3</sub>"]}
          chartData={chartData}
          onClickHandler={onClickHandler}
        />
        <div className="w-full ml-2 mt-2 mb-4">
          <VerticalTable
            tableData={summaryTableData}
            columns={summaryTableColumns}
            selectableRow={false}
            showControls={false}
            columnSorting={"enable"}
          />
          <div className="m-8" />
          <VerticalTable
            tableData={tableData}
            columns={setOperationTableColumns}
            selectableRow={false}
            showControls={false}
            columnSorting={"enable"}
            footer={
              <tr>
                <td className="p-2 font-bold">Union of selected sets:</td>
                <td />
                <td>
                  <CountButton
                    count={
                      Object.keys(pickBy(selectedSets, (v) => v)).length > 0
                        ? totalSelectedSets
                        : 0
                    }
                    filters={unionFilter}
                    entityType={entityType}
                  />
                </td>
              </tr>
            }
          />
        </div>
      </div>
    </div>
  );
};
