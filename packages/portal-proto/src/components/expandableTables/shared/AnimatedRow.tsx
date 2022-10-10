import React from "react";
import { animated, useSpring, config } from "react-spring";
import { flexRender } from "@tanstack/react-table";

interface AnimatedRowProps {
  row: any;
  index: number;
  selected: boolean;
}

const AnimatedRow: React.FC<AnimatedRowProps> = ({
  row,
  index,
  selected,
}: AnimatedRowProps) => {
  const rowDelay = (index: number) => {
    return index < 20 ? index * 60 : 100;
  };
  const unitSpring = useSpring({
    from: { opacity: 0, transform: "translate3D(0px, -150px, 0px)" },
    to: { opacity: 1, transform: "translate3D(0px, 0px, 0px)" },
    config: config.gentle,
    delay: rowDelay(index),
    immediate: false,
  });

  return (
    <animated.tr
      style={unitSpring}
      key={row.id}
      className={`border-2 ${
        selected ? `border-2 border-0 border-l-4 border-activeColor` : ``
      } ${index % 2 ? `bg-slate-50` : `bg-white`}`}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <animated.td key={cell.id} className={`mt-0 m-auto`}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </animated.td>
        );
      })}
    </animated.tr>
  );
};

export default AnimatedRow;
