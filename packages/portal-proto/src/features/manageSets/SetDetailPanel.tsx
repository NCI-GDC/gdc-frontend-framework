import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActionIcon, Drawer, ScrollArea } from "@mantine/core";
import { MdKeyboardBackspace as LeftArrowIcon } from "react-icons/md";
import { SortBy, useGetGenesQuery, useGetSsmsQuery } from "@gff/core";
import { humanify } from "src/utils";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import { SetData } from "./types";

const PAGE_SIZE = 100;

interface SetDetailPanelProps {
  readonly set: SetData;
  readonly closePanel: () => void;
}

const SetDetailPanel: React.FC<SetDetailPanelProps> = ({
  set,
  closePanel,
}: SetDetailPanelProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [sortBy, setSortBy] = useState<SortBy[]>();

  useEffect(() => {
    setCurrentPage(0);
    setTableData([]);
  }, [set?.setId]);

  const {
    data: geneDetailData,
    isSuccess: isGeneSuccess,
    isFetching: isGeneFetching,
  } = useGetGenesQuery(
    {
      request: {
        filters: {
          op: "in",
          content: {
            field: "genes.gene_id",
            value: [`set_id:${set?.setId}`],
          },
        },
        fields: ["gene_id", "symbol"],
        size: PAGE_SIZE,
        from: currentPage * PAGE_SIZE,
        sortBy,
      },
      fetchAll: false,
    },
    { skip: set === undefined || set.setType === "ssms" },
  );

  const {
    data: ssmsDetailData,
    isSuccess: isMutationSuccess,
    isFetching: isMutationFetching,
  } = useGetSsmsQuery(
    {
      request: {
        filters: {
          op: "in",
          content: {
            field: "ssms.ssm_id",
            value: [`set_id:${set?.setId}`],
          },
        },
        fields: ["ssm_id"],
        expand: ["consequence.transcript", "consequence.transcript.gene"],
        size: PAGE_SIZE,
        from: currentPage * PAGE_SIZE,
        sortBy,
      },
      fetchAll: false,
    },
    { skip: set === undefined || set.setType === "genes" },
  );

  const responseData = useMemo(() => {
    if (set?.setType !== undefined) {
      if (set?.setType === "genes") {
        return isGeneSuccess && !isGeneFetching ? [...geneDetailData] : [];
      } else {
        return isMutationSuccess && !isMutationFetching
          ? ssmsDetailData.map((ssm) => ({
              ssm_id: ssm.ssm_id,
              consequence: `${ssm?.consequence?.[0].transcript?.gene?.symbol} ${
                ssm?.consequence?.[0].transcript?.aa_change
                  ? ssm?.consequence?.[0].transcript?.aa_change
                  : ""
              } ${humanify({
                term: ssm?.consequence?.[0]?.transcript.consequence_type
                  ?.replace("_variant", "")
                  .replace("_", " "),
              })}`,
            }))
          : [];
      }
    }

    return [];
  }, [
    JSON.stringify(geneDetailData),
    isGeneFetching,
    isGeneSuccess,
    isMutationFetching,
    isMutationSuccess,
    set?.setType,
    JSON.stringify(ssmsDetailData),
  ]);

  useEffect(() => {
    setTableData([...tableData, ...responseData]);
  }, [JSON.stringify(responseData)]);

  const columns = useMemo(
    () =>
      set?.setType === undefined
        ? []
        : set.setType === "genes"
        ? [
            {
              id: "gene_id",
              columnName: "Gene ID",
              visible: true,
            },
            {
              id: "symbol",
              columnName: "Symbol",
              visible: true,
            },
          ]
        : [
            {
              id: "ssm_id",
              columnName: "Mutation ID",
              visible: true,
            },
            {
              id: "consequence",
              columnName: "Consequence",
              visible: true,
              disableSortBy: true,
            },
          ],
    [set?.setType],
  );

  const scrollRef = useRef<HTMLDivElement>();

  const fetchMoreOnBottomReached = () => {
    if (scrollRef) {
      const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
      if (
        scrollHeight - scrollTop - clientHeight < 20 &&
        responseData.length > 0
      ) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const displayData = useMemo(() => tableData, [JSON.stringify(tableData)]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "sortBy":
        setTableData([]);
        setCurrentPage(0);
        setSortBy(
          obj.sortBy.map((sort) => ({
            field: sort.id,
            direction: sort.desc ? "desc" : "asc",
          })),
        );
        return;
    }
  };

  return (
    <Drawer
      opened={set !== undefined}
      onClose={closePanel}
      position="right"
      classNames={{
        title: "w-full m-0",
      }}
      title={
        <div className="flex flex-row gap-2 items-center w-full text-primary-darker font-bold p-2 border-b border-base-lighter">
          <ActionIcon onClick={closePanel}>
            <LeftArrowIcon size={30} className="text-primary-darker" />
          </ActionIcon>
          <>{set?.setName}</>
        </div>
      }
      target={"#__next"}
      zIndex={1000}
      size={"lg"}
      withCloseButton={false}
    >
      <ScrollArea
        h={700}
        viewportRef={scrollRef}
        offsetScrollbars
        onScrollPositionChange={() => {
          fetchMoreOnBottomReached();
        }}
        className="pl-4"
      >
        <VerticalTable
          tableData={displayData}
          columns={columns}
          selectableRow={false}
          showControls={false}
          columnSorting={"manual"}
          handleChange={handleChange}
          stickyHeader
        />
      </ScrollArea>
    </Drawer>
  );
};

export default SetDetailPanel;
