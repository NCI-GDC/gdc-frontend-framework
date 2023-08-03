import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Grid,
  Checkbox,
  Button,
  ActionIcon,
  Badge,
  Tooltip,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import {
  FaUndo as UndoIcon,
  FaTrash as TrashIcon,
  FaExclamationCircle as WarningIcon,
} from "react-icons/fa";
import {
  useCoreSelector,
  selectAllSets,
  useGeneSetCountsQuery,
  useSsmSetCountsQuery,
  addSets,
  useCoreDispatch,
  removeSets,
  SetTypes,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { WarningBanner } from "@/components/WarningBanner";
import { CountsIcon } from "@/features/shared/tailwindComponents";
import { SelectedSet } from "./types";
import SetDetailPanel from "./SetDetailPanel";
import CreateSetButton from "./CreateSetButton";

interface DeleteSetsNotificationProps {
  readonly sets: SelectedSet[];
}

const DeleteSetsNotification: React.FC<DeleteSetsNotificationProps> = ({
  sets,
}: DeleteSetsNotificationProps) => {
  const dispatch = useCoreDispatch();
  console.log(sets);
  return (
    <>
      {sets.length === 1 ? (
        <p>
          <b>{sets[0].setName}</b> has been deleted
        </p>
      ) : (
        <p>{sets.length} sets have been deleted</p>
      )}
      <Button
        variant={"white"}
        onClick={() => dispatch(addSets(sets))}
        leftIcon={<UndoIcon />}
      >
        <span className="underline">Undo</span>
      </Button>
    </>
  );
};

const CreateSetInstructions = () => (
  <p className="py-2 font-montserrat">
    Create gene and mutation sets using the <b>Create Set</b> button or from the{" "}
    <Link href="/analysis_page?app=MutationFrequencyApp" passHref>
      <a className="text-utility-link underline font-heading">
        {" "}
        Mutation Frequency app.
      </a>
    </Link>
  </p>
);

interface CountBadgeProps {
  readonly count?: number;
  readonly openSetDetail: () => void;
}

const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  openSetDetail,
}: CountBadgeProps) => {
  return (
    <Tooltip
      label="Set is either empty or deprecated."
      disabled={count > 0}
      withArrow
    >
      <Badge
        variant="outline"
        radius="xs"
        className={`${
          count === 0 ? "bg-nci-gray-lightest opacity-50" : "bg-white"
        } cursor-pointer`}
        color={count === 0 ? "gray" : "primary"}
        leftSection={
          count === 0 ? (
            <WarningIcon className="text-warningColor" />
          ) : undefined
        }
        onClick={openSetDetail}
      >
        {count?.toLocaleString() ?? "--"}
      </Badge>
    </Tooltip>
  );
};

interface SelectedSetButtonProps {
  readonly selection: SelectedSet[];
  readonly text: string;
  readonly onClick: () => void;
}

const SelectedSetButton: React.FC<SelectedSetButtonProps> = ({
  selection,
  text,
  onClick,
}: SelectedSetButtonProps) => {
  return (
    <Button
      variant="outline"
      color="primary"
      onClick={onClick}
      disabled={selection.length == 0}
      leftIcon={
        selection.length ? (
          <CountsIcon $count={selection.length}>{selection.length} </CountsIcon>
        ) : null
      }
      className="border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary"
    >
      {text}
    </Button>
  );
};

const ManageSets: React.FC = () => {
  const [selectedSets, setSelectedSets] = useState<SelectedSet[]>([]);
  const [detailSet, setDetailSet] = useState<SelectedSet>(undefined);
  const sets = useCoreSelector((state) => selectAllSets(state));
  const { data: geneCounts, isSuccess: geneCountsSuccess } =
    useGeneSetCountsQuery({ setIds: Object.keys(sets.genes) });
  const { data: ssmsCounts, isSuccess: ssmsCountsSuccess } =
    useSsmSetCountsQuery({ setIds: Object.keys(sets.ssms) });

  const noSets =
    Object.keys(sets.genes).length === 0 && Object.keys(sets.ssms).length === 0;
  const deprecatedOrEmptySets =
    (geneCountsSuccess &&
      Object.values(geneCounts).some((count) => count === 0)) ||
    (ssmsCountsSuccess &&
      Object.values(ssmsCounts).some((count) => count === 0));
  const selectedSetIds = selectedSets.map((set) => set.setId);

  const dispatch = useCoreDispatch();

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

  const updateSelectedSets = useCallback(
    ({
      setId,
      setName,
      setType,
    }: {
      setId: string;
      setName: string;
      setType: SetTypes;
    }) => {
      if (selectedSetIds.includes(setId)) {
        setSelectedSets(selectedSets.filter((set) => set.setId !== setId));
      } else {
        setSelectedSets([...selectedSets, { setId, setName, setType }]);
      }
    },
    [selectedSetIds, selectedSets],
  );

  const tableData = useMemo(() => {
    return [
      ...Object.entries(sets.ssms).map(([setId, setName]) => ({
        select: (
          <Checkbox
            value={setId}
            checked={selectedSetIds.includes(setId)}
            onChange={() =>
              updateSelectedSets({ setId, setName, setType: "ssms" })
            }
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
          />
        ),
        entityType: "Mutations",
        name: setName,
        count: (
          <CountBadge
            count={ssmsCounts?.[setId]}
            openSetDetail={() =>
              setDetailSet({ setId, setName, setType: "ssms" })
            }
          />
        ),
        actions: (
          <>
            <ActionIcon
              size={20}
              title="Remove From Cart"
              aria-label="Remove from cart"
              className="text-primary"
              onClick={() => dispatch(removeSets([{ setId, setType: "ssms" }]))}
            >
              <TrashIcon />
            </ActionIcon>
          </>
        ),
      })),
      ...Object.entries(sets.genes).map(([setId, setName]) => ({
        select: (
          <Checkbox
            value={setId}
            checked={selectedSetIds.includes(setId)}
            onChange={() =>
              updateSelectedSets({ setId, setName, setType: "genes" })
            }
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
          />
        ),
        entityType: "Genes",
        name: setName,
        count: (
          <CountBadge
            count={geneCounts?.[setId]}
            openSetDetail={() =>
              setDetailSet({ setId, setName, setType: "genes" })
            }
          />
        ),
        actions: (
          <>
            <ActionIcon
              size={20}
              title="Remove From Cart"
              aria-label="Remove from cart"
              className="text-primary"
              onClick={() =>
                dispatch(removeSets([{ setId, setType: "genes" }]))
              }
            >
              <TrashIcon />
            </ActionIcon>
          </>
        ),
      })),
    ];
  }, [
    JSON.stringify(selectedSetIds),
    sets,
    geneCounts,
    geneCountsSuccess,
    ssmsCounts,
    ssmsCountsSuccess,
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

  return noSets ? (
    <Grid justify="center" className="bg-base-lightest flex-grow">
      <Grid.Col span={4} className="my-20 flex flex-col items-center">
        <div className="h-40 w-40 rounded-[50%] bg-emptyIconLighterColor flex justify-center items-center">
          <FileAddIcon size={80} className="text-primary-darkest" />
        </div>
        <p className="uppercase text-primary-darkest text-2xl font-montserrat mt-4">
          No saved sets available
        </p>
        <CreateSetInstructions />
      </Grid.Col>
    </Grid>
  ) : (
    <div className="p-4">
      <WarningBanner
        text={
          "Please be aware that your custom sets are deleted during each new GDC data release. You can export and re-upload them on this page."
        }
      />
      <CreateSetInstructions />
      <div className="flex flex-row gap-2 py-2">
        <CreateSetButton />
        <SelectedSetButton
          selection={selectedSets}
          text={"Delete Selected"}
          onClick={() => {
            dispatch(removeSets(selectedSets));
            showNotification({
              message: <DeleteSetsNotification sets={selectedSets} />,
            });
            setSelectedSets([]);
          }}
        />
        {deprecatedOrEmptySets && (
          <Button
            variant="outline"
            color="primary"
            className="border-primary"
            onClick={() => {
              const emptyGeneSetIds = Object.entries(geneCounts)
                .filter((set) => set[1] === 0)
                .map((set) => set[0]);
              const emptySsmSetIds = Object.entries(ssmsCounts)
                .filter((set) => set[1] === 0)
                .map((set) => set[0]);

              const emptyGeneSets = Object.entries(sets.genes)
                .map(([setId, setName]) => ({
                  setId,
                  setName,
                  setType: "genes" as SetTypes,
                }))
                .filter((set) => emptyGeneSetIds.includes(set.setId));

              const emptySsmSets = Object.entries(sets.ssms)
                .map(([setId, setName]) => ({
                  setId,
                  setName,
                  setType: "ssms" as SetTypes,
                }))
                .filter((set) => emptySsmSetIds.includes(set.setId));

              dispatch(removeSets([...emptyGeneSets, ...emptySsmSets]));
            }}
          >
            Delete Empty or Deprecated
          </Button>
        )}
      </div>
      <div className="w-3/4">
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
      <SetDetailPanel
        set={detailSet}
        closePanel={() => setDetailSet(undefined)}
      />
    </div>
  );
};

export default ManageSets;
