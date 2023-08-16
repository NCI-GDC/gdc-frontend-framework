import React from "react";
import { useDeepCompareMemo, useDeepCompareCallback } from "use-deep-compare";
import { Checkbox, ActionIcon, Badge, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  FaTrash as TrashIcon,
  FaExclamationCircle as WarningIcon,
} from "react-icons/fa";
import { BiSolidDownload as DownloadIcon } from "react-icons/bi";
import { Row } from "react-table";
import { useCoreDispatch, removeSets } from "@gff/core";
import { createKeyboardAccessibleFunction } from "src/utils";
import download from "@/utils/download";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { SetData } from "./types";
import SetNameInput from "./SetNameInput";
import DeleteSetsNotification from "./DeleteSetsNotification";

interface CountBadgeProps {
  readonly count: number;
  readonly active: boolean;
  readonly openSetDetail: () => void;
}

const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  active,
  openSetDetail,
}: CountBadgeProps) => {
  const disabled = count === 0;
  return (
    <Tooltip
      label="Set is either empty or deprecated."
      disabled={!disabled}
      withArrow
    >
      <Badge
        variant={active ? "filled" : "outline"}
        radius="xs"
        className={`cursor-pointer w-16 ${
          active
            ? undefined
            : disabled
            ? "bg-nci-gray-lightest opacity-50 cursor-not-allowed"
            : "bg-white"
        }`}
        color={disabled ? "gray" : "primary"}
        leftSection={
          disabled ? <WarningIcon className="text-warningColor" /> : undefined
        }
        onClick={disabled ? undefined : openSetDetail}
        tabIndex={0}
        onKeyDown={
          disabled ? undefined : createKeyboardAccessibleFunction(openSetDetail)
        }
        aria-disabled={disabled}
      >
        {count?.toLocaleString() ?? "--"}
      </Badge>
    </Tooltip>
  );
};

interface ManageSetActionsProps {
  readonly set: SetData;
  readonly downloadType: string;
}

const ManageSetActions: React.FC<ManageSetActionsProps> = ({
  set,
  downloadType,
}: ManageSetActionsProps) => {
  const dispatch = useCoreDispatch();
  const { setId, setName, setType, count } = set;

  return (
    <div className="flex flex-row items-center gap-1">
      <ActionIcon
        size={20}
        aria-label="Delete set"
        className="text-primary"
        onClick={() => {
          dispatch(removeSets([{ setId, setType }]));
          showNotification({
            message: <DeleteSetsNotification sets={[set]} />,
          });
        }}
        variant="transparent"
      >
        <TrashIcon />
      </ActionIcon>
      {count > 0 && (
        <ActionIcon
          size={20}
          aria-label="Download set"
          className={"text-primary"}
          variant="transparent"
          onClick={() => {
            download({
              endpoint: "tar_sets",
              params: {
                attachment: true,
                sets: [
                  {
                    id: setId,
                    type: downloadType,
                    filename: `${downloadType}_set_${setName.replace(
                      /[^A-Za-z0-9_.]/g,
                      "_",
                    )}.tsv`,
                  },
                ],
              },
              options: {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              },
              method: "POST",
              dispatch,
              form: true,
            });
          }}
        >
          <DownloadIcon />
        </ActionIcon>
      )}
    </div>
  );
};

interface MangeSetsTableProps {
  readonly geneData: SetData[];
  readonly ssmData: SetData[];
  readonly selectedSets: SetData[];
  readonly setSelectedSets: (sets: SetData[]) => void;
  readonly detailSet: SetData;
  readonly setDetailSet: (set: SetData) => void;
}

const ManageSetsTable: React.FC<MangeSetsTableProps> = ({
  geneData,
  ssmData,
  selectedSets,
  setSelectedSets,
  detailSet,
  setDetailSet,
}) => {
  const selectedSetIds = selectedSets.map((set) => set.setId);

  const updateSelectedSets = useDeepCompareCallback(
    (set: SetData) => {
      if (selectedSetIds.includes(set.setId)) {
        setSelectedSets(selectedSets.filter((s) => s.setId !== set.setId));
      } else {
        setSelectedSets([...selectedSets, set]);
      }
    },
    [selectedSetIds, selectedSets, setSelectedSets],
  );

  const tableData = useDeepCompareMemo(() => {
    return [
      ...ssmData.map((set) => {
        const { setName, count, setId, setType } = set;
        return {
          select: (
            <Checkbox
              value={setId}
              checked={selectedSetIds.includes(setId)}
              onChange={() => updateSelectedSets(set)}
              aria-label={`Select/deselect ${setName}`}
              classNames={{
                input: "checked:bg-accent checked:border-accent",
              }}
            />
          ),
          entityType: "Mutations",
          setName,
          count,
          actions: <ManageSetActions set={set} downloadType="ssm" />,
          setId,
          setType,
        };
      }),
      ...geneData.map((set) => {
        const { setName, count, setId, setType } = set;

        return {
          select: (
            <Checkbox
              value={setId}
              checked={selectedSetIds.includes(setId)}
              onChange={() => updateSelectedSets(set)}
              aria-label={`Select/deselect ${setName}`}
              classNames={{
                input: "checked:bg-accent checked:border-accent",
              }}
            />
          ),
          entityType: "Genes",
          setName,
          count,
          actions: <ManageSetActions set={set} downloadType="gene" />,
          setId,
          setType,
        };
      }),
    ];
  }, [selectedSetIds, ssmData, geneData, updateSelectedSets]);

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

  const allSetIds = useDeepCompareMemo(
    () => displayedData.map((set) => set.setId),
    [displayedData],
  );
  const selectAllChecked = allSetIds.every((setId) =>
    selectedSetIds.includes(setId),
  );

  const updateSelectAllSets = useDeepCompareCallback(() => {
    if (allSetIds.every((setId) => selectedSetIds.includes(setId))) {
      setSelectedSets([]);
    } else {
      setSelectedSets(
        displayedData.map((data) => ({
          setId: data.setId,
          setType: data.setType,
          count: data.count,
          setName: data.setName,
        })),
      );
    }
  }, [allSetIds, selectedSetIds, setSelectedSets, displayedData]);

  const columns = useDeepCompareMemo(
    () => [
      {
        id: "select",
        columnName: (
          <Checkbox
            checked={selectAllChecked}
            onChange={updateSelectAllSets}
            aria-label="Select/deselect all sets"
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
          />
        ),
        visible: true,
        disableSortBy: true,
      },
      {
        id: "entityType",
        columnName: "Entity Type",
        visible: true,
      },
      {
        id: "setName",
        columnName: "Name",
        visible: true,
        Cell: ({ value, row }: { value: string; row: Row<SetData> }) => (
          <SetNameInput
            setName={value}
            setId={row.original.setId}
            setType={row.original.setType}
          />
        ),
      },
      {
        id: "count",
        columnName: "# Items",
        visible: true,
        Cell: ({ value, row }: { value: number; row: Row<SetData> }) => (
          <CountBadge
            count={value}
            active={detailSet?.setId === row.original.setId}
            openSetDetail={() => {
              setDetailSet({
                setId: row.original.setId,
                setName: row.original.setName,
                setType: row.original.setType,
                count: value,
              });
            }}
          />
        ),
      },
      {
        id: "actions",
        columnName: "Actions",
        visible: true,
        disableSortBy: true,
      },
    ],
    [detailSet?.setId, setDetailSet, selectAllChecked, updateSelectAllSets],
  );

  return (
    <div className="w-3/4 pb-6">
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
  );
};

export default ManageSetsTable;
