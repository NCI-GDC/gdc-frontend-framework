import { GeneAffectedCases } from "./GeneAffectedCases";
import ToggleSpring from "../shared/ToggleSpring";
import { MdKeyboardArrowDown } from "react-icons/md";
import _ from "lodash";
import { animated } from "react-spring";
// import SwitchSpring from "../shared/SwitchSpring";
import SurvivalSpring from "../shared/SurvivalSpring";
// import PercentageBar from "../shared/PercentageBar";
import CheckboxContainer from "../shared/CheckboxContainer";
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

export const SurvivalIcon = () => {
  return (
    <svg
      viewBox="0 0 2048 1536"
      style={{
        height: "0.8em",
        fill: "currentcolor",
        flexBasis: 16,
      }}
    >
      <path d="m 1917.282,1250.0708 0,-435.00002 c 0,-14 -6.5,-23.83333 -19.5,-29.5 -13,-5.66667 -24.8333,-3.16667 -35.5,7.5 l -121,121.00002 -632.9999,-633.00002 c -6.6667,-6.66667 -14.3334,-10 -23,-10 -8.6667,0 -16.3334,3.33333 -23,10 l -233.00004,233 -416,-416 -192,192 585,585.00002 c 6.66667,6.6667 14.33333,10 23,10 8.66667,0 16.33333,-3.3333 23,-10 l 233.00004,-233.00002 463.9999,464.00002 -121,121 c -10.6667,10.6667 -13.1667,22.5 -7.5,35.5 5.6667,13 15.5,19.5 29.5,19.5 l 435,0 c 9.3333,0 17,-3 23,-9 6,-6 9,-13.6667 9,-23 z" />
      <path d="m 2048,1408 0,128 L 0,1536 0,0 l 127.99999,0 0,1408 z" />
    </svg>
  );
};

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
        <animated.div className={`ml-3.5 text-center text-xs`}>
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
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    geneSymbol: string,
  ) => any,
) => {
  switch (accessor) {
    case "select":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: accessor,
            header: () => <GTableHeader twStyles={`ml-4`} title={accessor} />,
            cell: ({ row }) => {
              return (
                <div>
                  <div className={`content-center`}>
                    {row.getCanExpand() && (
                      <CheckboxContainer
                        isActive={row.original["select"] in selectedGenes}
                        select={row}
                        handleCheck={selectGene}
                        width={width / visibleColumns.length}
                        wSpring={partitionWidth}
                      />
                    )}
                  </div>
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
            header: () => <GTableHeader twStyles={``} title={accessor} />,
            cell: ({ row, getValue }) => {
              return (
                <>
                  {/* <Tooltip label={`Click icon to plot ${value.symbol}`}> */}
                  <SwitchSpring
                    isActive={true}
                    icon={<SurvivalIcon />} // survivalIcon
                    selected={{}}
                    // survival={row}
                    // selectedGenes={undefined}
                    handleSwitch={handleSurvivalPlotToggled}
                  />
                  {/* <Switch
                  radius="xs"
                  size="sm"
                  id={`genetable-survival-${row.getValue().symbol}`}
                  checked={row.getValue().checked}
                  onChange={() => {
                    handleSurvivalPlotToggled(
                      value.symbol,
                      value.name,
                      "gene.symbol",
                    );
                  }}
                  classNames={{
                    input:
                      "bg-base-light checked:bg-primary-dark  checked:bg-none",
                  }}
                /> */}
                  {/* </Tooltip> */}
                </>
              );
            },
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
    case "CNVGain":
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
                  {row.getCanExpand() && (
                    // <PercentageBar
                    //   numerator={}
                    //   denominator={}
                    //   width={width / visibleColumns.length}
                    // />
                    <div className={`flex flex-row w-max m-auto`}>sup</div>
                  )}
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
    case "CNVLoss":
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
                  {row.getCanExpand() && (
                    // <PercentageBar
                    //   numerator={}
                    //   denominator={}
                    //   width={width / visibleColumns.length}
                    // />
                    <div className={`flex flex-row w-max m-auto`}>sup</div>
                  )}
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
        : `0`,
    CNVLoss:
      g.cnv_case > 0
        ? `${g.case_cnv_loss + " / " + g.cnv_case} (${(
            (100 * g.case_cnv_loss) /
            g.cnv_case
          ).toFixed(2)}%)`
        : `0`,
    mutations: mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
    // do not remove subRows key, its needed for row.getCanExpand() to be true
    subRows: " ",
    genesTotal,
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
