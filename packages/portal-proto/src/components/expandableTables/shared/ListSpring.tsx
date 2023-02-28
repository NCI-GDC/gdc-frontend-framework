import React, { useCallback, useMemo } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useMeasure } from "react-use";
import RatioSpring from "./RatioSpring";
import { TableSubrowData } from "@gff/core";
import { FaCircle as Circle } from "react-icons/fa";

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

  const subDataSorted = useMemo(() => {
    return subData
      .map((x): TableSubrowDataWithRatio => {
        return { ...x, ratio: itemRatio(x) };
      })
      .sort((a: TableSubrowDataWithRatio, b: TableSubrowDataWithRatio) => {
        if (itemRatio(a) > itemRatio(b)) return -1;
        if (itemRatio(a) < itemRatio(b)) return 1;
        return 0;
      });
  }, [subData]);

  const renderItems = useCallback(
    (item: TableSubrowDataWithRatio, index: number) => {
      return (
        <div className="flex flex-row items-center">
          <Circle size="0.65em" className="text-primary shrink-0" />
          <RatioSpring
            item={{
              numerator: item.numerator ?? 0,
              denominator: item.denominator ?? 0,
              project: item.project,
            }}
            index={index}
            orientation={"horizontal"}
          />
        </div>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subDataSorted],
  );

  return (
    <>
      <animated.div
        ref={subRef}
        className={`flex flex-wrap bg-inherit absolute mt-2 ml-2`}
        style={horizontalSpring}
      >
        <>
          <h2 className={`flex flex-row w-screen font-bold text-sm p-1`}>
            {subrowTitle}
          </h2>
          <div className={"columns-4 gap-x-10 font-content text-sm"}>
            {subDataSorted.map((item, i) => {
              return (
                <div key={`list-item-${i}`} className={`p-0.25`}>
                  {renderItems({ ...item }, i)}
                </div>
              );
            })}
          </div>
        </>
      </animated.div>
      <animated.div style={verticalSpring}></animated.div>
    </>
  );
};

export default ListSpring;
