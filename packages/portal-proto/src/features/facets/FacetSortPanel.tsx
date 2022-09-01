import { ActionIcon } from "@mantine/core";
import {
  MdSort as SortIcon,
  MdSortByAlpha as AlphaSortIcon,
} from "react-icons/md";
import React from "react";

interface FacetSortPanelProps {
  isSortedByValue: boolean;
  valueLabel: string;
  setIsSortedByValue: (boolean) => void;
}

/**
 * FacetCards "sort" header supporting sort by A-Z (ascending) or by Value (descending)
 * @param isSortedByValue - true if softBy Value
 * @param valueLabel - Value labels, typically "case" "file"
 * @param setIsSortedByValue - function to set state
 * @constructor
 */
const FacetSortPanel: React.FC<FacetSortPanelProps> = ({
  isSortedByValue,
  valueLabel,
  setIsSortedByValue,
}: FacetSortPanelProps) => {
  return (
    <div className="flex flex-row items-center justify-between flex-wrap p-1 mb-1 border-b-2">
      <ActionIcon
        size="xs"
        className={`ml-1 border rounded-sm border-accent-darkest ${
          !isSortedByValue
            ? "bg-accent text-accent-contrast"
            : "bg-accent-lightest text-accent-contrast-lightest"
        }  hover:bg-accent-darker  hover:text-accent-contrast-darker`}
        aria-label="Sort alphabetically"
      >
        <AlphaSortIcon
          onClick={() => setIsSortedByValue(false)}
          scale="1.5em"
        />
      </ActionIcon>
      <div className={"flex flex-row items-center "}>
        <ActionIcon
          size="xs"
          variant={isSortedByValue ? "filled" : "outline"}
          onClick={() => setIsSortedByValue(true)}
          className={`ml-1 border rounded-sm border-accent-darkest ${
            isSortedByValue
              ? "bg-accent text-accent-contrast"
              : "bg-accent-lightest text-accent-contrast-lightest"
          }  hover:bg-accent-darker  hover:text-accent-contrast-darker`}
          aria-label="Sort numerically"
        >
          <SortIcon scale="1.5em" />
        </ActionIcon>
        <p className="px-2 mr-3">{valueLabel}</p>
      </div>
    </div>
  );
};

export default FacetSortPanel;
