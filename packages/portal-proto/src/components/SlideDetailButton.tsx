import React, { useState, useRef } from "react";
import { HorizontalTable, HorizontalTableProps } from "./HorizontalTable";
import { Button } from "@mantine/core";
import useOutsideClickAlert from "../hooks/useOutsideClickAlert";

export const SlideDetailButton = ({ tableData }: HorizontalTableProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideClickAlert(wrapperRef, () => setShowDetails(false));

  return (
    <div ref={wrapperRef} id="details-button" className="absolute -top-3" >
      <Button
        onClick={() => setShowDetails((o) => !o)}
        className="h-6 bg-nci-blue-dark w-20 py-1 px-0 rounded-md"
      >
        Details
      </Button>
      {
        showDetails &&
        <HorizontalTable tableData={tableData} />
      }
    </div >

  );
};