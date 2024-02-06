import React, { useState } from "react";
import Link from "next/link";
import { Grid, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import {
  useCoreSelector,
  selectAllSets,
  useGeneSetCountsQuery,
  useSsmSetCountsQuery,
  useCoreDispatch,
  removeSets,
} from "@gff/core";
import { WarningBanner } from "@/components/WarningBanner";
import { CountsIcon } from "@/components/tailwindComponents";
import { convertDateToString } from "src/utils/date";
import download from "@/utils/download";
import { SetData } from "./types";
import SetDetailPanel from "./SetDetailPanel";
import CreateSetButton from "./CreateSetButton";
import ManageSetsTable from "./ManageSetsTable";
import DeleteSetsNotification from "./DeleteSetsNotification";
import AccessibleNotificationWrapper from "@/components/AccessibleNotificationWrapper";

const CreateSetInstructions = () => (
  <p data-testid="text-manage-sets-description" className="py-2 text-sm">
    Create gene and mutation sets using the <b>Create Set</b> button or from the{" "}
    <Link href="/analysis_page?app=MutationFrequencyApp" passHref>
      <a
        data-testid="link-mutation-frequency"
        className="text-utility-link underline font-heading"
      >
        Mutation Frequency app
      </a>
    </Link>
    .
  </p>
);

interface SelectedSetButtonProps {
  readonly selection: SetData[];
  readonly text: string;
  readonly customDataTestID?: string;
  readonly onClick: () => void;
}

const SelectedSetButton: React.FC<SelectedSetButtonProps> = ({
  selection,
  text,
  customDataTestID,
  onClick,
}: SelectedSetButtonProps) => {
  return (
    <Button
      variant="outline"
      color="primary"
      data-testid={customDataTestID}
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
  const [selectedSets, setSelectedSets] = useState<SetData[]>([]);
  const [detailSet, setDetailSet] = useState<SetData>(undefined);
  const sets = useCoreSelector((state) => selectAllSets(state));
  const { data: geneCounts, isSuccess: geneCountsSuccess } =
    useGeneSetCountsQuery({ setIds: Object.keys(sets.genes) });
  const { data: ssmsCounts, isSuccess: ssmsCountsSuccess } =
    useSsmSetCountsQuery({ setIds: Object.keys(sets.ssms) });

  const geneData: SetData[] = Object.entries(sets.genes).map(
    ([setId, setName]) => ({
      setId,
      setName,
      setType: "genes",
      count: geneCountsSuccess ? geneCounts[setId] : undefined,
    }),
  );

  const ssmData: SetData[] = Object.entries(sets.ssms).map(
    ([setId, setName]) => ({
      setId,
      setName,
      setType: "ssms",
      count: ssmsCountsSuccess ? ssmsCounts[setId] : undefined,
    }),
  );

  const noSets =
    Object.keys(sets.genes).length === 0 && Object.keys(sets.ssms).length === 0;
  const deprecatedOrEmptySets =
    geneData.some(({ count }) => count !== undefined && count === 0) ||
    ssmData.some(({ count }) => count !== undefined && count === 0);

  const dispatch = useCoreDispatch();

  return (
    <>
      <h1 className="uppercase text-primary-darkest text-2xl font-montserrat p-4">
        Manage your saved sets
      </h1>
      <hr />
      {noSets ? (
        <Grid justify="center" className="flex-grow">
          <Grid.Col span={4} className="my-20 flex flex-col items-center">
            <div className="h-40 w-40 rounded-[50%] bg-emptyIconLighterColor flex justify-center items-center">
              <FileAddIcon
                size={80}
                className="text-primary-darkest"
                aria-hidden="true"
              />
            </div>
            <p
              data-testid="text-no-saved-sets-available"
              className="uppercase text-primary-darkest text-2xl font-montserrat my-4"
            >
              No saved sets available
            </p>
            <CreateSetInstructions />
            <CreateSetButton />
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
              customDataTestID="button-export-selected-set"
              selection={selectedSets}
              text={"Export Selected"}
              onClick={() => {
                const today = new Date();
                download({
                  endpoint: "tar_sets",
                  params: {
                    attachment: true,
                    filename: `gdc_sets.${convertDateToString(today)}.tar.gz`,
                    sets: selectedSets.map(({ setId, setType, setName }) => ({
                      id: setId,
                      type: setType === "genes" ? "gene" : "ssm",
                      filename: `${setType === "genes" ? "gene" : "ssm"}${
                        selectedSets.length === 1 ? "_set" : ""
                      }_${setName.replace(/[^A-Za-z0-9_.]/g, "_")}.tsv`,
                    })),
                  },
                  method: "POST",
                  dispatch,
                });
              }}
            />
            <SelectedSetButton
              customDataTestID="button-delete-selected-set"
              selection={selectedSets}
              text={"Delete Selected"}
              onClick={() => {
                dispatch(removeSets(selectedSets));
                showNotification({
                  message: (
                    <AccessibleNotificationWrapper>
                      <DeleteSetsNotification sets={selectedSets} />
                    </AccessibleNotificationWrapper>
                  ),
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
                  const emptyGeneSets = geneData.filter(
                    (set) => set.count === 0,
                  );
                  const emptySsmSets = ssmData.filter((set) => set.count === 0);

                  dispatch(removeSets([...emptyGeneSets, ...emptySsmSets]));
                }}
              >
                Delete Empty or Deprecated
              </Button>
            )}
          </div>
          <ManageSetsTable
            geneData={geneData}
            ssmData={ssmData}
            setSelectedSets={setSelectedSets}
            detailSet={detailSet}
            setDetailSet={setDetailSet}
          />
          <SetDetailPanel
            set={detailSet}
            closePanel={() => setDetailSet(undefined)}
          />
        </div>
      )}
    </>
  );
};

export default ManageSets;
