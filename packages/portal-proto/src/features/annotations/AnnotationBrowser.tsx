import React, { useEffect, useState } from "react";
import AnnotationFilterPanel from "./AnnotationFilterPanel";
import AnnotationTable from "./AnnotationTable";
import { useClearAllAnnotationFilters } from "./hooks";
import { TableXPositionContext } from "@/components/Table/VerticalTable";

const AnnotationBrowser = () => {
  const clearAllFilters = useClearAllAnnotationFilters();
  useEffect(() => {
    return () => clearAllFilters();
  }, [clearAllFilters]);

  const [tableXPosition, setTableXPosition] = useState<number>(undefined);

  return (
    <>
      <h1 className="uppercase text-primary-darkest text-2xl font-montserrat p-4">
        Browse Annotations
      </h1>
      <hr />
      <TableXPositionContext.Provider
        value={{ xPosition: tableXPosition, setXPosition: setTableXPosition }}
      >
        <div
          className="flex p-4 px-4 pb-16 gap-4 w-full"
          data-testid="table-annotations"
        >
          <AnnotationFilterPanel />
          <div className="grow overflow-hidden mt-8">
            <AnnotationTable />
          </div>
        </div>
      </TableXPositionContext.Provider>
    </>
  );
};

export default AnnotationBrowser;
