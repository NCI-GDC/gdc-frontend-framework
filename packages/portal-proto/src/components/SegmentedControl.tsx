import React from "react";
import {
  SegmentedControl as MantineSegmentedControl,
  SegmentedControlProps,
} from "@mantine/core";

const SegmentedControl: React.FC<SegmentedControlProps> = (
  props: SegmentedControlProps,
) => {
  return (
    <MantineSegmentedControl
      classNames={{
        root: "bg-base-max h-fit",
        indicator: "opacity-0",
        control:
          "rounded-none border-0 [&:nth-child(2)>label]:rounded-l-md [&:last-child>label]:rounded-r-md [&:last-child>label]:border-r-1",
        label: `text-primary data-active:text-base-max data-active:bg-primary data-disabled:bg-base-lightest data-disabled:text-base-lighter
          py-[3px] px-1.5 border-1 border-r-0 !border-primary rounded-none data-disabled:!border-base-lighter`,
      }}
      {...props}
    />
  );
};

export default SegmentedControl;
