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
    <div className="mt-3 flex flex-row justify-end  border-t-2 p-1.5">
      {remainingValues > 0 && !isGroupExpanded ? (
        <button onClick={() => onShowChanged(!isGroupExpanded)}>
          <div className="flex flex-row flex-nowrap items-center ">
            <ActionIcon size="sm" color="accent">
              <MoreIcon key="show-more" size="1.5em" data-testid="plus-icon" />
            </ActionIcon>
            <ExpanderLabel>{remainingValues} more</ExpanderLabel>
          </div>
        </button>
      ) : isGroupExpanded ? (
        <button onClick={() => onShowChanged(!isGroupExpanded)}>
          <div className="flex flex-row flex-nowrap items-center ">
            <ActionIcon size="sm" color="accent">
              <LessIcon
                key="show-less"
                size="1.5em"
                data-testid="minus-icon"
                onClick={() => onShowChanged(!isGroupExpanded)}
              />
            </ActionIcon>
            <ExpanderLabel>show less</ExpanderLabel>
          </div>
        </button>
      ) : null}
    </div>
  );
};

export default FacetExpander;
