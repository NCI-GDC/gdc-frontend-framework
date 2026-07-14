import React, { JSX } from "react";
import { CircleIcon } from "@/utils/icons";
import { animated, useSpring } from "@react-spring/web";
import { Row } from "@tanstack/react-table";
import { useElementSize } from "@mantine/hooks";

function SubrowPrimarySiteDiseaseType<T>({
  row,
  columnId,
}: {
  row: Row<T>;
  columnId: string;
}): JSX.Element {
  const values = row?.original[columnId] as string[];

  const title = columnId === "disease_type" ? "Disease Type" : "Primary Site";

  const { ref: subRef, width, height } = useElementSize();

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
              <CircleIcon
                size="0.65em"
                className="text-primary shrink-0 self-start mt-1.5"
              />
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
