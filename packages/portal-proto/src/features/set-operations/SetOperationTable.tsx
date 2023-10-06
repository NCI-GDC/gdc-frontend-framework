import VerticalTable from "@/components/Table/VerticalTable";
import {
  ColumnDef,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import CountButtonWrapperForSetsAndCases from "./CountButtonWrapperForSetsAndCases";
import { Checkbox } from "@mantine/core";
import { createSetFiltersByKey, ENTITY_TYPE_TO_CREATE_SET_HOOK } from "./utils";
import { GqlOperation } from "@gff/core";
import { pickBy } from "lodash";
import { SelectedEntities } from "./types";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import DownloadButtonTotal from "./DownloadButton";

type SetOperationtableDataType = {
  setOperation: string;
  count: number;
  operationKey: string;
};

export const SetOperationTable = ({
  data,
  selectedSets,
  setSelectedSets,
  queryHook,
  entityType,
  sets,
}: {
  readonly sets: SelectedEntities;
  readonly entityType: "cohort" | "genes" | "mutations";
  readonly data: {
    readonly label: string;
    readonly key: string;
    readonly value: number;
  }[];
  readonly queryHook: UseQuery<QueryDefinition<any, any, any, number, string>>;
  selectedSets: {
    [k: string]: boolean;
  };
  setSelectedSets: React.Dispatch<
    React.SetStateAction<{
      [k: string]: boolean;
    }>
  >;
}): JSX.Element => {
  const unionFilter = {
    op: "or",
    content: Object.keys(pickBy(selectedSets, (v) => v)).map((set) =>
      createSetFiltersByKey(set, entityType, sets),
    ),
  } as GqlOperation;

  const { data: totalSelectedSets, isFetching } = queryHook({
    filters: {
      filters: unionFilter,
    },
  });
  const totalCount =
    Object.keys(pickBy(selectedSets, (v) => v)).length > 0
      ? totalSelectedSets
      : 0;
  const [rowSelection, setRowSelection] = useState({});
  const [operationTablesorting, setOperationTableSorting] =
    useState<SortingState>([]);

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
          <DownloadButtonTotal
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

    [
      setOperationTableColumnsHelper,
      selectedSets,
      entityType,
      sets,
      setSelectedSets,
    ],
  );

  return (
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
              count={isFetching ? 0 : totalCount}
              filters={unionFilter}
              entityType={entityType}
            />
          </td>
          <td className="p-2">
            <DownloadButtonTotal
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
  );
};
