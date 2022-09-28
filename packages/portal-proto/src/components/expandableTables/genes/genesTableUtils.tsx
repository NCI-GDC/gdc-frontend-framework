import { GeneAffectedCases } from "./GeneAffectedCases";
import ToggleSpring from "../shared/ToggleSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import _ from "lodash";
import { animated, useSpring } from "react-spring";

interface SingleGene {
  biotype: string;
  case_cnv_gain: number;
  case_cnv_loss: number;
  cnv_case: number;
  cytoband: string[];
  gene_id: string;
  id: string;
  is_cancer_gene_census: boolean;
  name: string;
  numCases: number;
  ssm_case: number;
  symbol: string;
}

interface TableColumnState {
  id: string;
  columnName: string;
  visible: boolean;
}

export const GTableHeader = ({
  twStyles,
  title,
}: {
  twStyles: string;
  title: string;
}): JSX.Element => {
  return (
    <>
      <div className={twStyles}>{_.startCase(title)}</div>
    </>
  );
};

export const GTableCell = ({
  row,
  accessor,
}: // partitionWidth
{
  row: any;
  accessor: string;
  // partitionWidth: any;
}): JSX.Element => {
  return (
    <div>
      <>
        {row.getCanExpand() ? <></> : null}{" "}
        <animated.div
          // onClick={() => console.log('width', width, `w-[${width}px]`)}
          // className={`w-[${width}px]`}
          // style={{
          //   marginLeft: `15px`,
          // }}
          className={`ml-3.5`}
          // style={partitionWidth}
        >
          {row.original[`${accessor}`] ? row.original[`${accessor}`] : ""}
        </animated.div>
      </>
    </div>
  );
};

export const createTableColumn = (
  key: string,
  spring: any,
  width: number,
  partitionWidth: any,
  height: number,
  visibleColumns: TableColumnState[],
) => {
  switch (key) {
    case "SSMSAffectedCasesAcrossTheGDC":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: key,
            header: ({ table }) => <GTableHeader twStyles={``} title={key} />,
            cell: ({ row, getValue }) => {
              return (
                // className={`w-[${Math.floor(width / visibleColumns?.length)}px]`}
                <animated.div style={partitionWidth}>
                  <>
                    <GTableCell
                      row={row}
                      accessor={key}
                      // partitionWidth={Math.floor(width / visibleColumns?.length) || 300}
                    />
                    {row.getCanExpand() && (
                      <button
                        {...{
                          onClick: row.getToggleExpandedHandler(),
                          style: { cursor: "pointer" },
                        }}
                      >
                        <ToggleSpring
                          isExpanded={row.getIsExpanded()}
                          icon={
                            <MdKeyboardArrowDown size="small" color="white" />
                          }
                          twStyles={`bg-red-500 rounded-md h-3 w-3`}
                        />
                      </button>
                    )}
                  </>
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === key && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          spring={spring}
                          width={width}
                          height={height}
                        ></GeneAffectedCases>
                      </div>
                    )}
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    default:
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: key,
            header: ({ table }) => (
              <GTableHeader twStyles={`ml-4`} title={key} />
            ),
            cell: ({ row, getValue }) => {
              return (
                // Math.floor(width / visibleColumns?.length) || 300
                //
                <animated.div
                  // onClick={() => console.log(`w-[${Math.floor(width / visibleColumns?.length)}px]`)} className={`w-[${Math.floor(width / visibleColumns?.length)}px]`}
                  style={partitionWidth}
                >
                  <>
                    <GTableCell
                      row={row}
                      accessor={key}
                      // width={Math.floor(width / visibleColumns?.length) || 200}
                    />
                    <>
                      {!row.getCanExpand() && visibleColumns[0].id === key && (
                        <div className={`relative`}>
                          <GeneAffectedCases
                            geneId={row.value}
                            spring={spring}
                            width={width}
                            height={height}
                          ></GeneAffectedCases>
                        </div>
                      )}
                    </>
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
  }
};

export const getGene = (
  g: SingleGene,
  selectedSurvivalPlot: Record<string, string>,
  mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
) => {
  return {
    // survival: {
    //     name: g.name,
    //     symbol: g.symbol,
    //     checked: g.symbol == selectedSurvivalPlot?.symbol,
    // },
    symbol: g.symbol,
    name: g.name,
    SSMSAffectedCasesInCohort:
      g.cnv_case > 0
        ? `${g.cnv_case + " / " + filteredCases} (${(
            (100 * g.cnv_case) /
            filteredCases
          ).toFixed(2)}%)`
        : `0`,
    SSMSAffectedCasesAcrossTheGDC:
      g.ssm_case > 0
        ? `${g.ssm_case + " / " + cases} (${(
            (100 * g.ssm_case) /
            cases
          ).toFixed(2)}%)`
        : `0`,
    CNVGain:
      g.cnv_case > 0
        ? `${g.case_cnv_gain + " / " + g.cnv_case} (${(
            (100 * g.case_cnv_gain) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    CNVLoss:
      g.cnv_case > 0
        ? `${g.case_cnv_loss + " / " + g.cnv_case} (${(
            (100 * g.case_cnv_loss) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    mutations: mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
  };
};

export const convertGeneFilter = (geneId: string) => {
  return {
    op: "and",
    content: [
      {
        content: {
          field: "genes.gene_id",
          value: [geneId],
        },
        op: "in",
      },
      {
        op: "NOT",
        content: {
          field: "cases.gene.ssm.observation.observation_id",
          value: "MISSING",
        },
      },
    ],
  };
};
