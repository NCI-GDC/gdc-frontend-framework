import React from "react";
import { animated, useSpring } from "react-spring";

interface Item {
  project?: string | undefined;
  numerator: number;
  denominator: number;
}

interface ItemSpringProps {
  item: Item;
  index: number;
}

const ItemSpring: React.FC<ItemSpringProps> = ({
  item,
  index,
}: ItemSpringProps) => {
  const staggeredSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    immediate: true,
  });

  const { numerator, denominator, project } = item;

  return (
    <>
      <animated.ul style={staggeredSpring} className={`p-1 text-xs my-1`}>
        <li key={`subrow-item-${index}`} className={`list-none`}>
          <div className={`flex flex-row w-fit`}>
            {project && (
              <div className={`font-bold text-black mx-0.5`}>{project}:</div>
            )}{" "}
            <div
              className={`text-activeColor underline hover:cursor-pointer mx-1`}
            >
              {numerator}
            </div>
            <div className={`text-black mx-0.5`}> / </div>
            <div className={`text-activeColor underline hover:cursor-pointer`}>
              {denominator}
            </div>
            <div className={`ml-1`}>
              ({(numerator / denominator).toFixed(2)}%)
            </div>
          </div>
        </li>
      </animated.ul>
    </>
  );
};

export default ItemSpring;
