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
  list: boolean;
}

const RatioSpring: React.FC<RatioSpringProps> = ({
  item,
  index,
  list,
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
        key={`subrow-item-${index}`}
        className={`list-none ${list && "-ml-2"}`}
      >
        <div className="flex">
          {!list ? (
            <>
              <>
                {project && (
                  <span className="font-bold mx-0.5">{project}:</span>
                )}{" "}
              </>
              <NumeratorDenominator
                numerator={numerator}
                denominator={denominator}
              />
            </>
          ) : (
            <>
              <div
                className="flex [overflow-wrap:anywhere] font-content"
                data-testid="numeratorDenominatorTest"
              >
                {project ? (
                  <span className="font-bold mx-0.5">{project}:</span>
                ) : null}
                <div className="inline-block">
                  <span>
                    {denominator === 0 ? 0 : numerator.toLocaleString()}
                  </span>{" "}
                  &#47; <span>{denominator.toLocaleString()}</span>
                  <span>
                    {` (${
                      numerator === 0 || denominator === 0
                        ? "0.00%"
                        : (numerator / denominator).toLocaleString(undefined, {
                            style: "percent",
                            minimumFractionDigits: 2,
                          })
                    }) `}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </li>
    </animated.ul>
  );
};

export default RatioSpring;
