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
  margin?: string;
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

  return (
    <Tooltip
      label={tooltip}
      disabled={!tooltip}
      data-testid="tooltipSwitchSpring"
    >
      <animated.div
        data-testid="button-middle-switchSpring"
        style={sliderSpring}
        className={classNames(
          "border border-lightgray",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          {
            "rounded-xl": icon,
          },
          isActive ? "bg-activeColor" : "bg-gray-300",
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
        aria-disabled={disabled}
      >
        <animated.div
          data-testid="button-bottom-switchSpring"
          style={ballSpring}
          className={`ml-1 border-2 rounded-sm ${
            disabled ? "border-gray-300" : "border-activeColor"
          }
             bg-white ${icon && `rounded-xl`} ${
            isActive && `bg-lightgray`
          } h-5`}
        >
          <div className={margin}>{icon}</div>
        </animated.div>
      </animated.div>
    </Tooltip>
  );
};

export default SwitchSpring;
