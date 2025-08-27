import React, { useMemo } from "react";
import { LoadingOverlay, Switch } from "@mantine/core";
import { Includes } from "@/cohort/QueryExpression/types";
import { FacetCardProps, ToggleFacetHooks } from "../types";
import { updateFacetEnum } from "../utils";
import FacetControlsHeader from "./FacetControlsHeader";

const extractToggleValue = (values?: ReadonlyArray<string | number>): boolean =>
  values !== undefined && values.length > 0 && values.includes("true");

/**
 * Facet card for boolean fields
 * @param field - field to facet on
 * @param hooks - hooks to use for the facet
 * @param description - description of the facet
 * @param valueLabel - label for the value
 * @param facetName - name of the facet
 * @param dismissCallback - callback to call when the facet is dismissed
 */

const ToggleFacet: React.FC<FacetCardProps<ToggleFacetHooks>> = ({
  field,
  hooks,
  description,
  valueLabel,
  facetName,
  dismissCallback = undefined,
}) => {
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const showFilters = isFilterExpanded === undefined || isFilterExpanded;

  const { data, isSuccess } = hooks.useGetEnumFacetData(field);
  const enumFilters = hooks.useGetFacetFilters(field);

  const toggleValue = useMemo(
    () =>
      extractToggleValue(
        enumFilters ? (enumFilters as Includes)?.operands : [],
      ),
    [enumFilters],
  );

  const setValue = (bValue: boolean) => {
    if (bValue)
      updateFacetEnum(field, ["true"], updateFacetFilters, clearFilters);
    else clearFilters(field);
  };

  return (
    <div className="flex flex-col mx-0 bg-base-max relative border-base-lighter border-1 rounded-b-md transition text-sm">
      <FacetControlsHeader
        field={field}
        description={description}
        hooks={hooks}
        facetName={facetName}
        dismissCallback={dismissCallback}
        showClearSelection={false}
      />
      <div
        className={showFilters ? "h-full" : "h-0 invisible"}
        aria-hidden={!showFilters}
      >
        <div className="flex items-center justify-end flex-wrap p-1 mb-1 border-b-2">
          <p className="px-2">{valueLabel}</p>
        </div>
        <div className="w-full ">
          <div className="flex flex-nowrap justify-between items-center p-2 ">
            <LoadingOverlay
              data-testid="loading-spinner"
              visible={!isSuccess}
            />
            <Switch
              label={
                data === undefined || Object.keys(data).length == 0
                  ? "No data for this field"
                  : data["1"].toLocaleString("en-US")
              }
              color="accent"
              checked={toggleValue}
              onChange={(event) => setValue(event.currentTarget.checked)}
              aria-label={facetName}
              data-testid="toggle-facet-value"
              classNames={{
                root: "w-full",
                body: "flex justify-between items-center",
                label: "text-sm font-content",
              }}
              wrapperProps={{ "data-testid": "toggle-area" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleFacet;
