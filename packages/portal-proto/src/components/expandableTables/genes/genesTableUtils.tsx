import ToggleSpring from "../shared/ToggleSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import _ from "lodash";
import { animated } from "react-spring";
// import SwitchSpring from "../shared/SwitchSpring";
// import PercentageBar from "../shared/PercentageBar";
import CheckboxSpring from "../shared/CheckboxSpring";
import SwitchSpring from "../shared/SwitchSpring";
import {
  TableColumnState,
  TableCell,
  TableHeader,
  SurvivalIcon,
  AnnotationsIcon,
  Survival,
} from "../shared/types";
import { GSubrow } from "./GSubrow";

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

export const createTableColumn = (
  accessor: string,
  width: number,
  partitionWidth: any,
  visibleColumns: TableColumnState[],
  selectedGenes: any, // todo: add type,
  selectGene: (geneId: string) => any,
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    geneSymbol: string,
  ) => any,
  setGeneID: any,
  geneID: string,
) => {
  switch (accessor) {
    case "select":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <div>
                  <div className={`content-center`}>
                    {row.getCanExpand() && (
                      <CheckboxSpring
                        isActive={row.original["select"] in selectedGenes}
                        select={row}
                        handleCheck={selectGene}
                        wSpring={partitionWidth}
                      />
                    )}
                  </div>
                  <>
                    <GSubrow
                      geneId={geneID}
                      firstColumn={visibleColumns[0].id}
                      accessor={accessor}
                      width={width}
                      opening={row.getCanExpand()}
                    ></GSubrow>
                  </>
                </div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "survival":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row, getValue }) => {
              //<Tooltip label={`Click icon to plot ${value.symbol}`}>
              //          </Tooltip> */}
              return (
                <>
                  {row.getCanExpand() && (
                    <SwitchSpring
                      isActive={row.original["survival"].checked}
                      icon={<SurvivalIcon />}
                      selected={row.original["survival"]}
                      handleSwitch={handleSurvivalPlotToggled}
                    />
                  )}
                  <>
                    <GSubrow
                      geneId={geneID}
                      firstColumn={visibleColumns[0].id}
                      accessor={accessor}
                      width={width}
                      opening={row.getCanExpand()}
                    ></GSubrow>
                  </>
                </>
              );
            },
          },
        ],
      };
    case "annotations":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`w-max mx-auto`}
                >
                  {row.getCanExpand() && (
                    <div className={`block m-auto w-max`}>
                      <AnnotationsIcon />
                    </div>
                  )}
                  <>
                    <GSubrow
                      geneId={geneID}
                      firstColumn={visibleColumns[0].id}
                      accessor={accessor}
                      width={width}
                      opening={row.getCanExpand()}
                    ></GSubrow>
                  </>
                </animated.div>
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
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  <>
                    <TableCell row={row} accessor={accessor} />
                    {row.getCanExpand() && (
                      <div className={`text-center`}>
                        <button
                          {...{
                            onClick: () => {
                              setGeneID(row.original[`geneID`]);
                              row.toggleExpanded();
                            },
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
                    <GSubrow
                      geneId={geneID}
                      firstColumn={visibleColumns[0].id}
                      accessor={accessor}
                      width={width}
                      opening={row.getCanExpand()}
                    ></GSubrow>
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "CNVGain":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    // <PercentageBar
                    //   numerator={}
                    //   denominator={}
                    //   width={width / visibleColumns.length}
                    // />
                    <TableCell row={row} accessor={accessor} />
                  )}
                  <>
                    <GSubrow
                      geneId={geneID}
                      firstColumn={visibleColumns[0].id}
                      accessor={accessor}
                      width={width}
                      opening={row.getCanExpand()}
                    ></GSubrow>
                  </>
                </animated.div>
              );
            },
            footer: (props) => props.column.id,
          },
        ],
      };
    case "CNVLoss":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <TableHeader twStyles={``} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div
                  style={partitionWidth}
                  className={`content-center`}
                >
                  {row.getCanExpand() && (
                    // <PercentageBar
                    //   numerator={}
                    //   denominator={}
                    //   width={width / visibleColumns.length}
                    // />
                    <TableCell row={row} accessor={accessor} />
                  )}
                  <>
                    <GSubrow
                      geneId={geneID}
                      firstColumn={visibleColumns[0].id}
                      accessor={accessor}
                      width={width}
                      opening={row.getCanExpand()}
                    ></GSubrow>
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
            header: () => <TableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <animated.div style={partitionWidth}>
                  <>
                    <TableCell row={row} accessor={accessor} />
                    <>
                      <GSubrow
                        geneId={geneID}
                        firstColumn={visibleColumns[0].id}
                        accessor={accessor}
                        width={width}
                        opening={row.getCanExpand()}
                      ></GSubrow>
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

export type GenesColumn = {
  select: string;
  geneID: string;
  symbol: string;
  name: string;
  survival: Survival;
  SSMSAffectedCasesInCohort: string;
  SSMSAffectedCasesAcrossTheGDC: string;
  CNVGain: string;
  CNVLoss: string;
  mutations: number;
  annotations: boolean;
  subRows: string;
};

export const getGene = (
  g: SingleGene,
  selectedSurvivalPlot: Record<string, string>,
  mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
  genesTotal: number,
) => {
  return {
    select: g.gene_id,
    geneID: g.gene_id,
    survival: {
      name: g.name,
      symbol: g.symbol,
      checked: g.symbol == selectedSurvivalPlot?.symbol,
    },
    symbol: g.symbol,
    name: g.name,
    SSMSAffectedCasesInCohort:
      g.cnv_case > 0
        ? `${g.cnv_case} / ${filteredCases} (${(
            (100 * g.cnv_case) /
            filteredCases
          ).toFixed(2)}%)`
        : `0`,
    SSMSAffectedCasesAcrossTheGDC:
      g.ssm_case > 0
        ? `${g.ssm_case} / ${cases} (${((100 * g.ssm_case) / cases).toFixed(
            2,
          )}%)`
        : `0`,
    CNVGain:
      g.cnv_case > 0
        ? `${g.case_cnv_gain} / ${g.cnv_case} (${(
            (100 * g.case_cnv_gain) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    CNVLoss:
      g.cnv_case > 0
        ? `${g.case_cnv_loss} / ${g.cnv_case} (${(
            (100 * g.case_cnv_loss) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `--`,
    mutations: mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
    genesTotal,
  };
};

export const convertGeneFilter = (geneId: string) => {
  return {
    filters_gene: {
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
    },
  };
};
