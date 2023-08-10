import React, { useState, useMemo, useRef, useEffect } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { Checkbox, ActionIcon, TextInput, Badge, Tooltip } from "@mantine/core";
import {
  FaTrash as TrashIcon,
  FaCheck as CheckIcon,
  FaExclamationCircle as WarningIcon,
} from "react-icons/fa";
import { BiSolidDownload as DownloadIcon } from "react-icons/bi";
import { PiPencilSimpleLineBold as EditIcon } from "react-icons/pi";
import { MdClose as CloseIcon } from "react-icons/md";
import { Row } from "react-table";
import { useCoreDispatch, removeSets, SetTypes, renameSet } from "@gff/core";
import { createKeyboardAccessibleFunction } from "src/utils";
import download from "@/utils/download";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import ErrorMessage from "@/components/ErrorMessage";
import { SetData } from "./types";

interface SetNameInputProps {
  readonly setName: string;
  readonly setId: string;
  readonly setType: SetTypes;
}

const SetNameInput: React.FC<SetNameInputProps> = ({
  setName,
  setId,
  setType,
}: SetNameInputProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(setName);
  const inputRef = useRef<HTMLInputElement>();
  const dispatch = useCoreDispatch();

  useEffect(() => {
    if (editing) {
      inputRef?.current.focus();
    }
  }, [editing]);

  return (
    <>
      <div
        className={`flex flex-row gap-2 ${
          editing ? "items-start" : "items-center"
        }`}
      >
        {editing ? (
          <>
            <TextInput
              value={value}
              ref={inputRef}
              onChange={(e) => setValue(e.currentTarget.value)}
              error={
                value === "" ? (
                  <ErrorMessage message="Please fill out this field." />
                ) : undefined
              }
              maxLength={100}
              aria-label="Enter set name"
            />
            <ActionIcon
              onClick={() => {
                setEditing(false);
                setValue(setName);
              }}
              className="border-nci-red-darkest bg-nci-red-lighter rounded-[50%] mt-1"
              aria-label={"Close input"}
            >
              <CloseIcon className="text-nci-red-darkest" />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                dispatch(renameSet({ setId, setType, newSetName: value }));
                setEditing(false);
              }}
              className="border-nci-green-darkest bg-nci-green-lighter rounded-[50%] mt-1"
              disabled={value === ""}
              aria-label={"Rename set"}
            >
              <CheckIcon className="text-nci-green-darkest" size={10} />
            </ActionIcon>
          </>
        ) : (
          <>
            {setName}
            <ActionIcon
              onClick={() => setEditing(true)}
              variant="transparent"
              aria-label="Edit set name"
            >
              <EditIcon className="text-accent" />
            </ActionIcon>
          </>
        )}
      </div>

      {value.length === 100 && (
        <p className="text-sm pt-1">Maximum 100 characters</p>
      )}
    </>
  );
};

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
        className={`cursor-pointer ${
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
  const { setId, setName, setType } = set;

  return (
    <div className="flex flex-row items-center gap-1">
      <ActionIcon
        size={20}
        title="Delete set"
        aria-label="Delete set"
        className="text-primary"
        onClick={() => dispatch(removeSets([{ setId, setType }]))}
        variant="transparent"
      >
        <TrashIcon />
      </ActionIcon>
      <ActionIcon
        size={20}
        title="Download set"
        aria-label="Download set"
        className="text-primary"
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
    </div>
  );
};

interface MangeSetsTableProps {
  readonly geneData: SetData[];
  readonly ssmData: SetData[];
  readonly selectedSets: SetData[];
  readonly updateSelectedSets: (set: SetData) => void;
  readonly updateSelectAllSets: () => void;
  readonly detailSet: SetData;
  readonly setDetailSet: (set: SetData) => void;
}

const ManageSetsTable: React.FC<MangeSetsTableProps> = ({
  geneData,
  ssmData,
  selectedSets,
  updateSelectedSets,
  updateSelectAllSets,
  detailSet,
  setDetailSet,
}) => {
  const selectedSetIds = selectedSets.map((set) => set.setId);
  const allSetIds = [
    ...geneData.map((set) => set.setId),
    ...ssmData.map((set) => set.setId),
  ];
  const selectAllChecked = allSetIds.every((setId) =>
    selectedSetIds.includes(setId),
  );

  const columns = useMemo(
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
