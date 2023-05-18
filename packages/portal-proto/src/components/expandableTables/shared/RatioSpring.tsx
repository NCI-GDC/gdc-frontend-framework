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
        className="list-none"
      >
        <div className={`${project?.length < 12 ? "flex" : "flex flex-col"}`}>
          <div className={`flex-initial`}>
            {project && <span className="font-bold mx-0.5">{project}:</span>}
          </div>
          <div className="ml-0">
            <NumeratorDenominator
              numerator={numerator}
              denominator={denominator}
            />
          </div>
        </div>
      </li>
    </animated.ul>
  );
};

export default RatioSpring;
