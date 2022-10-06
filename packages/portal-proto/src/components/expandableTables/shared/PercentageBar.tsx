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
  // todo: add edge case conditions for % < ~5% & > ~95%

  const nSpring = useSpring({
    backgroundColor: "black",
    color: "black",
    width: (numerator / denominator) * (width / 2),
  });

  const dSpring = useSpring({
    backgroundColor: "red",
    color: "red",
    width: ((denominator - numerator) / denominator) * (width / 2),
  });

  return (
    <div className={`w-max flex flex-row h-3 m-auto`}>
      <animated.div className={`rounded-tl-md rounded-bl-md`} style={nSpring}>
        '
      </animated.div>
      <animated.div className={`rounded-tr-md rounded-br-md`} style={dSpring}>
        '
      </animated.div>
    </div>
  );
};

export default PercentageBar;
