import React from "react";
import { HeaderTitle } from "@/components/tailwindComponents";
import { HorizontalTable, HorizontalTableProps } from "../HorizontalTable";

export interface SummaryCardProps {
  readonly title?: string;
  readonly tableData: HorizontalTableProps["tableData"];
  readonly customDataTestID?: string;
  readonly tableId?: string;
  readonly enableSync?: boolean;
  readonly ref?: React.Ref<HTMLTableElement>;
}

export const SummaryCard = React.forwardRef<HTMLTableElement, SummaryCardProps>(
  (
    {
      title = "Summary",
      tableData,
      customDataTestID,
      tableId,
      enableSync = false,
    },
    ref,
  ): JSX.Element => {
    return (
      <div className="flex flex-col gap-2 flex-grow">
        {title !== "" ? (
          <HeaderTitle>{title}</HeaderTitle>
        ) : (
          <div className="h-7" />
        )}

        <HorizontalTable
          customDataTestID={customDataTestID}
          tableData={tableData}
          tableId={tableId}
          enableSync={enableSync}
          ref={ref}
        />
      </div>
    );
  },
);
