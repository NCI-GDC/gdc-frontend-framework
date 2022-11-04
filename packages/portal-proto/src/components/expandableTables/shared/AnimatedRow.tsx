import React from "react";
import { animated, useSpring, config } from "react-spring";
import { flexRender } from "@tanstack/react-table";

interface AnimatedRowProps {
  row: any;
  index: number;
  selected: boolean;
  subrow: React.FC;
}

/**
 * This component is row used in ExpTable
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
  const rowDelay = (index: number) => {
    return index < 20 ? index * 60 : 1200;
  };
  const unitSpring = useSpring({
    from: { opacity: 0, transform: "translate3D(0px, -150px, 0px)" },
    to: { opacity: 1, transform: "translate3D(0px, 0px, 0px)" },
    config: config.gentle,
    delay: rowDelay(index),
  });

  return (
    <animated.tr
      style={unitSpring}
      key={row.id}
      className={`border-2 ${
        selected
          ? `border-2 border-l-4 border-t-0 border-r-0 border-b-0 border-activeColor`
          : ``
      } ${index % 2 ? `bg-slate-50` : `bg-white`}`}
    >
      {row.getVisibleCells().map((cell, cellIdx) => {
        return (
          <animated.td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            {row.id.includes(".") && cellIdx === 0 && subrow}
          </animated.td>
        );
      })}
    </animated.tr>
  );
};

export default AnimatedRow;
