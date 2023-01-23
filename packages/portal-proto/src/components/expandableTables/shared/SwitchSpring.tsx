import React, { ReactNode } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Tooltip } from "@mantine/core";
import classNames from "classnames";

interface SwitchSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: string | Record<string, any>;
  disabled?: boolean;
  handleSwitch: any;
  tooltip: string;
  margin: string;
  survivalProps?: {
    plot: string;
  };
}

const SwitchSpring: React.FC<SwitchSpringProps> = ({
  isActive,
  icon,
  selected,
  disabled = false,
  handleSwitch,
  tooltip = undefined,
  margin,
  survivalProps,
}: SwitchSpringProps) => {
  const ballSpring = useSpring({
    width: 20,
    y: -1,
    x: isActive ? 16 : -4,
  });

  const sliderSpring = useSpring({
    width: 35,
  });

  const { plot } = survivalProps ?? { plot: "" };

  // TODO add roles in divs for switch for a11y
  return (
    <Tooltip
      label={tooltip}
      disabled={!tooltip}
      data-testid="tooltipSwitchSpring"
    >
      <animated.div
        className={`text-center items-center`}
        aria-disabled={disabled}
        role="switch"
        data-testid="top-div-switchSpring"
      >
        <animated.div
          style={sliderSpring}
          data-testid="middle-div-switchSpring"
          className={classNames(
            "border border-lightgray h-5",
            {
              "rounded-xl": icon,
              "cursor-not-allowed": disabled,
            },
            isActive ? "bg-activeColor" : "bg-gray-300",
            "m-auto align-middle",
          )}
          onClick={() => {
            if (disabled) {
              return;
            }
            // todo: if used for > 2 icons refactor to use switch(icon) statement
            icon
              ? handleSwitch(selected[`symbol`], selected[`name`], plot)
              : handleSwitch(selected);
          }}
        >
          <animated.div
            style={ballSpring}
            className={`border-2 rounded-sm ${
              disabled ? "border-gray-300" : "border-activeColor"
            }
             bg-white ${icon && `rounded-xl`} ${
              isActive && `bg-lightgray`
            } text-xs h-5`}
            data-testid="bottom-div-switchSpring"
          >
            <div className={margin}>{icon}</div>
          </animated.div>
        </animated.div>
      </animated.div>
    </Tooltip>
  );
};

export default SwitchSpring;
