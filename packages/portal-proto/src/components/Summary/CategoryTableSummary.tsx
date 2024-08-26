import { MdInfo as InfoIcon } from "react-icons/md";
import { ColumnDef } from "@tanstack/react-table";
import { ActionIcon, Tooltip } from "@mantine/core";
import { HeaderTitle } from "@/components/tailwindComponents";
import VerticalTable from "../Table/VerticalTable";

interface CategoryTableSummaryProps<TData> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData, any>[];
  tooltip?: string;
  customDataTestID?: string;
}

function CategoryTableSummary<TData>({
  title,
  data,
  columns,
  tooltip,
  customDataTestID,
}: CategoryTableSummaryProps<TData>): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-base-contrast-lighter flex">
        <HeaderTitle>{title}</HeaderTitle>
        {tooltip && (
          <Tooltip
            label={tooltip}
            events={{ hover: true, focus: true, touch: false }}
            withArrow
            withinPortal={false}
          >
            <ActionIcon variant="subtle">
              <InfoIcon
                data-testid="button-category-table-tooltip"
                size={16}
                className="text-accent"
              />
            </ActionIcon>
          </Tooltip>
        )}
      </div>
      <VerticalTable
        customDataTestID={customDataTestID}
        data={data}
        columns={columns}
      />
    </div>
  );
}

export default CategoryTableSummary;
