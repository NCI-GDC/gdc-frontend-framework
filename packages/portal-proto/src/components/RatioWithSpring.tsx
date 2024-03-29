import React from "react";
import { animated, useSpring } from "@react-spring/web";
import NumeratorDenominator from "@/components/NumeratorDenominator";

interface Item {
  project?: string | undefined;
  numerator: number;
  denominator: number;
}

interface RatioWithSpringProps {
  item: Item;
  index: number;
}

const RatioWithSpring: React.FC<RatioWithSpringProps> = ({
  item,
  index,
}: RatioWithSpringProps) => {
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
          {project && <span className="font-bold ml-0.5 mr-1">{project}:</span>}
          <NumeratorDenominator
            numerator={numerator}
            denominator={denominator}
          />
        </div>
      </li>
    </animated.ul>
  );
};

export default RatioWithSpring;
