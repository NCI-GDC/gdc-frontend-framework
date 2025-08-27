import React, { useEffect } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import {
  CloseIcon,
  ExpandLessIcon,
  ExpandMoreIcon,
  FlipIcon,
  SearchIcon,
  UndoIcon,
} from "src/commonIcons";
import { FacetCardProps, FacetRequiredHooks } from "../types";
import { facetIconButtonStyles } from "../styles";

type FacetHeaderProps = Pick<
  FacetCardProps<FacetRequiredHooks>,
  "field" | "description" | "hooks" | "facetName" | "dismissCallback"
> & {
  readonly showClearSelection?: boolean;
  readonly toggleFlip?: () => void;
  readonly toggleSearch?: () => void;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly isFacetView?: boolean;
  readonly variant?: "default" | "summary";
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
  variant = "default",
  facetName,
  showSearch = false,
  showFlip = false,
  showClearSelection = true,
  isFacetView = false,
  toggleFlip = undefined,
  toggleSearch = undefined,
  dismissCallback = undefined,
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

  const iconStyle =
    variant === "default"
      ? "text-primary-contrast-darker hover:text-primary-lighter"
      : "text-primary-darkest hover:text-primary-lighter";

  return (
    <div
      className={
        variant === "default"
          ? "flex justify-between flex-nowrap bg-primary-darker px-2 shrink-0"
          : "flex items-start justify-between flex-nowrap px-1.5 border-base- border-b-1"
      }
    >
      <div className="flex flex-row items-center">
        {toggleExpandFilter && (
          <Tooltip label={isFilterExpanded ? "Collapse card" : "Expand card"}>
            <ActionIcon
              variant="subtle"
              onClick={() => toggleExpandFilter(field, !isFilterExpanded)}
              className="mt-0.5 -ml-1.5"
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
          <div
            className={
              variant === "default"
                ? "text-primary-contrast-darker font-heading font-semibold text-sm xl:text-[1rem] break-words py-2"
                : "text-primary-darkest font-heading font-semibold text-[1.25em] break-words py-2"
            }
          >
            {facetName}
          </div>
        </Tooltip>
      </div>
      <div className="flex flex-row">
        {showSearch ? (
          <Tooltip label="Search values">
            <button
              className={facetIconButtonStyles}
              onClick={() => {
                toggleExpandFilter && toggleExpandFilter(field, true);
                toggleSearch && toggleSearch();
              }}
              aria-label="Search"
            >
              <SearchIcon
                size="1.45em"
                className={iconStyle}
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        ) : null}
        {showFlip ? (
          <Tooltip label={isFacetView ? "Chart view" : "Selection view"}>
            <button
              className={facetIconButtonStyles}
              onClick={() => {
                toggleExpandFilter && toggleExpandFilter(field, true);
                toggleFlip && toggleFlip();
              }}
              aria-pressed={!isFacetView}
              aria-label={isFacetView ? "Chart view" : "Selection view"}
            >
              <FlipIcon
                size="1.45em"
                className={iconStyle}
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        ) : null}
        {showClearSelection && (
          <Tooltip label="Clear selection">
            <button
              className={facetIconButtonStyles}
              onClick={() => clearFilters(field)}
              aria-label="clear selection"
            >
              <UndoIcon
                size="1.25em"
                className={iconStyle}
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        )}
        {dismissCallback ? (
          <Tooltip label="Remove the facet">
            <button
              className={facetIconButtonStyles}
              onClick={() => {
                dismissCallback(field);
              }}
              aria-label="Remove the facet"
            >
              <CloseIcon
                size="1.25em"
                className={iconStyle}
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
};

export default FacetControlsHeader;
