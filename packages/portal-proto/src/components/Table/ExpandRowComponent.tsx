import React from "react";
import { CollapseCircleIcon, ExpandCircleIcon } from "@/utils/icons";

const ExpandRowComponent = ({
  isRowExpanded,
  value,
  isColumnExpanded = true,
  title,
  renderSingleValueInline = true,
}: {
  isRowExpanded: boolean;
  value: string[];
  isColumnExpanded?: boolean;
  title: string;
  renderSingleValueInline?: boolean;
}): React.ReactNode => {
  if (value.length === 0) {
    return "--";
  }

  if (value.length === 1 && renderSingleValueInline) {
    return value;
  }

  return (
    <div className="flex items-center text-primary cursor-pointer gap-2">
      {isRowExpanded && isColumnExpanded ? (
        <CollapseCircleIcon
          size="1.25em"
          className="text-accent"
          data-testid="up-icon"
          aria-hidden="true"
        />
      ) : (
        <ExpandCircleIcon
          size="1.25em"
          className="text-accent"
          data-testid="down-icon"
          aria-hidden="true"
        />
      )}
      <span
        className={`whitespace-nowrap ${
          isRowExpanded && isColumnExpanded && "font-bold"
        }`}
      >
        {value.length.toLocaleString().padStart(6)} {title}
      </span>
    </div>
  );
};

export default ExpandRowComponent;
