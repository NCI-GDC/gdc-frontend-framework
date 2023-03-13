import React from "react";
import { animated, useSpring } from "@react-spring/web";
import { NumeratorDenominator } from "./NumeratorDenominator";

interface Item {
  project?: string | undefined;
  numerator: number;
  denominator: number;
}

interface RatioSpringProps {
  item: Item;
  index: number;
  orientation: string;
}

const RatioSpring: React.FC<RatioSpringProps> = ({
  item,
  index,
  orientation,
}: RatioSpringProps) => {
  const staggeredSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    immediate: true,
  });

  const { numerator, denominator, project } = item;
  const [n, d] = [
    denominator === 0 ? 0 : numerator,
    denominator === 0 ? 1 : denominator,
  ];
  return (
    <>
      <animated.ul style={staggeredSpring}>
        {numerator === 0 ? (
          orientation === "vertical" && <div className="w-max m-auto">0</div>
        ) : (
          <li key={`subrow-item-${index}`} className="list-none">
            <div className="flex w-fit">
              {project && <span className="font-bold mx-0.5">{project}:</span>}{" "}
              <NumeratorDenominator
                numerator={numerator}
                denominator={denominator}
              />
            </div>
            {orientation === "vertical" && (
              <span className="w-max mx-auto">
                ({((n * 100) / d).toFixed(2)}%)
              </span>
            )}
          </li>
        )}
      </animated.ul>
    </>
  );
};

export default RatioSpring;
