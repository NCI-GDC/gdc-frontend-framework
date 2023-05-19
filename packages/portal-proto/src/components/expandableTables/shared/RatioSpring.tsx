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
      <li
        key={`${project && `${project}-`}subrow-item-${index}`}
        className="list-none -ml-2"
      >
        <NumeratorDenominator
          project={project}
          numerator={numerator}
          denominator={denominator}
        />
      </li>
    </animated.ul>
  );
};

export default RatioSpring;
