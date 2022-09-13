import React, { useCallback, useMemo } from "react";
import {
  FacetCardProps,
  GetFacetEnumDataFunction,
  UpdateFacetFilterFunction,
} from "./types";

import {
  controlsIconStyle,
  FacetIconButton,
} from "@/features/facets/components";

import { trimFirstFieldNameToTitle } from "@gff/core";
import { LoadingOverlay, Switch, Tooltip } from "@mantine/core";
import { MdClose as CloseIcon } from "react-icons/md";

interface ToggleFacetProps
  extends Omit<FacetCardProps, "showSearch" | "showFlip" | "showPercent"> {
  getFacetValues: GetFacetEnumDataFunction;
  setFacetFilter: UpdateFacetFilterFunction;
}

const extractToggleValue = (values?: ReadonlyArray<string>): boolean =>
  values && values.length > 0 && values.includes("1");

const ToggleFacet: React.FC<ToggleFacetProps> = ({
  field,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
  getFacetValues,
  setFacetFilter,
  clearFilterFunc = undefined,
}: ToggleFacetProps) => {
  const clearFilters = useCallback(() => {
    clearFilterFunc(field);
  }, [clearFilterFunc, field]);

  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  const { data, isSuccess, enumFilters } = getFacetValues(field);
  const toggleValue = useMemo(
    () => extractToggleValue(enumFilters),
    [enumFilters],
  );

  const setValue = (bValue: boolean) => {
    if (bValue)
      setFacetFilter(field, {
        operator: "includes",
        field: field,
        operands: ["true"],
      });
    else clearFilterFunc(field);
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-1"
      } bg-base-max relative border-primary-lightest border-1 rounded-b-md text-xs transition`}
    >
      <div className="flex items-center justify-between flex-wrap bg-primary-lighter shadow-md px-1.5">
        <Tooltip
          label={description || "No description available"}
          classNames={{
            arrow: "bg-base-light",
            tooltip: "bg-base-max text-base-contrast-max",
          }}
          position="bottom-start"
          multiline
          width={220}
          withArrow
          transition="fade"
          transitionDuration={200}
        >
          <div className="text-primary-contrast-lighter font-heading font-semibold text-md">
            {facetTitle}
          </div>
        </Tooltip>
        <div className="flex flex-row">
          {dismissCallback ? (
            <FacetIconButton
              onClick={() => {
                clearFilters();
                dismissCallback(field);
              }}
              aria-label="Remove the facet"
            >
              <CloseIcon size="1.25em" className={controlsIconStyle} />
            </FacetIconButton>
          ) : null}
        </div>
        <div className="w-full ">
          <LoadingOverlay visible={!isSuccess} />
          {Object.keys(data).length == 0 ? (
            "No data for this field"
          ) : (
            <div className="flex flex row flex-nowrap items-center p-2 ">
              <Switch
                checked={toggleValue}
                onChange={(event) => setValue(event.currentTarget.checked)}
              />
              {Object["1"]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToggleFacet;
