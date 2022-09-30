import { GeneAffectedCases } from "./GeneAffectedCases";
import ToggleSpring from "../shared/ToggleSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import _ from "lodash";
import { animated } from "react-spring";
import SwitchSpring from "../shared/SwitchSpring";

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
}: {
  row: any;
  accessor: string;
}): JSX.Element => {
  return (
    <div>
      <>
        {row.getCanExpand() ? <></> : null}{" "}
        <animated.div className={`ml-3.5 text-center`}>
          {row.original[`${accessor}`] ? row.original[`${accessor}`] : ""}
        </animated.div>
      </>
    </div>
  );
};

export const createTableColumn = (
  accessor: string,
  width: number,
  partitionWidth: any,
  visibleColumns: TableColumnState[],
  selectedGenes: any, // todo: add type,
  selectGene: (geneId: string) => any,
) => {
  switch (accessor) {
    case "select":
      console.log(selectedGenes);
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  <>
                    {row.getCanExpand() && (
                      <SwitchSpring
                        isActive={row.original["select"] in selectedGenes}
                        icon={<span>hi</span>}
                        firstColumn={visibleColumns[0].id}
                        selected={row}
                        handleSwitch={selectGene}
                        selectedGenes={selectedGenes}
                      />
                    )}
                  </>
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
                        ></GeneAffectedCases>
                      </div>
                    )}
                  </>
                </animated.div>
                // <animated.div style={partitionWidth}>

                // <animated.div style={partitionWidth}>
                //   <>

                //     {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                //       <div className={`relative`}>
                //         <GeneAffectedCases
                //           geneId={row.value}
                //           width={width}
                //           opening={row.getCanExpand()}
                //         ></GeneAffectedCases>
                //       </div>
                //     )}
                //   </>
                // </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "SSMSAffectedCasesAcrossTheGDC":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  <>
                    <GTableCell row={row} accessor={accessor} />
                    {row.getCanExpand() && (
                      <div className={`text-center`}>
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
                      </div>
                    )}
                  </>
                  <>
                    {!row.getCanExpand() && visibleColumns[0].id === accessor && (
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                          width={width}
                          opening={row.getCanExpand()}
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
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div style={partitionWidth}>
                  <>
                    <GTableCell row={row} accessor={accessor} />
                    <>
                      {!row.getCanExpand() &&
                        visibleColumns[0].id === accessor && (
                          <div className={`relative`}>
                            <GeneAffectedCases
                              geneId={row.value}
                              width={width}
                              opening={row.getCanExpand()}
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
    select: g.gene_id,
    geneID: g.gene_id,
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
