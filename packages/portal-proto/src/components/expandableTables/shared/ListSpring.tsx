import React, { useCallback } from "react";
import { animated, useSpring, config } from "react-spring";
import { useMeasure } from "react-use";
import ItemSpring from "./ItemSpring";
import { Loader } from "@mantine/core";

interface ListSpringProps {
  subData: any;
  horizontalSpring: any;
  isFetching: boolean;
  subrowTitle;
}

const ListSpring: React.FC<ListSpringProps> = ({
  subData,
  horizontalSpring,
  isFetching,
  subrowTitle,
}: ListSpringProps) => {
  const [subRef, { width, height }] = useMeasure();

  const fudgeFactor = width / 60;

  const verticalSpring = useSpring({
    from: { opacity: 0, height: 0 },
    to: {
      opacity: !isFetching ? 1 : 0,
      height: !isFetching ? height + fudgeFactor : 0,
    },
    duration: config.slow,
  });

  const renderItems = useCallback(
    (
      item: { numerator: number; denominator: number; project: string },
      index: number,
    ) => {
      return (
        <ItemSpring
          key={index}
          item={item}
          index={index}
          len={subData.length}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subData.length, isFetching],
  );

  return (
    <>
      <animated.div
        ref={subRef}
        className={`flex flex-wrap bg-inherit absolute mt-2 ml-2`}
        style={horizontalSpring}
      >
        {isFetching ? (
          <Loader />
        ) : (
          <>
            <h2 className={`flex flex-row w-screen font-bold text-sm p-2`}>
              {subrowTitle}
            </h2>
            {subData.map((item, i) => renderItems(item, i))}
          </>
        )}
      </animated.div>
      <animated.div style={verticalSpring}></animated.div>
    </>
  );
};

export default ListSpring;
