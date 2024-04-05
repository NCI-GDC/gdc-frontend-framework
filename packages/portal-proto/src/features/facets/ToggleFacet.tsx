import React, { useMemo } from "react";
import { EnumFacetHooks, FacetCardProps } from "./types";
import { updateFacetEnum } from "./utils";

import {
  controlsIconStyle,
  FacetIconButton,
  FacetText,
  FacetHeader,
} from "@/features/facets/components";

import { trimFirstFieldNameToTitle } from "@gff/core";
import { LoadingOverlay, Switch, Tooltip } from "@mantine/core";
import { MdClose as CloseIcon } from "react-icons/md";

const extractToggleValue = (values?: ReadonlyArray<string>): boolean =>
  values !== undefined && values.length > 0 && values.includes("true");

/**
 * Facet card for a boolean field
 * @param field - field to facet on
 * @param hooks - hooks to use for the facet
 * @param description - description of the facet
 * @param valueLabel - label for the value
 * @param facetName - name of the facet
 * @param dismissCallback - callback to call when the facet is dismissed
 * @param width - width of the facet
 * @category Facets
 */

const ToggleFacet: React.FC<FacetCardProps<EnumFacetHooks>> = ({
  field,
  hooks,
  description,
  valueLabel,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
}: FacetCardProps<EnumFacetHooks>) => {
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();

  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);

  const { data, isSuccess, enumFilters } = hooks.useGetFacetData(field);

  const toggleValue = useMemo(
    () => extractToggleValue(enumFilters),
    [enumFilters],
  );

  const setValue = (bValue: boolean) => {
    if (bValue)
      updateFacetEnum(field, ["true"], updateFacetFilters, clearFilters);
    else clearFilters(field);
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
      } bg-base-max relative shadow-lg border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <Tooltip
          disabled={!description}
          label={description}
          position="bottom-start"
          multiline
          width={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
        >
          <FacetText>{facetTitle}</FacetText>
        </Tooltip>
        <div className="flex flex-row">
          {dismissCallback && (
            <Tooltip label="Remove the facet">
              <FacetIconButton
                onClick={() => {
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon size="1.25em" className={controlsIconStyle} />
              </FacetIconButton>
            </Tooltip>
          )}
        </div>
      </FacetHeader>
      <div className="flex flex-row items-center justify-end flex-wrap p-1 mb-1 border-b-2">
        <p className="px-2">{valueLabel}</p>
      </div>
      <div className="w-full ">
        <div className="flex flex-nowrap justify-between items-center p-2 ">
          <LoadingOverlay data-testid="loading-spinner" visible={!isSuccess} />
          <Switch
            label={
              data === undefined || Object.keys(data).length == 0
                ? "No data for this field"
                : data["1"].toLocaleString("en-US")
            }
            color="accent"
            checked={toggleValue}
            onChange={(event) => setValue(event.currentTarget.checked)}
            aria-label={facetTitle}
            data-testid="toggle-facet-value"
            classNames={{
              root: "w-full",
              body: "flex justify-between items-center",
              label: "text-xs font-content",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToggleFacet;
