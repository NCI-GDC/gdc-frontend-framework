import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Grid, Checkbox, Button } from "@mantine/core";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import {
  useCoreSelector,
  selectAllSets,
  useGeneSetCountsQuery,
  useSsmSetCountsQuery,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { WarningBanner } from "@/components/WarningBanner";
import { CountsIcon } from "@/features/shared/tailwindComponents";

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

interface SelectedThingButtonProps {
  selection: string[];
  text: string;
}

const SelectedThingButton: React.FC<SelectedThingButtonProps> = ({
  selection,
  text,
}: SelectedThingButtonProps) => {
  return (
    <Button
      variant="outline"
      color="primary"
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
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const sets = useCoreSelector((state) => selectAllSets(state));
  const { data: geneCounts, isSuccess: geneCountsSuccess } =
    useGeneSetCountsQuery({ setIds: Object.keys(sets.genes) });
  const { data: ssmsCounts, isSuccess: ssmsCountsSuccess } =
    useSsmSetCountsQuery({ setIds: Object.keys(sets.ssms) });

  const noSets =
    Object.keys(sets.genes).length === 0 && Object.keys(sets.ssms).length === 0;

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
    ],
    [],
  );
  const tableData = useMemo(() => {
    return [
      ...Object.entries(sets.ssms).map(([setId, setName]) => ({
        select: (
          <Checkbox
            value={setId}
            checked={selectedSets.includes(setId)}
            onChange={() =>
              selectedSets.includes(setId)
                ? setSelectedSets(selectedSets.filter((id) => id !== setId))
                : setSelectedSets([...selectedSets, setId])
            }
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
          />
        ),
        entityType: "Mutations",
        name: setName,
        count: ssmsCountsSuccess ? ssmsCounts[setId] : "--",
      })),
      ...Object.entries(sets.genes).map(([setId, setName]) => ({
        select: (
          <Checkbox
            value={setId}
            checked={selectedSets.includes(setId)}
            onChange={() =>
              selectedSets.includes(setId)
                ? setSelectedSets(selectedSets.filter((id) => id !== setId))
                : setSelectedSets([...selectedSets, setId])
            }
            classNames={{
              input: "checked:bg-accent checked:border-accent",
            }}
          />
        ),
        entityType: "Genes",
        name: setName,
        count: geneCountsSuccess ? geneCounts[setId] : "--",
      })),
    ];
  }, [
    selectedSets,
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
      </Grid.Col>
      <CreateSetInstructions />
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
        <SelectedThingButton
          selection={selectedSets}
          text={"Export Selected"}
        />
        <SelectedThingButton
          selection={selectedSets}
          text={"Delete Selected"}
        />
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
    </div>
  );
};

export default ManageSets;
