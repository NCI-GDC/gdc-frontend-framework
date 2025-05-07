import React, { useContext } from "react";
import {
  MantineProvider,
  SegmentedControl as MantineSegmentedControl,
  SegmentedControlProps as MantineSegmentedControlProps,
} from "@mantine/core";
import { AppContext } from "src/context";

type SegmentedControlProps = MantineSegmentedControlProps & {
  readonly padding?: number;
};

const SegmentedControl: React.FC<SegmentedControlProps> = (props) => {
  const { theme } = useContext(AppContext);

  return (
    <MantineProvider theme={theme}>
      <MantineSegmentedControl
        classNames={{
          root: "bg-base-max h-fit p-0",
          indicator: "opacity-0",
          control:
            "z-0 rounded-none border-0 [&:nth-child(2)>label]:rounded-l-md [&:last-child>label]:rounded-r-md [&:last-child>label]:border-r-1",
          label: `${
            props?.padding ? `p-${props.padding}` : "p-0"
          } text-primary font-semibold data-active:text-base-max data-active:bg-primary data-disabled:bg-base-lightest data-disabled:text-base-lighter
           border-1 border-r-0 !border-primary rounded-none data-disabled:!border-base-lighter`,
        }}
        {...props}
      />
    </MantineProvider>
  );
};

export default SegmentedControl;
