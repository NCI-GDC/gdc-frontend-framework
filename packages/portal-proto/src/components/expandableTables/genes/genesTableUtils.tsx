import { JSX_TYPES } from "@babel/types";
import { GeneAffectedCases } from "./GeneAffectedCases";

const GTableHeader = ({
  twStyles,
  key,
}: {
  twStyles: string;
  key: string;
}): JSX.Element => {
  return (
    <>
      <div className={twStyles}>{key}</div>
    </>
  );
};

const GTableCell = ({
  twStyles,
  row,
  value,
}: {
  twStyles: string;
  row: any;
  value: any;
}): JSX.Element => {
  return (
    <div>
      <>
        {row.getCanExpand() ? <></> : null}{" "}
        <div className={twStyles}>{value}</div>
      </>
    </div>
  );
};

const SSMSAffectedCasesAcrossTheGDC = ({
  twStyles,
  row,
}: {
  twStyles: string;
  row: any;
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
    case `${[
      "symbol",
      "name",
      "survival",
      "SSMSAffectedCasesInCohort",
      "CNVGain",
      "CNVLoss",
      "mutations",
      "annotations",
    ].includes(key)}`:
      return {
        header: " ",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: `${key}`,
            header: ({ table }) => <GTableHeader twStyles={`ml-4`} key={key} />,
            cell: ({ row, getValue }) => (
              <GTableCell twStyles={`ml-4`} row={row} value={getValue()} />
            ),
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
            accessorKey: key,
            header: ({ table }) => <GTableHeader twStyles={``} key={key} />,
            cell: ({ row, getValue }) => (
              <SSMSAffectedCasesAcrossTheGDC
                twStyles={`w-200 pl-${row.depth * 2}`}
                row={row}
              />
            ),
            footer: (props) => props.column.id,
          },
        ],
      };
  }
};
