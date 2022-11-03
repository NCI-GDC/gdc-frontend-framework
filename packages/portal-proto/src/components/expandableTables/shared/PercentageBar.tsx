import React from "react";
import { animated, useSpring } from "react-spring";

interface PercentageBarProps {
  numerator: number;
  denominator: number;
  scale: number;
}

const PercentageBar: React.FC<PercentageBarProps> = ({
  numerator,
  denominator,
  scale,
}: PercentageBarProps) => {
  const handleEdgeWidth = (ratio) => {
    return Math.floor(ratio * 100) <= 6
      ? 0.055
      : Math.floor(ratio * 100) >= 94
      ? 0.945
      : ratio;
  };

  const nSpring = useSpring({
    from: { width: 0 },
    to: { width: handleEdgeWidth(numerator / denominator) * (scale / 2) },
    immediate: true,
  });

  const dSpring = useSpring({
    from: { width: scale / 2 },
    to: {
      width:
        handleEdgeWidth((denominator - numerator) / denominator) * (scale / 2),
    },
    immediate: true,
  });

  return (
    <div className={`w-max flex flex-row h-3 m-auto mt-0.5`}>
      <animated.div
        className={`border-1 border-r-0 rounded-tl-sm rounded-bl-sm bg-green-500`}
        style={nSpring}
      >
        {}
      </animated.div>
      <animated.div
        className={`border-1 border-l-0 rounded-tr-sm rounded-br-sm bg-white`}
        style={dSpring}
      >
        {}
      </animated.div>
    </div>
  );
};

export default PercentageBar;
