import React from "react";
import { animated, useSpring, config } from "@react-spring/web";
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
      className={`border font-content ${
        selected
          ? `border-x-4 border-y-0 border-activeColor`
          : `border-base-lighter`
      } ${index % 2 === 1 ? `bg-base-max` : `bg-base-lightest`}`}
    >
      {row.getVisibleCells().map((cell, cellIdx) => {
        return (
          <animated.td key={cell.id} className="py-2 px-2 font-content">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            {row.id.includes(".") && cellIdx === 0 && subrow}
          </animated.td>
        );
      })}
    </animated.tr>
  );
};

export default AnimatedRow;
