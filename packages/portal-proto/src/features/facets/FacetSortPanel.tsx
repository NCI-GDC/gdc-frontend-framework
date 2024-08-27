import { Button } from "@mantine/core";
import {
  PiCaretUpDownFill as Selector,
  PiCaretDownFill as SortDesIcon,
  PiCaretUpFill as SortAscIcon,
} from "react-icons/pi";
import React, { useEffect, useRef, useState } from "react";
import { SortType } from "./types";

interface FacetSortPanelProps {
  sortType: SortType;
  valueLabel: string;
  setSort: (sort: SortType) => void;
  field: string;
}

const sortTypeToAriaDescription = (
  sortTypeAndDirection: SortType,
  valueLabel: string,
  field: string,
) => {
  if (sortTypeAndDirection.type === "alpha") {
    return sortTypeAndDirection.direction === "asc"
      ? `The ${field} names are now sorted alphabetically ascending`
      : `The ${field} names are now sorted alphabetically descending`;
  } else {
    return sortTypeAndDirection.direction === "asc"
      ? `The ${field} ${valueLabel} are now sorted numerically ascending`
      : `The ${field} ${valueLabel} are now sorted numerically descending`;
  }
};

/**
 * FacetCards "sort" header supporting sort by A-Z or by Value both ascending and descending
 * @param sortType - current sort type
 * @param valueLabel - Value labels, typically "case" "file"
 * @param setSort - sets the sort type and direction
 * @param field - specifies the facet table name
 */
const FacetSortPanel: React.FC<FacetSortPanelProps> = ({
  sortType,
  valueLabel,
  setSort,
  field,
}: FacetSortPanelProps) => {
  const liveRegionRef = useRef(null);
  const [sortingStatus, setSortingStatus] = useState("");
  useEffect(() => {
    if (sortingStatus) {
      liveRegionRef.current.textContent = sortingStatus;
    }
  }, [sortingStatus]);

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
    <div className="flex items-center justify-between py-1 px-2 mb-1 border-b-2">
      <Button
        className="pl-0 ml-0 text-sm"
        variant="subtle"
        size="compact-xs"
        color="primary.9"
        classNames={{
          section: "ml-0",
        }}
        onClick={() => {
          const direction =
            sortType.type === "alpha" && sortType.direction === "asc"
              ? "dsc"
              : "asc";
          const sortObj: SortType = {
            type: "alpha",
            direction,
          };
          setSort(sortObj);
          setSortingStatus(sortTypeToAriaDescription(sortObj, "Name", field));
        }}
        rightSection={<NameSortIcon size={nameIconSize} aria-hidden="true" />}
        aria-label="Sort name alphabetically"
      >
        Name
      </Button>
      <Button
        className="pr-0 mr-0 text-sm"
        classNames={{
          section: "ml-0",
        }}
        variant="subtle"
        size="compact-xs"
        color="primary.9"
        onClick={() => {
          const direction =
            sortType.type === "value" && sortType.direction === "asc"
              ? "dsc"
              : "asc";
          const sortObj: SortType = {
            type: "value",
            direction,
          };
          setSort(sortObj);
          setSortingStatus(
            sortTypeToAriaDescription(sortObj, valueLabel, field),
          );
        }}
        rightSection={<ValueSortIcon size={valueIconSize} aria-hidden="true" />}
        aria-label={`Sort ${valueLabel} numerically`}
      >
        {valueLabel}
      </Button>

      <span
        id={`${field}-liveRegion`}
        aria-live="polite"
        ref={liveRegionRef}
        className="sr-only"
      />
    </div>
  );
};

export default FacetSortPanel;
