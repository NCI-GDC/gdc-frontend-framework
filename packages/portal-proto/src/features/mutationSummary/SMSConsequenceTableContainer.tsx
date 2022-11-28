import { useSsmsConsequenceTable } from "@gff/core";
import { useEffect, useState } from "react";
import { useMeasure } from "react-use";
import { Button } from "@mantine/core";
import { default as PageStepper } from "@/components/expandableTables/shared/PageStepperMantine";
import { default as PageSize } from "@/components/expandableTables/shared/PageSizeMantine";
import TablePlaceholder from "@/components/expandableTables/shared/TablePlaceholder";
import { Column } from "@/components/expandableTables/shared/types";
import { ButtonTooltip } from "@/components/expandableTables/shared/ButtonTooltip";
import DND from "@/components/expandableTables/shared/DND";
import ConsequenceTable from "@/features/mutationSummary/ConsequenceTable";
import { DEFAULT_CONSEQUENCE_TABLE_ORDER } from "@/features/mutationSummary/mutationTableConfig";
import { ConsequenceTableData } from "@/features/mutationSummary/types";

export interface SMSConsequenceTableContainerProps {
  ssmsId: string;
  columnsList?: Array<Column>;
}

const sliceTableData = (
  data: ConsequenceTableData[],
  pageSize: number,
  page: number,
) => data.slice(page * pageSize, (page + 1) * pageSize);

export const SMSConsequenceTableContainer: React.FC<
  SMSConsequenceTableContainerProps
> = ({
  ssmsId,
  columnsList = DEFAULT_CONSEQUENCE_TABLE_ORDER,
}: SMSConsequenceTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [ref] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(columnsList);
  const [visibleColumns, setVisibleColumns] = useState(
    columnsList.filter((col) => col.visible),
  );

  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ConsequenceTableData[]>([]);

  const handleSetPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const [consequenceTotal, setConsequenceTotal] = useState(0);

  const { data } = useSsmsConsequenceTable({
    pageSize: 99, // get max 100 entries
    offset: 0,
    mutationId: ssmsId,
  });

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const { status, ssmsConsequence: initialData } = data;

  useEffect(() => {
    if (status === "fulfilled") {
      // need to sort the table data and then store all entries in tableData
      const sortedData = [
        ...initialData.consequence.filter((x) => x.is_canonical),
        ...initialData.consequence
          .filter((x) => !x.is_canonical)
          .sort((a, b) => {
            if (a.aa_change !== null && b.aa_change == null) return -1;
            if (a.aa_change == null && b.aa_change !== null) return 1;
            if (a.aa_change == null && b.aa_change == null) return 0;
            if (a.aa_change > b.aa_change) return 1;
            if (a.aa_change == b.aa_change) return 0;
            return -1;
          }),
      ].map((c) => {
        return {
          gene: c.gene.symbol,
          aa_change: c.aa_change,
          DNAChange: c.annotation.hgvsc,
          consequences: c.consequence_type,
          transcript_id: c.transcript_id,
          is_canonical: c.is_canonical,
          gene_strand: c.gene.gene_strand,
          impact: {
            polyphenImpact: c.annotation.polyphen_impact,
            polyphenScore: c.annotation.polyphen_score,
            siftImpact: c.annotation.sift_impact,
            siftScore: c.annotation.sift_score,
            vepImpact: c.annotation.vep_impact,
          },
          subRows: " ",
        };
      });
      setTableData(sortedData);
      setConsequenceTotal(initialData.consequenceTotal);
    }
  }, [status, initialData]);

  return (
    <>
      <div className="flex flex-row justify-between items-center flex-nowrap w-100">
        <div className="flex flex-row ml-2 mb-4">
          <div className="flex gap-2">
            <ButtonTooltip label="Export All Except #Cases">
              <Button
                className={
                  "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                }
              >
                JSON
              </Button>
            </ButtonTooltip>
            <ButtonTooltip label="Export current view">
              <Button
                className={
                  "bg-white text-activeColor border border-0.5 border-activeColor text-xs"
                }
              >
                TSV
              </Button>
            </ButtonTooltip>
          </div>
        </div>
        <div className="flex flex-row flex-nowrap mr-2">
          <DND
            columnListOrder={columnListOrder}
            handleColumnChange={handleColumnChange}
            showColumnMenu={showColumnMenu}
            setShowColumnMenu={setShowColumnMenu}
            defaultColumns={DEFAULT_CONSEQUENCE_TABLE_ORDER}
          />
        </div>
      </div>
      <div ref={ref}>
        {!visibleColumns.length ? (
          <TablePlaceholder
            cellWidth={`w-48`}
            rowHeight={60}
            numOfColumns={15}
            numOfRows={pageSize}
            content={<span>No columns selected</span>}
          />
        ) : (
          <div ref={ref}>
            <ConsequenceTable
              ssmsId={ssmsId}
              status={status}
              tableData={sliceTableData(tableData, pageSize, page)}
              pageSize={pageSize}
              page={page}
              columnListOrder={columnListOrder}
              visibleColumns={visibleColumns}
            />
          </div>
        )}
      </div>
      {visibleColumns.length ? (
        <div className={`flex flex-row ml-2 m-auto w-9/12 mb-2`}>
          <div className="flex flex-row flex-nowrap items-center m-auto ml-0">
            <span className=" mx-1 text-xs">Show</span>
            <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
            <span className="my-auto mx-1 text-xs">Entries</span>
          </div>
          <div
            className={`flex flex-row justify-between items-center  text-sm`}
          >
            <span>
              Showing
              <span className={`font-bold`}>{` ${(
                page * pageSize +
                1
              ).toLocaleString("en-US")} `}</span>
              -
              <span className={`font-bold`}>{`${((page + 1) * pageSize <
              consequenceTotal
                ? (page + 1) * pageSize
                : consequenceTotal
              ).toLocaleString("en-US")} `}</span>
              of
              <span
                className={`font-bold`}
              >{` ${consequenceTotal.toLocaleString("en-US")} `}</span>
            </span>
          </div>
          <div className={`m-auto mr-0`}>
            <PageStepper
              page={page}
              totalPages={Math.ceil(consequenceTotal / pageSize)}
              handlePage={handleSetPage}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SMSConsequenceTableContainer;
