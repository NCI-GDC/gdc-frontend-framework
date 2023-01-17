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
}: ToggleProps) => {
  const { plot } = survivalProps ?? { plot: "" };

  const CheckboxIcon: CheckboxProps["icon"] = ({ className }) => {
    return React.cloneElement(icon, { className: className });
  };

  return (
    <Tooltip
      label={`${tooltip}`}
      disabled={!tooltip || tooltip.length == 0}
      withArrow
      arrowSize={6}
      transition="fade"
      transitionDuration={200}
      multiline
      classNames={{
        tooltip:
          "bg-base-lightest text-base-contrast-max font-heading text-bold text-left",
      }}
    >
      <Checkbox
        radius="xs"
        checked={isActive}
        indeterminate
        icon={CheckboxIcon}
        aria-disabled={disabled}
        onChange={() => {
          if (!disabled)
            // todo: if used for > 2 icons refactor to use switch(icon) statement
            icon
              ? handleSwitch(selected[`symbol`], selected[`name`], plot)
              : handleSwitch(selected);
        }}
        classNames={{
          root: margin,
          input: disabled
            ? "bg-base-lighter hover:bg-primary-lighter"
            : "hover:bg-primary checked:bg-primary-darkest",
        }}
      ></Checkbox>
    </Tooltip>
  );
};

export default ToggledCheck;
