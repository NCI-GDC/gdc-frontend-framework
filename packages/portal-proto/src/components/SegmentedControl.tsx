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
        indicator: "display-none",
        control:
          "rounded-none border-0 [&:nth-child(2)>label]:rounded-l-md [&:nth-child(2)>label]:border-r-0 [&:last-child>label]:border-l-0 [&:last-child>label]:rounded-r-md",
        label:
          "text-primary data-active:text-base-max data-active:bg-primary py-[3px] px-1.5 border-1 !border-primary rounded-none",
      }}
      {...props}
    />
  );
};

export default SegmentedControl;
