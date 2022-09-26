import React, { useState, useEffect, useMemo } from "react";
import { animated, useSpring, config } from "react-spring";
import { useMeasure } from "react-use";

interface ListSpringProps {
  subData: any;
  horizontalSpring: any;
  spring: any;
  containerWidth: number;
  setMiniHeight: any;
}

const ListSpring: React.VFC<ListSpringProps> = ({
  subData,
  horizontalSpring,
  spring,
  containerWidth,
  setMiniHeight,
}: ListSpringProps) => {
  const [subRef, { width }] = useMeasure();
  const [isFull, setIsFull] = useState(false);
  const [subHeight, setSubHeight] = useState(undefined);

  // const subSpring = useMemo(() => {
  //   return subHeight ? spring : useSpring({
  //     from: {
  //       height: 30,
  //       width: 10,
  //       opacity: 0,
  //     },
  //     to: {
  //       height: subHeight,
  //       width: 10,
  //       opacity: 1,
  //     }
  //   })}, [subHeight]);
  //

  useEffect(() => {
    // if subRef width === the width passed from above then lets use a different height for spring below
    if (containerWidth === width) {
      setSubHeight(spring?.height?.animation?.to);
      setIsFull(true);
    }
  }, [containerWidth, width]);

  return (
    <>
      <animated.div
        ref={subRef}
        className={`flex flex-wrap bg-white absolute mt-5`}
        style={horizontalSpring}
      >
        {subData.map((t, key) => {
          return (
            <>
              <ul className={`p-2 text-xs list-disc `}>
                <li key={`subrow-item-${key}`} className={`text-red-500 pr-1`}>
                  <span className={`font-medium text-black`}>{t.key}</span>:{" "}
                  <span
                    className={`text-blue-500 underline hover:cursor-pointer font-medium`}
                  >
                    {t.doc_count}
                  </span>
                  <span className={`text-black`}> / </span>
                  <span
                    className={`text-blue-500 underline hover:cursor-pointer font-medium`}
                  >
                    9999
                  </span>
                </li>
                ({(t.doc_count / 9999).toFixed(2)}%)
              </ul>
            </>
          );
        })}
      </animated.div>
      {/* relative div's height below is derived from the absolute div's height above
      this is to displace the rest of the table when in expanded state
   */}
      <animated.div style={spring}></animated.div>
    </>
  );
};

export default ListSpring;
