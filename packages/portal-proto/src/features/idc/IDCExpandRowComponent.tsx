import React from "react";
import { CollapseCircleIcon, ExpandCircleIcon } from "@/utils/icons";

const IDCExpandRowComponent = ({
  isRowExpanded = false,
  value = [],
  title,
}: {
  isRowExpanded: boolean;
  value: string[];
  title: string;
}): React.ReactNode => {
  if (value.length === 0) return "--";

  return (
    <div className="flex items-center text-primary gap-2">
      {isRowExpanded ? (
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
      <span className={`whitespace-nowrap ${isRowExpanded && "font-bold"}`}>
        {value.length.toLocaleString().padStart(6)} {title}
      </span>
    </div>
  );
};

export default IDCExpandRowComponent;
