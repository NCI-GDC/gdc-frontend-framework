import React from "react";
import { animated, useSpring, config } from "react-spring";

interface ListSpringProps {
  subData: any;
  horizontalSpring: any;
  verticalSpring: any;
}

const ListSpring: React.VFC<ListSpringProps> = ({
  subData,
  horizontalSpring,
  verticalSpring,
}: ListSpringProps) => {
  return (
    <>
      <animated.div
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
      <animated.div style={verticalSpring}></animated.div>
    </>
  );
};

export default ListSpring;
