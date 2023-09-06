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
      transition="fade"
      transitionDuration={200}
      multiline
    >
      <Checkbox
        radius="xs"
        checked={isActive}
        indeterminate
        icon={CheckboxIcon}
        aria-disabled={disabled}
        aria-label={ariaText}
        onChange={() => {
          if (!disabled)
            // todo: if used for > 2 icons refactor to use switch(icon) statement
            icon
              ? handleSwitch(selected[`symbol`], selected[`label`], plot)
              : handleSwitch(selected);
        }}
        classNames={{
          root: margin,
          input: `cursor-pointer ${
            disabled
              ? "bg-base-lighter hover:bg-primary-lighter"
              : "hover:bg-primary checked:bg-primary-darkest"
          }`,
        }}
      />
    </Tooltip>
  );
};

export default ToggledCheck;
