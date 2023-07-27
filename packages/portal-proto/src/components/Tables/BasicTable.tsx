import { Table } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";

/**
 * Props for the BasicTable component.
 * @public
 */

interface TempTableProps {
  /**
   * Data for the table.
   */
  readonly tableData: {
    /**
     * Headers for the table.
     * These can be either strings or JSX elements.
     * @public
     */
    readonly headers: string[] | JSX.Element[];
    /**
     * Rows for the table.
     * Each row should be an object representing the data for a single row in the table.
     * The keys of the object correspond to the header names or indices, and the values
     * represent the cell content for each column.
     * @public
     */
    readonly tableRows: any[];
  };
}

/**
 * A basic table component.
 * If the table data is empty or invalid, this component renders an empty fragment.
 * Otherwise, it renders the table with the provided headers and rows.
 * @public
 *
 * @param {TempTableProps} props - The component props.
 * @returns {JSX.Element} The rendered table component.
 */

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
