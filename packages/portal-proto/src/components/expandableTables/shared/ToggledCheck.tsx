import { Checkbox, CheckboxProps, Tooltip } from "@mantine/core";
import React from "react";

interface ToggleProps {
  isActive: boolean;
  icon: JSX.Element;
  selected: string | Record<string, string>;
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
    <Tooltip label={`${tooltip}`} disabled={!tooltip}>
      <Checkbox
        radius="xs"
        checked={isActive}
        indeterminate
        icon={CheckboxIcon}
        onChange={() => {
          // todo: if used for > 2 icons refactor to use switch(icon) statement
          icon
            ? handleSwitch(selected[`symbol`], selected[`name`], plot)
            : handleSwitch(selected);
        }}
        classNames={{
          root: margin,
          input: "hover:bg-primary checked:bg-primary-darkest",
        }}
      ></Checkbox>
    </Tooltip>
  );
};

export default ToggledCheck;
