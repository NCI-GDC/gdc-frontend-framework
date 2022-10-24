import React from "react";
import { animated, useSpring, config } from "react-spring";

interface ItemSpringProps {
  ratio: any; //  [ { key: string, doc_count: number }, number ]
  index: number;
  len: number;
}

const ItemSpring: React.FC<ItemSpringProps> = ({
  ratio,
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
      <animated.ul style={staggeredSpring} className={`p-1 text-xs my-1`}>
        <li key={`subrow-item-${index}`} className={`list-none`}>
          <div className={`flex flex-row w-fit`}>
            <div className={`font-bold text-black mx-0.5`}>{ratio[0].key}:</div>{" "}
            <div
              className={`text-activeColor underline hover:cursor-pointer mx-1`}
            >
              {ratio[1]}
            </div>
            <div className={`text-black mx-0.5`}> / </div>
            <div className={`text-activeColor underline hover:cursor-pointer`}>
              {ratio[0].doc_count}
            </div>
            <div className={`ml-1`}>
              ({(ratio[1] / ratio[0].doc_count).toFixed(2)}%)
            </div>
          </div>
        </li>
      </animated.ul>
    </>
  );
};

export default ItemSpring;
