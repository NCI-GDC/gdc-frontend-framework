import React, { useCallback } from "react";
import { animated, useSpring } from "react-spring";
import { useMeasure } from "react-use";
import RatioSpring from "./RatioSpring";

interface ListSpringProps {
  subData: any;
  horizontalSpring: any;
  subrowTitle;
}

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

  const renderItems = useCallback(
    (
      item: { numerator: number; denominator: number; project: string },
      index: number,
    ) => {
      return (
        <RatioSpring item={item} index={index} orientation={"horizontal"} />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subData],
  );

  return (
    <>
      <animated.div
        ref={subRef}
        className={`flex flex-wrap bg-inherit absolute mt-2 ml-2`}
        style={horizontalSpring}
      >
        <>
          <h2 className={`flex flex-row w-screen font-bold text-sm p-2`}>
            {subrowTitle}
          </h2>
          {subData.map((item, i) => renderItems(item, i))}
        </>
      </animated.div>
      <animated.div style={verticalSpring}></animated.div>
    </>
  );
};

export default ListSpring;
