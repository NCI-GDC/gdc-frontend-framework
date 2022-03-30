import React from "react";
import { HorizontalTable, HorizontalTableProps } from "./HorizontalTable";
import { Popover, Button } from "@mantine/core";

export const SlideDetailButton = React.forwardRef<HTMLButtonElement, HorizontalTableProps>(({ tableData }: HorizontalTableProps, ref) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <Popover
      opened={showDetails}
      onClose={() => setShowDetails(false)}
      target={
        <Button
          onClick={() => setShowDetails((o) => !o)}
          className="h-6 bg-nci-blue-dark w-20 py-1 px-0 rounded-md"
          ref={ref}
        >
          Details
        </Button>
      }
      position="bottom"
      id="details-button"
      className="absolute -top-3"
      spacing='md'
      // ref={}
    >
      <div className="flex">
        <HorizontalTable tableData={tableData} />
      </div>
    </Popover>
  );
});
