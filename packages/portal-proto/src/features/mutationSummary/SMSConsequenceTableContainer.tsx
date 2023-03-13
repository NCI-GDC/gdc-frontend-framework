import { useSsmsConsequenceTable } from "@gff/core";
import { useEffect, useState } from "react";
import { useMeasure } from "react-use";
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
import { HeaderTitle } from "../shared/tailwindComponents";
import FunctionButton from "@/components/FunctionButton";

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

  const {
    data: { status, ssmsConsequence: initialData },
  } = useSsmsConsequenceTable({
    pageSize: 99, // get max 100 entries
    offset: 0,
    mutationId: ssmsId,
  });

  useEffect(() => {
    if (status === "fulfilled") {
      // need to sort the table data and then store all entries in tableData
      const sortedData: ConsequenceTableData[] = [
        ...initialData.consequence.filter(
          ({ transcript: { is_canonical } }) => is_canonical,
        ),
        ...initialData.consequence
          .filter(({ transcript: { is_canonical } }) => !is_canonical)
          .sort((a, b) => {
            if (
              a.transcript.aa_change !== null &&
              b.transcript.aa_change == null
            )
              return -1;
            if (
              a.transcript.aa_change == null &&
              b.transcript.aa_change !== null
            )
              return 1;
            if (
              a.transcript.aa_change == null &&
              b.transcript.aa_change == null
            )
              return 0;
            if (a.transcript.aa_change > b.transcript.aa_change) return 1;
            if (a.transcript.aa_change == b.transcript.aa_change) return 0;
            return -1;
          }),
      ].map(
        ({
          transcript: {
            gene: { gene_id, symbol, gene_strand },
            aa_change,
            consequence_type,
            is_canonical,
            transcript_id,
            annotation: {
              hgvsc,
              polyphen_impact,
              polyphen_score,
              sift_impact,
              sift_score,
              vep_impact,
            },
          },
        }) => {
          return {
            gene: symbol,
            gene_id: gene_id,
            aa_change: aa_change,
            DNAChange: hgvsc,
            consequences: consequence_type,
            transcript_id: transcript_id,
            is_canonical: is_canonical,
            gene_strand: gene_strand,
            impact: {
              polyphenImpact: polyphen_impact,
              polyphenScore: polyphen_score,
              siftImpact: sift_impact,
              siftScore: sift_score,
              vepImpact: vep_impact,
            },
            subRows: " ",
          };
        },
      );
      setTableData(sortedData);
    }
  }, [status, initialData]);

  return (
    <>
      <div className="mt-12">
        <div className="flex mb-2 justify-between">
          <div className="self-end -mb-2">
            <HeaderTitle>Consequences</HeaderTitle>
          </div>

          <div className="flex gap-2">
            <ButtonTooltip label="Export All Except #Cases" comingSoon={true}>
              <FunctionButton>JSON</FunctionButton>
            </ButtonTooltip>
            <ButtonTooltip label="Export current view" comingSoon={true}>
              <FunctionButton>TSV</FunctionButton>
            </ButtonTooltip>
            <DND
              columnListOrder={columnListOrder}
              handleColumnChange={handleColumnChange}
              showColumnMenu={showColumnMenu}
              setShowColumnMenu={setShowColumnMenu}
              defaultColumns={DEFAULT_CONSEQUENCE_TABLE_ORDER}
            />
          </div>
        </div>
      </div>
      <div ref={ref}>
        {!visibleColumns.length ? (
          <TablePlaceholder
            cellWidth="w-48"
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
        <div className="flex mb-2 py-4 px-2 border border-base-lighter border-t-0">
          <div className="flex flex-nowrap items-center m-auto ml-0">
            <span className="mx-1 text-xs">Show</span>
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
