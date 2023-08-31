import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { pickBy, upperFirst } from "lodash";
import { Checkbox } from "@mantine/core";
import {
  useCreateSsmsSetFromFiltersMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateCaseSetFromFiltersMutation,
  GqlOperation,
} from "@gff/core";
import VerticalTable from "@/components/Table/VerticalTable";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { SelectedEntities, SetOperationEntityType } from "./types";
import DownloadButton from "./DownloadButton";
import CountButtonWrapperForSetsAndCases from "@/features/set-operations/CountButtonWrapperForSetsAndCases";
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
const VennDiagram = dynamic(() => import("../charts/VennDiagram"), {
  ssr: false,
});

const ENTITY_TYPE_TO_FIELD = {
  cohort: "cases.case_id",
  genes: "genes.gene_id",
  mutations: "ssms.ssm_id",
};

const ENTITY_TYPE_TO_CREATE_SET_HOOK = {
  cohort: useCreateCaseSetFromFiltersMutation,
  genes: useCreateGeneSetFromFiltersMutation,
  mutations: useCreateSsmsSetFromFiltersMutation,
};

interface SetOperationsExternalProps {
  readonly sets: SelectedEntities;
  readonly entityType: SetOperationEntityType;
  readonly queryHook: UseQuery<QueryDefinition<any, any, any, any, string>>;
  readonly countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
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
  countHook,
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
      countHook={countHook}
    />
  );
};

export const SetOperationsThree: React.FC<SetOperationsExternalProps> = ({
  sets,
  entityType,
  queryHook,
  countHook,
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
      countHook={countHook}
    />
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
  readonly queryHook: UseQuery<QueryDefinition<any, any, any, number, string>>;
  readonly countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
}

const SetOperations: React.FC<SetOperationsProps> = ({
  sets,
  entityType,
  data,
  queryHook,
  countHook,
}: SetOperationsProps) => {
  const isDemoMode = useIsDemoApp();
  const [selectedSets, setSelectedSets] = useState(
    Object.fromEntries(data.map((set) => [set.key, false])),
  );
  const { data: summaryCounts, isFetching } = countHook({
    setIds: sets.map((s) => s.id),
  });

  const chartData = data.map((set) => ({
    key: set.key,
    value: set.value,
    highlighted: selectedSets[set.key],
  }));

  const [rowSelection, setRowSelection] = useState({});

  // Summary Table
  type SummaryTableDataType = {
    idx: number;
    entityType: string;
    name: string;
    count: string | number;
  };

  const summaryTableData: SummaryTableDataType[] = useMemo(
    () =>
      sets.map((set, idx) => ({
        idx,
        entityType: upperFirst(entityType),
        name: set.name,
        count: isFetching ? "..." : summaryCounts?.[set.id],
      })),
    [entityType, isFetching, sets, summaryCounts],
  );

  const summaryTableColumnsHelper = createColumnHelper<SummaryTableDataType>();
  const summaryTableColumns = useMemo(
    () => [
      summaryTableColumnsHelper.display({
        id: "alias",
        header: "Alias",
        cell: ({ row }) => (
          <span>
            S<sub>{row.original.idx + 1}</sub>
          </span>
        ),
      }),
      summaryTableColumnsHelper.accessor("entityType", {
        id: "entityType",
        header: "Entity Type",
        enableSorting: false,
      }),
      summaryTableColumnsHelper.accessor("name", {
        id: "name",
        header: "Name",
        enableSorting: false,
      }),
      summaryTableColumnsHelper.accessor("count", {
        header: "# Items",
        enableSorting: true,
        cell: ({ getValue }) =>
          getValue() !== undefined ? getValue().toLocaleString() : "...",
      }),
    ],
    [summaryTableColumnsHelper],
  );

  // Set operation table
  type SetOperationtableDataType = {
    setOperation: string;
    count: number;
    operationKey: string;
  };

  const setOperationtableData: SetOperationtableDataType[] = useMemo(
    () =>
      data.map((r) => ({
        setOperation: r.label,
        count: r.value,
        operationKey: r.key,
      })),
    [data],
  );

  const setOperationTableColumnsHelper =
    createColumnHelper<SetOperationtableDataType>();

  const setOperationTableColumns = useMemo<
    ColumnDef<SetOperationtableDataType>[]
  >(
    () => [
      {
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <Checkbox
            size="xs"
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
            value={row.original.operationKey}
            aria-label="checkbox for selecting table row"
            {...{
              checked: selectedSets[row.original.operationKey],
              onChange: (e) => {
                setSelectedSets({
                  ...selectedSets,
                  [e.target.value]: !selectedSets[e.target.value],
                });
              },
            }}
          />
        ),
      },
      setOperationTableColumnsHelper.accessor("setOperation", {
        header: "Set Operation",
        enableSorting: false,
      }),
      setOperationTableColumnsHelper.accessor("count", {
        header: "# Items",
        cell: ({ row, getValue }) => (
          <CountButtonWrapperForSetsAndCases
            count={getValue()}
            filters={createSetFiltersByKey(
              row.original.operationKey,
              entityType,
              sets,
            )}
            entityType={entityType}
          />
        ),
        enableSorting: true,
      }),
      setOperationTableColumnsHelper.display({
        id: "download",
        header: "Download",
        cell: ({ row }) => (
          <DownloadButton
            filters={createSetFiltersByKey(
              row.original.operationKey,
              entityType,
              sets,
            )}
            entityType={entityType}
            setKey={row.original.setOperation}
            createSetHook={ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]}
            disabled={row.original.count === 0}
          />
        ),
      }),
    ],
    [setOperationTableColumnsHelper, selectedSets, entityType, sets],
  );

  const unionFilter = {
    op: "or",
    content: Object.keys(pickBy(selectedSets, (v) => v)).map((set) =>
      createSetFiltersByKey(set, entityType, sets),
    ),
  } as GqlOperation;
  const { data: totalSelectedSets } = queryHook({
    filters: {
      filters: unionFilter,
    },
  });

  const totalCount =
    Object.keys(pickBy(selectedSets, (v) => v)).length > 0
      ? totalSelectedSets
      : 0;

  const onClickHandler = (clickedKey: string) => {
    setSelectedSets({
      ...selectedSets,
      [clickedKey]: !selectedSets[clickedKey],
    });
  };
  const [summaryTablesorting, setSummaryTableSorting] = useState<SortingState>(
    [],
  );
  const [operationTablesorting, setOperationTableSorting] =
    useState<SortingState>([]);
  return (
    <div className="flex flex-col p-2">
      <div>
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
            data={summaryTableData}
            columns={summaryTableColumns}
            showControls={false}
            sorting={summaryTablesorting}
            setSorting={setSummaryTableSorting}
            columnSorting="enable"
            status={isFetching ? "pending" : "fulfilled"}
          />
          <div className="m-8" />
          <VerticalTable
            data={setOperationtableData}
            columns={setOperationTableColumns}
            enableRowSelection={true}
            setRowSelection={setRowSelection}
            rowSelection={rowSelection}
            showControls={false}
            status="fulfilled"
            sorting={operationTablesorting}
            setSorting={setOperationTableSorting}
            columnSorting="enable"
            footer={
              <tr>
                <td className="p-2 font-bold">Union of selected sets:</td>
                <td />
                <td className="w-52">
                  <CountButtonWrapperForSetsAndCases
                    count={totalCount}
                    filters={unionFilter}
                    entityType={entityType}
                  />
                </td>
                <td className="p-2">
                  <DownloadButton
                    setKey="union-of"
                    filters={unionFilter}
                    createSetHook={ENTITY_TYPE_TO_CREATE_SET_HOOK[entityType]}
                    entityType={entityType}
                    disabled={totalCount === 0}
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
