import React from "react";
import {
  MdAddCircle as MoreIcon,
  MdRemoveCircle as LessIcon,
} from "react-icons/all";

interface FacetExpanderProps {
  readonly remainingValues: number;
  readonly isGroupExpanded: boolean;
  readonly onShowChanged: (v: boolean) => void;
  readonly color?: string;
}

/**
 * Component which manages the compact/expanded state of a FacetCard
 * @param remainingValues - number of remaining values when compact "show 4"
 * @param isGroupExpanded - true if expanded, false if compact
 * @param onShowChanged - callback to call when the expand/compact button is clicked
 * @constructor
 */
export const FacetExpander: React.FC<FacetExpanderProps> = ({
  remainingValues,
  isGroupExpanded,
  onShowChanged,
  color = "primary",
}: FacetExpanderProps) => {
  return (
    <div className={"mt-3"}>
      {remainingValues > 0 && !isGroupExpanded ? (
        <div className="flex flex-row justify-end items-center border-t-2 p-1.5">
          <MoreIcon
            key="show-more"
            size="1.5em"
            className={`text-${color}-content-darkest`}
            onClick={() => onShowChanged(!isGroupExpanded)}
          />
          <div
            className={`pl-1 text-${color}-content-darkest font-bold cursor-pointer`}
          >
            {" "}
            {remainingValues} more
          </div>
        </div>
      ) : isGroupExpanded ? (
        <div
          className={`flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5`}
        >
          <LessIcon
            key="show-less"
            size="1.5em"
            className={`text-${color}-content-darkest cursor-pointer`}
            onClick={() => onShowChanged(!isGroupExpanded)}
          />
          <div className={`"pl-1 text-${color}-content-darkest font-bold`}>
            {" "}
            show less
          </div>
        </div>
      ) : null}
    </div>
  );
};
