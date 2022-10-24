import React from "react";
import { animated, useSpring } from "react-spring";
import { useMeasure } from "react-use";
import ItemSpring from "./ItemSpring";

interface ListSpringProps {
  subData: any;
  horizontalSpring: any;
  opening: boolean;
}

const ListSpring: React.FC<ListSpringProps> = ({
  subData,
  horizontalSpring,
  opening,
}: ListSpringProps) => {
  const [subRef, { width, height }] = useMeasure();

  const fudgeFactor = width / 60;

  const verticalSpring = useSpring({
    from: { opacity: 0, height: 0 },
    to: {
      opacity: !opening ? 1 : 0,
      height: !opening ? height + fudgeFactor : 0,
    },
    immediate: true,
  });

  return (
    <>
      <animated.div
        ref={subRef}
        className={`flex flex-wrap bg-white absolute mt-2 ml-2`}
        style={horizontalSpring}
      >
        <h2 className={`flex flex-row w-screen font-bold text-sm p-2`}>
          # SSMS Affected Cases Across The GDC
        </h2>
        {subData.map((ratio, index) => {
          return (
            <ItemSpring
              key={index}
              ratio={ratio}
              index={index}
              len={subData.length || 1}
            />
          );
        })}
      </animated.div>
      {/* relative div's height below is derived from the absolute div's height above
      this is to displace the rest of the table when in expanded state
   */}
      <animated.div style={verticalSpring}></animated.div>
    </>
  );
};

export default ListSpring;
