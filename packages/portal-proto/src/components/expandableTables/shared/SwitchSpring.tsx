import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";

interface SwitchSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: any;
  handleSwitch: (row: any) => any;
  selectedGenes: any; // add type
}

const SwitchSpring: React.FC<SwitchSpringProps> = ({
  isActive,
  icon,
  selected,
  handleSwitch,
}: SwitchSpringProps) => {
  const ballSpring = useSpring({
    width: 20,
    y: -1,
    x: isActive ? 14 : -6,
    backgroundColor: "white",
    // todo: find out why are selects inside table moving faster than select all in table header?
  });

  const sliderSpring = useSpring({
    width: 28,
    backgroundColor: isActive ? "rgb(32, 68, 97)" : "lightgray",
  });

  return (
    <animated.div className={`text-center items-center`}>
      <animated.div
        style={sliderSpring}
        className={`border border-gray-300 w-10 h-5 mx-auto rounded-xl align-middle`}
        onClick={() => handleSwitch(selected)}
      >
        <animated.div
          style={ballSpring}
          className={`border border-gray-300 w-5 h-5 rounded-xl text-xs text-center`}
        >
          {icon}
        </animated.div>
      </animated.div>
    </animated.div>
  );
};

export default SwitchSpring;
