import React, { useState, useMemo, useRef, useEffect } from "react";
import { Checkbox, ActionIcon, TextInput, Badge, Tooltip } from "@mantine/core";
import {
  FaTrash as TrashIcon,
  FaCheck as CheckIcon,
  FaExclamationCircle as WarningIcon,
} from "react-icons/fa";
import { BiSolidDownload as DownloadIcon } from "react-icons/bi";
import { PiPencilSimpleLineBold as EditIcon } from "react-icons/pi";
import { MdClose as CloseIcon } from "react-icons/md";
import { useCoreDispatch, removeSets, SetTypes, renameSet } from "@gff/core";
import download from "@/utils/download";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { SetData } from "./types";
import { createKeyboardAccessibleFunction } from "@/utils/index";

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
      <div className="flex flex-row gap-2 items-center">
        {editing ? (
          <>
            <TextInput
              value={value}
              ref={inputRef}
              onChange={(e) => setValue(e.currentTarget.value)}
              error={
                value === "" ? <>Please fill out this field.</> : undefined
              }
              maxLength={100}
            />
            <ActionIcon
              onClick={() => {
                setEditing(false);
                setValue(setName);
              }}
              className="border-nci-red-darkest bg-nci-red-lighter rounded-[50%]"
            >
              <CloseIcon className="text-nci-red-darkest" />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                dispatch(renameSet({ setId, setType, newSetName: value }));
                setEditing(false);
              }}
              className="border-nci-green-darkest bg-nci-green-lighter rounded-[50%]"
            >
              <CheckIcon className="text-nci-green-darkest" size={10} />
            </ActionIcon>
          </>
        ) : (
          <>
            {setName}
            <ActionIcon onClick={() => setEditing(true)} variant="transparent">
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
  return (
    <Tooltip
      label="Set is either empty or deprecated."
      disabled={count > 0}
      withArrow
    >
      <Badge
        variant={active ? "filled" : "outline"}
        radius="xs"
        className={`${
          active
            ? undefined
            : count === 0
            ? "bg-nci-gray-lightest opacity-50"
            : "bg-white"
        } cursor-pointer`}
        color={count === 0 ? "gray" : "primary"}
        leftSection={
          count === 0 ? (
            <WarningIcon className="text-warningColor" />
          ) : undefined
        }
        onClick={openSetDetail}
        tabIndex={0}
        onKeyDown={createKeyboardAccessibleFunction(openSetDetail)}
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
  readonly detailSet: SetData;
  readonly setDetailSet: (set: SetData) => void;
}

const ManageSetsTable: React.FC<MangeSetsTableProps> = ({
  geneData,
  ssmData,
  selectedSets,
  updateSelectedSets,
  detailSet,
  setDetailSet,
}) => {
  const dispatch = useCoreDispatch();
  const selectedSetIds = selectedSets.map((set) => set.setId);

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
      {
        id: "count",
        columnName: "# Items",
        visible: true,
      },
      {
        id: "actions",
        columnName: "Actions",
        visible: true,
      },
    ],
    [],
  );

  const tableData = useMemo(() => {
    return [
      ...ssmData.map((set) => ({
        select: (
          <Checkbox
            value={set.setId}
            checked={selectedSetIds.includes(set.setId)}
            onChange={() => updateSelectedSets(set)}
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
          />
        ),
        entityType: "Mutations",
        name: (
          <SetNameInput
            setName={set.setName}
            setId={set.setId}
            setType={"ssms"}
          />
        ),
        count: (
          <CountBadge
            count={set.count}
            active={detailSet?.setId === set.setId}
            openSetDetail={() => setDetailSet(set)}
          />
        ),
        actions: <ManageSetActions set={set} downloadType="ssm" />,
      })),
      ...geneData.map((set) => ({
        select: (
          <Checkbox
            value={set.setId}
            checked={selectedSetIds.includes(set.setId)}
            onChange={() => updateSelectedSets(set)}
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
          />
        ),
        entityType: "Genes",
        name: (
          <SetNameInput
            setName={set.setName}
            setId={set.setId}
            setType={"genes"}
          />
        ),
        count: (
          <CountBadge
            count={set.count}
            active={detailSet?.setId === set.setId}
            openSetDetail={() => setDetailSet(set)}
          />
        ),
        actions: <ManageSetActions set={set} downloadType="gene" />,
      })),
    ];
  }, [
    JSON.stringify(selectedSetIds),
    JSON.stringify(ssmData),
    JSON.stringify(geneData),
    dispatch,
    detailSet,
    setDetailSet,
    updateSelectedSets,
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
        columnSorting={"manual"}
      />
    </div>
  );
};

export default ManageSetsTable;
