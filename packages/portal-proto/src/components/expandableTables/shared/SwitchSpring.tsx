import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";

interface SwitchSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: any;
  firstColumn: string;
  handleSwitch: (row: any) => any;
  selectedGenes: any; // add type
}

const SwitchSpring: React.VFC<SwitchSpringProps> = ({
  isActive,
  icon,
  selected,
  handleSwitch,
}: SwitchSpringProps) => {
  const ballSpring = useSpring({
    y: -1,
    x: isActive ? 22 : -2,
    backgroundColor: "white",
    // todo: find out why are selects inside table moving faster than select all in table header?
  });

  const sliderSpring = useSpring({
    backgroundColor: isActive ? "rgb(33, 69, 99)" : "lightgray",
  });

  return (
    <animated.div className={`text-center items-center`}>
      <animated.div
        style={sliderSpring}
        className={`border border-base w-10 h-5 mx-auto rounded-xl align-middle`}
        onClick={() => handleSwitch(selected)}
      >
        <animated.div
          style={ballSpring}
          className={`border border-gray-500 w-5 h-5 rounded-xl text-xs text-center`}
        >
          {icon}
        </animated.div>
      </animated.div>
    </animated.div>
  );
};

export default SwitchSpring;
