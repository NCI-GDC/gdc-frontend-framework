import React, { ReactNode } from "react";
import { Switch, Tooltip } from "@mantine/core";

interface SwitchSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: string | Record<string, any>;
  handleSwitch: any;
  tooltip: string;
  margin?: string;
  survivalProps?: {
    plot: string;
  };
}

const SwitchMantine: React.FC<SwitchSpringProps> = ({
  isActive,
  icon,
  selected,
  handleSwitch,
  tooltip = undefined,
  margin = "",
  survivalProps,
}: SwitchSpringProps) => {
  const { plot } = survivalProps ?? { plot: "" };

  return (
    <Tooltip label={`${tooltip}`} disabled={!tooltip}>
      <Switch
        radius="xs"
        classNames={{ root: `flex flex-col ${margin}` }}
        checked={isActive}
        thumbIcon={icon}
        onChange={() => {
          // todo: if used for > 2 icons refactor to use switch(icon) statement
          icon
            ? handleSwitch(selected[`symbol`], selected[`name`], plot)
            : handleSwitch(selected);
        }}
      ></Switch>
    </Tooltip>
  );
};

export default SwitchMantine;
