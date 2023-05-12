import React, { useState, forwardRef } from "react";
import { HorizontalTable, HorizontalTableProps } from "../HorizontalTable";
import { Button } from "@mantine/core";
import useOutsideClickAlert from "@/hooks/useOutsideClickAlert";

export const SlideDetailButton = forwardRef<
  HTMLDivElement,
  HorizontalTableProps
>(({ tableData }: HorizontalTableProps, wrapperRef) => {
  const [showDetails, setShowDetails] = useState(false);
  useOutsideClickAlert(wrapperRef as React.RefObject<HTMLDivElement>, () =>
    setShowDetails(false),
  );

  return (
    <div
      ref={wrapperRef}
      data-testid="details-image-viewer"
      id="details-button"
      className="absolute -top-[11px]"
    >
      <Button
        onClick={() => setShowDetails((o) => !o)}
        className="bg-primary-dark mb-3"
        size="xs"
      >
        Details
      </Button>
      {showDetails && (
        <HorizontalTable
          tableData={tableData}
          customContainerStyles="border-3 border-base"
          slideImageDetails
        />
      )}
    </div>
  );
});
