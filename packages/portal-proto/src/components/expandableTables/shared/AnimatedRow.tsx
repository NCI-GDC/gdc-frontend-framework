import React from "react";
import { flexRender } from "@tanstack/react-table";

interface AnimatedRowProps {
  row: any;
  index: number;
  selected: boolean;
  subrow: React.FC;
}

/**
 * This component is the row used in ExpTable
 *
 * @param row  // single row of table data
 * @param index // index of row within table
 * @param selected: // checkbox status for the row
 * @constructor
 */

const AnimatedRow: React.FC<AnimatedRowProps> = ({
  row,
  index,
  selected,
  subrow,
}: AnimatedRowProps) => {
  return (
    <tr
      key={row.id}
      className={`border-2 ${
        selected
          ? `border-l-4 border-t-0 border-r-4 border-b-0 border-activeColor`
          : ``
      } ${index % 2 ? `bg-slate-50` : `bg-white`}`}
    >
      {row.getVisibleCells().map((cell, cellIdx) => {
        return (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            {row.id.includes(".") && cellIdx === 0 && subrow}
          </td>
        );
      })}
    </tr>
  );
};

export default AnimatedRow;
