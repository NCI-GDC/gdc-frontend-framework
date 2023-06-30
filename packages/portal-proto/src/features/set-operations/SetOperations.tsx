import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  UseMutation,
  UseQuery,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  QueryDefinition,
  MutationDefinition,
} from "@reduxjs/toolkit/dist/query";
import { pickBy, upperFirst } from "lodash";
import { Checkbox, Badge, Tooltip, ActionIcon, Loader } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { Row } from "react-table";
import {
  useCreateSsmsSetFromFiltersMutation,
  useCreateGeneSetFromFiltersMutation,
  useCoreDispatch,
  GqlOperation,
} from "@gff/core";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { convertDateToString } from "src/utils/date";
import { SelectedEntities, SetOperationEntityType } from "./types";
import download from "src/utils/download";
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
          className="w-fit"
          disabled={disabled}
          onClick={() => setShowSaveModal(true)}
        >
          <Badge
            variant="outline"
            radius="xs"
            className={`${disabled ? "bg-base-lighter" : "bg-base-max"} w-20`}
            color={disabled ? "base" : "primary"}
          >
            {count !== undefined ? count.toLocaleString() : undefined}
          </Badge>
        </button>
      </Tooltip>
    </>
  );
};

interface DownloadButtonProps {
  readonly createSetHook: UseMutation<MutationDefinition<any, any, any, any>>;
  readonly entityType: SetOperationEntityType;
  readonly filters: GqlOperation;
  readonly setKey: string;
  readonly disabled: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  createSetHook,
  entityType,
  filters,
  setKey,
  disabled,
}: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [createSet, response] = createSetHook();
  const dispatch = useCoreDispatch();

  useEffect(() => {
    if (response.isLoading) {
      setLoading(true);
    }
  }, [response.isLoading]);

  useEffect(() => {
    if (response.isSuccess) {
      download({
        params: {
          attachment: true,
          format: "tsv",
          sets: [
            {
              id: response.data,
              type: entityType === "mutations" ? "ssm" : "gene",
              filename: `${setKey
                .replace(/∩/g, "intersection")
                .replace(/∪/g, "union")}-set-ids.${convertDateToString(
                new Date(),
              )}.tsv`,
            },
          ],
        },
        endpoint: "tar_sets",
        method: "POST",
        dispatch,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
        form: true,
        done: () => setLoading(false),
      });
    }
  }, [response.isSuccess, dispatch, entityType, response.data, setKey]);

  return (
    <Tooltip
      label={disabled ? "No items to export" : "Export as TSV"}
      withArrow
    >
      <div className="w-fit">
        <ActionIcon
          onClick={() => createSet({ filters })}
          color="primary"
          variant="outline"
          className={`${disabled ? "bg-base-lighter" : "bg-base-max"}`}
          disabled={disabled}
        >
          {loading ? <Loader size={14} /> : <DownloadIcon />}
        </ActionIcon>
      </div>
    </Tooltip>
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
  const { data: summaryCounts } = countHook({ setIds: sets.map((s) => s.id) });

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
      {
        id: "count",
        columnName: "# Items",
        visible: true,
        Cell: ({ value }) =>
          value !== undefined ? value.toLocaleString() : "...",
      },
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
      {
        id: "count",
        columnName: "# Items",
        visible: true,
        Cell: ({ value, row }: { value: number; row: Row }) => (
          <CountButton
            count={value}
            filters={createSetFiltersByKey(
              (row.original as Record<string, any>).operationKey,
              entityType,
              sets,
            )}
            entityType={entityType}
          />
        ),
      },
      {
        id: "download",
        columnName: "Download",
        visible: true,
        disableSortBy: true,
      },
    ],
    [entityType, sets],
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
        count: summaryCounts?.[set.id],
      })),
    [entityType, sets, summaryCounts],
  );

  const tableData = useMemo(
    () =>
      data.map((r) => ({
        select: (
          <Checkbox
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
            checked={selectedSets[r.key]}
            value={r.key}
            onChange={(e) =>
              setSelectedSets({
                ...selectedSets,
                [e.target.value]: !selectedSets[e.target.value],
              })
            }
          />
        ),
        setOperation: r.label,
        count: r.value,
        operationKey: r.key,
        download: (
          <DownloadButton
            filters={createSetFiltersByKey(r.key, entityType, sets)}
            entityType={entityType}
            setKey={r.label}
            createSetHook={
              entityType === "mutations"
                ? useCreateSsmsSetFromFiltersMutation
                : useCreateGeneSetFromFiltersMutation
            }
            disabled={r.value === 0}
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
                    count={totalCount}
                    filters={unionFilter}
                    entityType={entityType}
                  />
                </td>
                <td className="p-2">
                  <DownloadButton
                    setKey="union-of"
                    filters={unionFilter}
                    createSetHook={
                      entityType === "mutations"
                        ? useCreateSsmsSetFromFiltersMutation
                        : useCreateGeneSetFromFiltersMutation
                    }
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
