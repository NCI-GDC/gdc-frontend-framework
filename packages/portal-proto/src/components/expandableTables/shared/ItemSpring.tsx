import React from "react";
import { animated, useSpring, config } from "react-spring";
import { ConfigSet } from "ts-jest/dist/config";

interface CaseCountByProject {
  doc_count: number;
  key: string;
}

interface ItemSpringProps {
  numerator: CaseCountByProject;
  index: number;
  len: number;
}

const ItemSpring: React.VFC<ItemSpringProps> = ({
  numerator,
  index,
  len,
}: ItemSpringProps) => {
  const staggeredSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: (index % Math.sqrt(len)) * 10,
    config: config.slow,
  });

  return (
    <>
      <animated.ul style={staggeredSpring} className={`p-2 text-xs list-disc `}>
        <li key={`subrow-item-${index}`} className={`text-red-500 pr-1`}>
          <span className={`font-medium text-black`}>{numerator.key}</span>:{" "}
          <span
            className={`text-blue-500 underline hover:cursor-pointer font-medium`}
          >
            {numerator.doc_count}
          </span>
          <span className={`text-black`}> / </span>
          <span
            className={`text-blue-500 underline hover:cursor-pointer font-medium`}
          >
            9999
          </span>
        </li>
        ({(numerator.doc_count / 9999).toFixed(2)}%)
      </animated.ul>
    </>
  );
};

export default ItemSpring;
