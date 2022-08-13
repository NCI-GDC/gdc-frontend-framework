import React from "react";
import {
  MdAddCircle as MoreIcon,
  MdRemoveCircle as LessIcon,
} from "react-icons/md";
import { ActionIcon } from "@mantine/core";
import tw from "tailwind-styled-components";

export const ExpanderLabel = tw.div`
text-accent-content-darker
p-1
font-bold 
cursor-pointer
`;

interface FacetExpanderProps {
  readonly remainingValues: number;
  readonly isGroupExpanded: boolean;
  readonly onShowChanged: (v: boolean) => void;
}

/**
 * Component which manages the compact/expanded state of a FacetCard
 * @param remainingValues - number of remaining values when compact "show 4"
 * @param isGroupExpanded - true if expanded, false if compact
 * @param onShowChanged - callback to call when the expand/compact button is clicked
 * @constructor
 */
const FacetExpander: React.FC<FacetExpanderProps> = ({
  remainingValues,
  isGroupExpanded,
  onShowChanged,
}: FacetExpanderProps) => {
  return (
    <div className={"mt-3"}>
      {remainingValues > 0 && !isGroupExpanded ? (
        <div className="flex flex-row justify-end items-center border-t-2 p-1.5">
          <ActionIcon size="sm" color="accent">
            <MoreIcon
              key="show-more"
              size="1.5em"
              onClick={() => onShowChanged(!isGroupExpanded)}
            />
          </ActionIcon>
          <ExpanderLabel>{remainingValues} more</ExpanderLabel>
        </div>
      ) : isGroupExpanded ? (
        <div
          className={`flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5`}
        >
          <ActionIcon size="sm" color="accent">
            <LessIcon
              key="show-less"
              size="1.5em"
              onClick={() => onShowChanged(!isGroupExpanded)}
            />
          </ActionIcon>
          <ExpanderLabel>show less</ExpanderLabel>
        </div>
      ) : null}
    </div>
  );
};

export default FacetExpander;
