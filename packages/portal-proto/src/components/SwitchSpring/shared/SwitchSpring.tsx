import React, { ReactNode } from "react";
import { Tooltip, Switch } from "@mantine/core";

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
  const { plot } = survivalProps ?? { plot: "" };

  const toggleSwitch = () => {
    // todo: if used for > 2 icons refactor to use switch(icon) statement
    icon
      ? handleSwitch(selected[`symbol`], selected[`name`], plot)
      : handleSwitch(selected);
  };

  return (
    <Tooltip
      label={tooltip}
      disabled={!tooltip}
      data-testid="tooltipSwitchSpring"
    >
      {/* div added otherwise tooltip does not work in mantine 6 */}
      <div>
        <Switch
          data-testid="button-middle-switchSpring"
          classNames={{
            thumb: `border-2 rounded-sm w-5 h-5 ${
              disabled ? "border-gray-300" : "border-activeColor"
            } ${margin}`,
            input: "",
            track: `overflow-visible border border-base-lightest ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } ${isActive ? "bg-activeColor" : "bg-gray-300"}`,
            root: disabled ? "cursor-not-allowed" : "cursor-pointer",
          }}
          aria-label={tooltip}
          checked={isActive}
          onChange={toggleSwitch}
          disabled={disabled}
          thumbIcon={icon}
        />
      </div>
    </Tooltip>
  );
};

export default SwitchSpring;
