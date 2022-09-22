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
    <div ref={wrapperRef} id="details-button" className="absolute -top-[14px]">
      <Button
        onClick={() => setShowDetails((o) => !o)}
        className="w-20 bg-primary-dark p-2 mb-3 rounded-md"
        size="sm"
      >
        Details
      </Button>
      {showDetails && (
        <HorizontalTable
          tableData={tableData}
          customContainerStyles="border-3 border-base"
        />
      )}
    </div>
  );
});
