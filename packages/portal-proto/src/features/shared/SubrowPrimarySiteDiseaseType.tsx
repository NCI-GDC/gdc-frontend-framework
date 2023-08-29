import { animated, useSpring } from "@react-spring/web";
import { Row } from "@tanstack/react-table";
import React from "react";
import { FaCircle as Circle } from "react-icons/fa";
import { useMeasure } from "react-use";

function SubrowPrimarySiteDiseaseType<T>({
  row,
  columnId,
}: {
  row: Row<T>;
  columnId: string;
}): JSX.Element {
  const values = row?.original[columnId] as string[];

  const title = columnId === "disease_type" ? "Disease Type" : "Primary Site";

  const [subRef, { width, height }] = useMeasure();

  const fudgeFactor = width / 60;

  const verticalSpring = useSpring({
    from: {
      opacity: 0,
      height: 0,
    },
    to: {
      opacity: 1,
      height: height + fudgeFactor,
    },
    immediate: true,
  });

  return (
    <>
      <animated.div ref={subRef} className="absolute ml-2 mt-2 w-full">
        <div className="font-semibold text-[1rem] mb-2">{title}</div>
        <div className="columns-4 font-content text-sm">
          {values.map((value) => (
            <div className="flex items-center" key={value}>
              <Circle size="0.65em" className="text-primary shrink-0" />
              <p className="pl-2">{value}</p>
            </div>
          ))}
        </div>
      </animated.div>
      <animated.div style={verticalSpring} />
    </>
  );
}

export default SubrowPrimarySiteDiseaseType;
