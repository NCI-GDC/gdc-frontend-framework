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
  FacetHeader,
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
  | "isFacetView"
  | "header"
> & {
  showClearSelection?: boolean;
  toggleFlip?: () => void;
  toggleSearch?: () => void;
};

/**
 * Component for the common controls on the header of different type facet cards
 * @param field - filter this FacetCard manages
 * @param description - describes information about the facet
 * @param hooks - object defining the hooks required by this facet component
 * @param facetName - name of the Facet in human-readable form
 * @param showSearch - if the search icon show be displayed
 * @param showFlip - if the flip icon should be displayed
 * @param showClearSelection - if the clear selection icon should be displayed
 * @param isFacetView - if the facet selection view (and not the chart view) is displayed
 * @param toggleFlip - function to switch the facet/chart view
 * @param toggleSearch - function to switch if the search bart is displayed
 * @param dismissCallback - if facet can be removed, supply a function which will ensure the "dismiss" control will be visible
 * @param header - object containing the display components to use for the header
 */
const FacetControlsHeader = ({
  field,
  description,
  hooks,
  facetName = null,
  showSearch = false,
  showFlip = false,
  showClearSelection = true,
  isFacetView = false,
  toggleFlip = undefined,
  toggleSearch = undefined,
  dismissCallback = undefined,
  header = {
    Panel: FacetHeader,
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
          <Tooltip label={isFilterExpanded ? "Collapse card" : "Expand card"}>
            <ActionIcon
              variant="subtle"
              onClick={() => toggleExpandFilter(field, !isFilterExpanded)}
              className="mt-0.5"
              aria-expanded={isFilterExpanded}
              aria-label={isFilterExpanded ? "Collapse card" : "Expand card"}
            >
              {isFilterExpanded ? (
                <ExpandLessIcon size="3em" color="white" aria-hidden="true" />
              ) : (
                <ExpandMoreIcon size="3em" color="white" aria-hidden="true" />
              )}
            </ActionIcon>
          </Tooltip>
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
            <FacetIconButton
              onClick={() => {
                toggleExpandFilter && toggleExpandFilter(field, true);
                toggleSearch();
              }}
              aria-label="Search"
            >
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
              onClick={() => {
                toggleExpandFilter && toggleExpandFilter(field, true);
                toggleFlip();
              }}
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
        {showClearSelection && (
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
        )}
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
