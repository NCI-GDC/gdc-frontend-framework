import React, { useEffect, useState } from "react";
import DaysOrYears from "./DaysOrYears";
import Year from "./Year";
import Years from "./Years";
import PercentRange from "./PercentRange";
import NumericRangePanel from "./NumericRangePanel";
import FacetControlsHeader from "../FacetControlsHeader";
import { NumericFacetCardProps } from "src/facets/types";

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
 * @param queryOptions - info to pass back to data fetching hooks about this facet
 * @param Chart - Component for rendering a Chart view of the data
 */

const NumericRangeFacet: React.FC<NumericFacetCardProps> = ({
  field,
  hooks,
  rangeDatatype,
  description,
  valueLabel,
  minimum = undefined,
  maximum = undefined,
  facetName,
  dismissCallback = undefined,
  cardScrollMargin,
  queryOptions,
  Chart,
}) => {
  const [isFacetView, setIsFacetView] = useState(true);
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const showFilters = isFilterExpanded === undefined || isFilterExpanded;
  const hash = window?.location?.hash.split("#")?.[1];
  const cardSelected = hash !== undefined && hash === field;

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
      className={`flex flex-col mx-0 bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition  ${
        cardSelected ? "animate-border-highlight " : ""
      }`}
      id={field}
      style={{
        scrollMarginTop: cardScrollMargin,
      }}
    >
      <FacetControlsHeader
        field={field}
        description={description}
        hooks={hooks}
        facetName={facetName as string}
        dismissCallback={dismissCallback}
        isFacetView={isFacetView}
        toggleFlip={toggleFlip}
        showFlip={rangeDatatype !== "range" && Chart !== undefined}
      />
      <div
        className={showFilters ? "h-full" : "h-0 invisible"}
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
                queryOptions={queryOptions}
                Chart={Chart}
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
                queryOptions={queryOptions}
                Chart={Chart}
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
                queryOptions={queryOptions}
                Chart={Chart}
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
                queryOptions={queryOptions}
                Chart={Chart}
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
                queryOptions={queryOptions}
                Chart={Chart}
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
                queryOptions={queryOptions}
                Chart={Chart}
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
                queryOptions={queryOptions}
              />
            ),
          }[rangeDatatype as string]
        }
      </div>
    </div>
  );
};

export default NumericRangeFacet;
