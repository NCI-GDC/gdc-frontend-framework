import { Button } from "@mantine/core";
import {
  PiCaretUpDownFill as Selector,
  PiCaretDownFill as SortDesIcon,
  PiCaretUpFill as SortAscIcon,
} from "react-icons/pi";
import React from "react";
import { SortType } from "./types";

const sortTypeToAriaDescription = (sortTypeAndDirection, valueLabel) => {
  if (sortTypeAndDirection.type === "alpha") {
    return sortTypeAndDirection.direction === "asc"
      ? "Name is now sorted alphabetically ascending"
      : "Name is now sorted alphabetically descending";
  } else {
    return sortTypeAndDirection.direction === "asc"
      ? `${valueLabel} is now sorted numerically ascending`
      : `${valueLabel} is now sorted numerically descending`;
  }
};

interface FacetSortPanelProps {
  sortType: SortType;
  valueLabel: string;
  setSort: (sort: SortType) => void;
}

/**
 * FacetCards "sort" header supporting sort by A-Z or by Value both ascending and descending
 * @param sortType - current sort type
 * @param setSort - sets the sort type and direction
 * @param valueLabel - Value labels, typically "case" "file"
 */

const FacetSortPanel: React.FC<FacetSortPanelProps> = ({
  sortType,
  valueLabel,
  setSort,
}: FacetSortPanelProps) => {
  const [NameSortIcon, nameIconSize] =
    sortType.type === "alpha"
      ? sortType.direction === "asc"
        ? [SortAscIcon, "0.75rem"]
        : [SortDesIcon, "0.75rem"]
      : [Selector, "1rem"];
  const [ValueSortIcon, valueIconSize] =
    sortType.type === "value"
      ? sortType.direction === "asc"
        ? [SortAscIcon, "0.75rem"]
        : [SortDesIcon, "0.75rem"]
      : [Selector, "1rem"];
  return (
    <div className="flex flex-row items-center justify-between flex-wrap py-1 px-2 mb-1 border-b-2">
      <Button
        className="pl-0 ml-0"
        variant="subtle"
        size="xs"
        compact
        color="primary.9"
        onClick={() =>
          setSort({
            type: "alpha",
            direction: sortType.direction === "asc" ? "dsc" : "asc",
          })
        }
        rightIcon={<NameSortIcon size={nameIconSize} />}
        aria-label="Sort name alphabetically"
      >
        Name
      </Button>
      <Button
        className="pr-0 mr-0"
        variant="subtle"
        size="xs"
        compact
        color="primary.9"
        onClick={() =>
          setSort({
            type: "value",
            direction: sortType.direction === "asc" ? "dsc" : "asc",
          })
        }
        rightIcon={<ValueSortIcon size={valueIconSize} />}
        aria-label={`Sort ${valueLabel} numerically`}
      >
        {valueLabel}
      </Button>
      <span className="Offscreen">
        <span id="liveRegion" aria-live="polite">
          {sortTypeToAriaDescription(sortType, valueLabel)}
        </span>
      </span>
    </div>
  );
};

export default FacetSortPanel;
