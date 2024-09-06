import React, { useEffect, useState } from "react";
import { MdClose as CloseIcon, MdFlip as FlipIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { Tooltip } from "@mantine/core";
import { fieldNameToTitle } from "@gff/core";
import { NumericFacetProps } from "./types";
import {
  controlsIconStyle,
  FacetHeader,
  FacetIconButton,
  FacetText,
} from "../components";
import DaysOrYears from "./DaysOrYears";
import Year from "./Year";
import Years from "./Years";
import PercentRange from "./PercentRange";
import NumericRangePanel from "./NumericRangePanel";

/**
 * A component which manages a numeric range facet
 * @param field - field for this facet
 * @param hooks - hooks to manage facet
 * @param rangeDatatype - the datatype of the range
 * @param description - description of the facet
 * @param valueLabel  - string representing the datatype of values (e.g. "Cases")
 * @param minimum - minimum value for the range
 * @param maximum - maximum value for the range
 * @param facetName - name of the facet
 * @param dismissCallback  - function to call when facet is dismissed
 * @param width - width of the facet
 * @category Facets
 */

const NumericRangeFacet: React.FC<NumericFacetProps> = ({
  field,
  hooks,
  rangeDatatype,
  description,
  valueLabel,
  minimum = undefined,
  maximum = undefined,
  facetName = null,
  dismissCallback = undefined,
  width = undefined,
}: NumericFacetProps) => {
  const clearFilters = hooks.useClearFilter();
  const [isFacetView, setIsFacetView] = useState(true);

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  const [clearValues, setClearValues] = useState(false);

  useEffect(() => {
    if (clearValues) {
      setClearValues(false);
    }
  }, [clearValues]);
  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
      } bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition`}
      id={field}
    >
      <FacetHeader>
        <Tooltip
          disabled={!description}
          label={description}
          position="bottom-start"
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
        >
          <FacetText>
            {facetName ? facetName : fieldNameToTitle(field)}
          </FacetText>
        </Tooltip>
        <div className="flex flex-row">
          {rangeDatatype !== "range" && (
            <Tooltip label={isFacetView ? "Chart view" : "Selection view"}>
              <FacetIconButton
                onClick={toggleFlip}
                aria-pressed={!isFacetView}
                aria-label={isFacetView ? "Chart view" : "Selection view"}
              >
                <FlipIcon size="1.45em" className={controlsIconStyle} />
              </FacetIconButton>
            </Tooltip>
          )}
          <Tooltip label="Clear selection">
            <FacetIconButton
              onClick={() => {
                clearFilters(field);
                setClearValues(true);
              }}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" />
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
                <CloseIcon size="1.25em" />
              </FacetIconButton>
            </Tooltip>
          ) : null}
        </div>
      </FacetHeader>
      {
        {
          age: (
            <DaysOrYears
              valueLabel={valueLabel}
              field={field}
              rangeDatatype={rangeDatatype}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          age_in_years: (
            <Years
              valueLabel={valueLabel}
              field={field}
              rangeDatatype={rangeDatatype}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          year: (
            <Year
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          years: (
            <Years
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          days: (
            <DaysOrYears
              valueLabel={valueLabel}
              field={field}
              rangeDatatype={rangeDatatype}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          percent: (
            <PercentRange
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          range: (
            <NumericRangePanel
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
        }[rangeDatatype as string]
      }
    </div>
  );
};

export default NumericRangeFacet;
