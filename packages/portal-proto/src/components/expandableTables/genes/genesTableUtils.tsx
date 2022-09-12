import { GeneAffectedCases } from "./GeneAffectedCases";
import _ from "lodash";

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

export const GTableHeader = ({
  twStyles,
  title,
}: {
  twStyles: string;
  title: string;
}): JSX.Element => {
  return (
    <>
      <div className={twStyles} onClick={() => console.log("key", title)}>
        {_.startCase(title)}
      </div>
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
        <div
          style={{
            marginLeft: `15px`,
          }}
        >
          {row.original[`${accessor}`] ? row.original[`${accessor}`] : ""}
        </div>
      </>
    </div>
  );
};

export const SSMSAffectedCasesAcrossTheGDC = ({
  row,
  twStyles,
}: {
  row: any;
  twStyles: string;
}): JSX.Element => {
  return (
    <div className={twStyles}>
      <>
        {row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "👇" : "👉"}
          </button>
        ) : (
          <>
            <div className={`relative`}>
              <GeneAffectedCases geneId={row.value}></GeneAffectedCases>
            </div>
          </>
        )}
        {""}
        {}
      </>
    </div>
  );
};

export const createTableColumn = (key: string) => {
  switch (key) {
    case "SSMSAffectedCasesAcrossTheGDC":
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: key,
            header: ({ table }) => <GTableHeader twStyles={``} title={key} />,
            cell: ({ row, getValue }) => (
              <div>
                <>
                  {row.getCanExpand() ? (
                    <button
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: { cursor: "pointer" },
                      }}
                    >
                      {row.getIsExpanded() ? "👇" : "👉"}
                    </button>
                  ) : (
                    <>
                      <div className={`relative`}>
                        <GeneAffectedCases
                          geneId={row.value}
                        ></GeneAffectedCases>
                      </div>
                    </>
                  )}
                  {""}
                  {}
                </>
              </div>
              // <SSMSAffectedCasesAcrossTheGDC
              //     twStyles={`w-200 pl-${row.depth * 2}`}
              //     row={row}
              // />
            ),
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
                <div>
                  <>
                    <GTableCell row={row} accessor={key} />
                  </>
                </div>
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
    SSMSAffectedCasesAcrossTheGDC:
      g.ssm_case > 0
        ? `${g.ssm_case + " / " + cases} (${(
            (100 * g.ssm_case) /
            cases
          ).toFixed(2)}%)`
        : `0`,
    symbol: g.symbol,
    name: g.name,
    // survival: {
    //     name: g.name,
    //     symbol: g.symbol,
    //     checked: g.symbol == selectedSurvivalPlot?.symbol,
    // },
    SSMSAffectedCasesInCohort:
      g.cnv_case > 0
        ? `${g.cnv_case + " / " + filteredCases} (${(
            (100 * g.cnv_case) /
            filteredCases
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
