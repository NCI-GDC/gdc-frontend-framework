import React, { useCallback, useMemo } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useMeasure } from "react-use";
import RatioSpring from "./RatioSpring";
import { FaCircle as Circle } from "react-icons/fa";
import { TableSubrowData } from "@gff/core";

interface ListSpringProps {
  subData: ReadonlyArray<TableSubrowData>;
  horizontalSpring: any;
  subrowTitle;
}

interface TableSubrowDataWithRatio extends TableSubrowData {
  readonly ratio?: number;
}

const itemRatio = (item: TableSubrowData): number | undefined => {
  const { numerator, denominator } = item;
  const [n, d] = [
    denominator === 0 ? 0 : numerator,
    denominator === 0 ? 1 : denominator,
  ];

  if (denominator === 0) return undefined;
  return n / d;
};

const ListSpring: React.FC<ListSpringProps> = ({
  subData,
  horizontalSpring,
  subrowTitle,
}: ListSpringProps) => {
  const [subRef, { width, height }] = useMeasure();

  const fudgeFactor = width / 60;

  const verticalSpring = useSpring({
    from: { opacity: 0, height: 50 },
    to: {
      opacity: 1,
      height: height + fudgeFactor,
    },
    immediate: true,
  });

  const subDataSorted = useMemo(
    () =>
      subData
        .map((x): TableSubrowDataWithRatio => ({ ...x, ratio: itemRatio(x) }))
        .sort((a: TableSubrowDataWithRatio, b: TableSubrowDataWithRatio) => {
          if (itemRatio(a) > itemRatio(b)) return -1;
          if (itemRatio(a) < itemRatio(b)) return 1;
          return 0;
        }),
    [subData],
  );

  const renderItems = useCallback(
    (item: TableSubrowDataWithRatio, index: number) => {
      return (
        <div className="col-span-1">
          <div className="flex items-center">
            <Circle size="0.65em" className="text-primary shrink-0 mr-2" />
            <RatioSpring
              item={{
                numerator: item.numerator ?? 0,
                denominator: item.denominator ?? 0,
                project: item.project,
              }}
              index={index}
            />
          </div>
        </div>
      );
    },
    [],
  );

  return (
    <>
      <animated.div
        ref={subRef}
        className="absolute mt-2 ml-2"
        style={horizontalSpring}
      >
        <span className="font-semibold text-[1rem] mb-2">{subrowTitle}</span>
        <div className="grid grid-cols-4 gap-column-4 gap-row-1 font-content text-sm">
          {subDataSorted.map((item, i) => renderItems({ ...item }, i))}
        </div>
      </animated.div>
      <animated.div style={verticalSpring}></animated.div>
    </>
  );
};

export default ListSpring;
