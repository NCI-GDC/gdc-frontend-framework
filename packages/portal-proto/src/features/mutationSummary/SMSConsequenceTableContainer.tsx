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
import useStandardPagination from "@/hooks/useStandardPagination";

export interface SMSConsequenceTableContainerProps {
  ssmsId: string;
  columnsList?: Array<Column>;
}

export const SMSConsequenceTableContainer: React.FC<
  SMSConsequenceTableContainerProps
> = ({
  ssmsId,
  columnsList = DEFAULT_CONSEQUENCE_TABLE_ORDER,
}: SMSConsequenceTableContainerProps) => {
  const [ref] = useMeasure();
  const [columnListOrder, setColumnListOrder] = useState(columnsList);
  const [visibleColumns, setVisibleColumns] = useState(
    columnsList.filter((col) => col.visible),
  );

  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ConsequenceTableData[]>([]);

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

  const handleSetPage = (pageIndex: number) => {
    handlePageChange(pageIndex + 1);
  };
  const handleSetPageSize = (size: number) => {
    handlePageSizeChange(size.toString());
  };

  useEffect(() => {
    setVisibleColumns(columnListOrder.filter((col) => col.visible));
  }, [columnListOrder]);

  const handleColumnChange = (columnUpdate) => {
    setColumnListOrder(columnUpdate);
  };

  const { data } = useSsmsConsequenceTable({
    pageSize: 99, // get max 100 entries
    offset: 0,
    mutationId: ssmsId,
  });
  const { status, ssmsConsequence: initialData } = data;

  useEffect(() => {
    if (status === "fulfilled") {
      // need to sort the table data and then store all entries in tableData
      const sortedData: ConsequenceTableData[] = [
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
          gene_id: c.gene.gene_id,
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
            numOfRows={size}
            content={<span>No columns selected</span>}
          />
        ) : (
          <div ref={ref}>
            <ConsequenceTable
              ssmsId={ssmsId}
              status={status}
              tableData={displayedData as ConsequenceTableData[]}
              pageSize={size}
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
            <PageSize pageSize={size} handlePageSize={handleSetPageSize} />
            <span className="my-auto mx-1 text-xs">Entries</span>
          </div>
          <div className={`flex flex-row justify-between items-center text-sm`}>
            <span>
              Showing
              <span className={`font-bold px-1`}>
                {from.toLocaleString("en-US")}
              </span>
              -
              <span className={`font-bold  px-1`}>
                {Math.min(page * size, total).toLocaleString("en-US")}
              </span>
              of
              <span className={`font-bold  px-1`}>{total}</span>
            </span>
          </div>
          <div className={`ml-auto mr-0`}>
            <PageStepper
              page={page - 1}
              totalPages={pages}
              handlePage={handleSetPage}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SMSConsequenceTableContainer;
