import React from "react";
import { HorizontalTable, HorizontalTableProps } from "./HorizontalTable";
import { Popover, Button } from "@mantine/core";

export const SlideDetailButton = ({ tableData }: HorizontalTableProps) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <Popover
      opened={showDetails}
      onClose={() => setShowDetails(false)}
      target={
        <Button
          onClick={() => setShowDetails((o) => !o)}
          className="h-6 bg-nci-blue-dark w-20 py-1 px-0 rounded-md"
        >
          Details
        </Button>
      }
      position="bottom"
      id="details-button"
      className="absolute -top-3"
      spacing='md'
      placement="start"
    >
      <div className="flex">
        <HorizontalTable tableData={tableData} />
      </div>
    </Popover>
  );
};