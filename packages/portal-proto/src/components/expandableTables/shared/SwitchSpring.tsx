import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";
import { Tooltip } from "@mantine/core";

interface SwitchSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: any;
  handleSwitch: any;
  tooltip: string;
  margin: string;
}

const SwitchSpring: React.FC<SwitchSpringProps> = ({
  isActive,
  icon,
  selected,
  handleSwitch,
  tooltip = undefined,
  margin,
}: SwitchSpringProps) => {
  const ballSpring = useSpring({
    width: 20,
    y: -1,
    x: isActive ? 16 : -4,
  });

  const sliderSpring = useSpring({
    width: 35,
  });

  return (
    <Tooltip label={`${tooltip}`} disabled={!tooltip}>
      <animated.div className={`text-center items-center`}>
        <animated.div
          style={sliderSpring}
          className={`border border-lightgray h-5 ${icon ? `` : `rounded-xl`} ${
            isActive ? `bg-activeColor` : `bg-gray-300`
          } m-auto align-middle`}
          onClick={() => {
            // todo: if used for > 2 icons refactor to use switch(icon) statement
            icon
              ? handleSwitch(selected?.symbol, selected?.name, "gene.symbol")
              : handleSwitch(selected);
          }}
        >
          <animated.div
            style={ballSpring}
            className={`border ${
              isActive ? `border-activeColor` : ``
            } bg-white ${icon ? `` : `rounded-xl`} ${
              isActive ? `bg-lightgray` : ``
            } text-xs h-5`}
          >
            <div className={margin}>{icon}</div>
          </animated.div>
        </animated.div>
      </animated.div>
    </Tooltip>
  );
};

export default SwitchSpring;
