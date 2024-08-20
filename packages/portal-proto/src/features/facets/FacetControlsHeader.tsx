import React, { useEffect } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import {
  MdFlip as FlipIcon,
  MdSearch as SearchIcon,
  MdClose as CloseIcon,
  MdExpandLess as ExpandLessIcon,
  MdExpandMore as ExpandMoreIcon,
} from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { fieldNameToTitle } from "@gff/core";
import {
  FacetIconButton,
  controlsIconStyle,
  FacetText,
  FacetHeader as HeaderComponent,
} from "./components";
import { FacetCardProps, FacetRequiredHooks } from "./types";

type FacetHeaderProps = Pick<
  FacetCardProps<FacetRequiredHooks>,
  | "field"
  | "description"
  | "hooks"
  | "facetName"
  | "showSearch"
  | "showFlip"
  | "dismissCallback"
> & {
  header?: any;
  isFacetView?: boolean;
  toggleFlip?: () => void;
  toggleSearch?: () => void;
};

const FacetControlsHeader = ({
  field,
  description,
  hooks,
  facetName = null,
  showSearch = false,
  showFlip = false,
  isFacetView = false,
  toggleFlip = undefined,
  toggleSearch = undefined,
  dismissCallback = undefined,
  header = {
    Panel: HeaderComponent,
    Label: FacetText,
    iconStyle: controlsIconStyle,
  },
}: FacetHeaderProps) => {
  const clearFilters = hooks.useClearFilter();
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const toggleExpandFilter =
    hooks?.useToggleExpandFilter && hooks.useToggleExpandFilter();

  useEffect(() => {
    // Initialize filter as expanded
    if (isFilterExpanded === undefined && toggleExpandFilter) {
      toggleExpandFilter(field, true);
    }
  }, [field, isFilterExpanded, toggleExpandFilter]);

  return (
    <header.Panel>
      <div className="flex flex-row">
        {toggleExpandFilter && (
          <ActionIcon
            variant="subtle"
            onClick={() => toggleExpandFilter(field, !isFilterExpanded)}
            className="mt-0.5"
          >
            {isFilterExpanded ? (
              <ExpandLessIcon size="3em" color="white" />
            ) : (
              <ExpandMoreIcon size="3em" color="white" />
            )}
          </ActionIcon>
        )}
        <Tooltip
          label={description}
          position="bottom-start"
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
          disabled={!description}
        >
          <header.Label>
            {facetName ? facetName : fieldNameToTitle(field)}
          </header.Label>
        </Tooltip>
      </div>
      <div className="flex flex-row">
        {showSearch ? (
          <Tooltip label="Search values">
            <FacetIconButton onClick={toggleSearch} aria-label="Search">
              <SearchIcon
                size="1.45em"
                className={header.iconStyle}
                aria-hidden="true"
              />
            </FacetIconButton>
          </Tooltip>
        ) : null}
        {showFlip ? (
          <Tooltip label={isFacetView ? "Chart view" : "Selection view"}>
            <FacetIconButton
              onClick={toggleFlip}
              aria-pressed={!isFacetView}
              aria-label={isFacetView ? "Chart view" : "Selection view"}
            >
              <FlipIcon
                size="1.45em"
                className={header.iconStyle}
                aria-hidden="true"
              />
            </FacetIconButton>
          </Tooltip>
        ) : null}
        <Tooltip label="Clear selection">
          <FacetIconButton
            onClick={() => clearFilters(field)}
            aria-label="clear selection"
          >
            <UndoIcon
              size="1.25em"
              className={header.iconStyle}
              aria-hidden="true"
            />
          </FacetIconButton>
        </Tooltip>
        {dismissCallback ? (
          <Tooltip label="Remove the facet">
            <FacetIconButton
              onClick={() => {
                dismissCallback(field);
              }}
              aria-label="Remove the facet"
            >
              <CloseIcon
                size="1.25em"
                className={header.iconStyle}
                aria-hidden="true"
              />
            </FacetIconButton>
          </Tooltip>
        ) : null}
      </div>
    </header.Panel>
  );
};

export default FacetControlsHeader;
