import React from "react";
import { animated, useSpring } from "@react-spring/web";
import NumeratorDenominator from "./NumeratorDenominator";

interface Item {
  project?: string | undefined;
  numerator: number;
  denominator: number;
}

interface RatioSpringProps {
  item: Item;
  index: number;
}

const RatioSpring: React.FC<RatioSpringProps> = ({
  item,
  index,
}: RatioSpringProps) => {
  const staggeredSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    immediate: true,
  });

  const { numerator, denominator, project } = item;

  return (
    <animated.ul style={staggeredSpring}>
      <li key={`subrow-item-${index}`} className="list-none">
        <div className="flex flex-wrap">
          {project && <span className="font-bold mx-0.5">{project}:</span>}{" "}
          <NumeratorDenominator
            numerator={numerator}
            denominator={denominator}
          />
        </div>
      </li>
    </animated.ul>
  );
};

export default RatioSpring;
