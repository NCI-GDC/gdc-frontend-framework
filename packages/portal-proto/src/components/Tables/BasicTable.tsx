import { Table } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";

interface TempTableProps {
  readonly tableData: {
    readonly headers: string[] | JSX.Element[];
    readonly tableRows: any[];
  };
}

export const BasicTable = ({ tableData }: TempTableProps): JSX.Element => {
  if (!(tableData?.headers?.length > 0 && tableData?.tableRows?.length > 0)) {
    console.error("bad table data", tableData);
    return <></>;
  }
  return (
    <Table
      striped
      data-testid="tempTable"
      className="drop-shadow-sm border-1 border-base-lighter text-sm"
    >
      <thead className="h-14">
        <tr>
          {tableData.headers.map((text, index) => (
            <th
              key={index}
              className="bg-base-max font-heading border-b-4 border-base-lighter py-3"
            >
              {text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.tableRows.map((row, index) => (
          <tr
            key={uuidv4()}
            className={`${
              index % 2 ? "bg-base-lightest" : "bg-base-max "
            } border-base-lighter font-content`}
          >
            {Object.values(row).map((item, index) => (
              <td
                key={index}
                className="text-sm pl-2.5 py-2 border-base-lighter"
              >
                {item || "--"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
