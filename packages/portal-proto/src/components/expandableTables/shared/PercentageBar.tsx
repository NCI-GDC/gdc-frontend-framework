import React from "react";
import { animated, useSpring } from "react-spring";

interface PercentageBarProps {
  numerator: number;
  denominator: number;
  width: number;
}

const PercentageBar: React.FC<PercentageBarProps> = ({
  numerator,
  denominator,
  width,
}: PercentageBarProps) => {
  const handleWidth = (ratio) => {
    return Math.floor(ratio * 100) < 3
      ? 0.035
      : Math.floor(ratio * 100) > 97
      ? 0.965
      : ratio;
  };

  const nSpring = useSpring({
    from: { width: 0 },
    to: { width: handleWidth(numerator / denominator) * (width / 2) },
  });

  const dSpring = useSpring({
    from: { width: 0 },
    to: {
      width: handleWidth((denominator - numerator) / denominator) * (width / 2),
    },
  });

  return (
    <div className={`w-max flex flex-row h-3 m-auto mt-0.5`}>
      <animated.div
        className={`border-1 border-r-0 rounded-tl-md rounded-bl-md bg-green-500`}
        style={nSpring}
      >
        {}
      </animated.div>
      <animated.div
        className={`border-1 border-l-0 rounded-tr-md rounded-br-md bg-white`}
        style={dSpring}
      >
        {}
      </animated.div>
    </div>
  );
};

export default PercentageBar;
