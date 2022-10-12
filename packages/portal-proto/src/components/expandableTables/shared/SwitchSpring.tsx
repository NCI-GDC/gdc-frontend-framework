import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";

interface SwitchSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: any;
  handleSwitch: any;
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
    x: isActive ? 16 : -4,
    backgroundColor: "white",
  });

  const sliderSpring = useSpring({
    width: 35,
    backgroundColor: isActive ? "rgb(32, 68, 97)" : "lightgray",
  });

  return (
    <animated.div className={`text-center items-center`}>
      <animated.div
        style={sliderSpring}
        className={`border border-lightgray h-5 ${
          icon ? `` : `rounded-xl`
        } m-auto align-middle`}
        onClick={() => {
          !icon
            ? handleSwitch(selected)
            : handleSwitch(selected?.symbol, selected?.name, "gene.symbol");
        }}
      >
        <animated.div
          style={ballSpring}
          className={`border border-activeColor ${
            icon ? `` : `rounded-xl`
          } h-5 text-xs`}
        >
          <div className={`mt-1 ml-0.5`}>{icon}</div>
        </animated.div>
      </animated.div>
    </animated.div>
  );
};

export default SwitchSpring;
