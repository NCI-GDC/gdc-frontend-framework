import React, { useEffect, useState } from "react";
import { NumericFacetProps } from "./types";
import DaysOrYears from "./DaysOrYears";
import Year from "./Year";
import Years from "./Years";
import PercentRange from "./PercentRange";
import NumericRangePanel from "./NumericRangePanel";
import FacetControlsHeader from "../FacetControlsHeader";

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
  const [isFacetView, setIsFacetView] = useState(true);
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const showFilters = isFilterExpanded === undefined || isFilterExpanded;

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
      } bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition h-fit`}
      id={field}
    >
      <FacetControlsHeader
        field={field}
        description={description}
        hooks={hooks}
        facetName={facetName}
        dismissCallback={dismissCallback}
        isFacetView={isFacetView}
        toggleFlip={toggleFlip}
        showFlip={rangeDatatype !== "range"}
      />
      <div
        className={showFilters ? "h-fit" : "h-0 invisible"}
        aria-hidden={!showFilters}
      >
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
    </div>
  );
};

export default NumericRangeFacet;
