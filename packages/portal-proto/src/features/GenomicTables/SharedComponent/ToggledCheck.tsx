import { Checkbox, CheckboxProps, Tooltip } from "@mantine/core";
import React from "react";

interface ToggleProps {
  isActive: boolean;
  icon: JSX.Element;
  selected: string | Record<string, string>;
  disabled?: boolean;
  handleSwitch: any;
  tooltip: string;
  margin: string;
  survivalProps?: {
    plot: string;
  };
  ariaText: string;
}

const ToggledCheck: React.FC<ToggleProps> = ({
  isActive,
  icon,
  selected,
  disabled = false,
  handleSwitch,
  tooltip = undefined,
  margin,
  survivalProps,
  ariaText,
}: ToggleProps) => {
  const { plot } = survivalProps ?? { plot: "" };

  const CheckboxIcon: CheckboxProps["icon"] = ({ className }) => {
    return React.cloneElement(icon, { className: className });
  };

  return (
    <Tooltip
      label={`${tooltip}`}
      disabled={!tooltip || tooltip.length == 0}
      transitionProps={{ duration: 200, transition: "fade" }}
      multiline
    >
      <Checkbox
        radius="xs"
        checked={isActive}
        indeterminate
        icon={CheckboxIcon}
        aria-disabled={disabled}
        aria-label={ariaText}
        variant="outline"
        color={isActive ? "white" : "black"}
        onChange={() => {
          if (!disabled)
            // todo: if used for > 2 icons refactor to use switch(icon) statement
            icon
              ? handleSwitch(selected[`symbol`], selected[`label`], plot)
              : handleSwitch(selected);
        }}
        classNames={{
          root: margin,
          input: `peer cursor-pointer ${
            disabled
              ? "bg-base-lighter hover:bg-primary-lighter"
              : "hover:bg-primary checked:bg-primary-darkest"
          }`,
          icon: "peer-hover:!text-white",
        }}
      />
    </Tooltip>
  );
};

export default ToggledCheck;
