import React, { useState, forwardRef } from "react";
import { HorizontalTable, HorizontalTableProps } from "./HorizontalTable";
import { Button } from "@mantine/core";
import useOutsideClickAlert from "../hooks/useOutsideClickAlert";

export const SlideDetailButton = forwardRef<
  HTMLDivElement,
  HorizontalTableProps
>(({ tableData }: HorizontalTableProps, wrapperRef) => {
  const [showDetails, setShowDetails] = useState(false);
  useOutsideClickAlert(wrapperRef as React.RefObject<HTMLDivElement>, () =>
    setShowDetails(false),
  );

  return (
    <div ref={wrapperRef} id="details-button" className="absolute -top-3">
      <Button
        onClick={() => setShowDetails((o) => !o)}
        className="h-5 bg-nci-blue-dark w-20 py-1 mb-3 px-0 rounded-md"
        size="xs"
      >
        Details
      </Button>
      {showDetails && (
        <HorizontalTable
          tableData={tableData}
          customContainerStyles="border-3 border-grey"
        />
      )}
    </div>
  );
});
