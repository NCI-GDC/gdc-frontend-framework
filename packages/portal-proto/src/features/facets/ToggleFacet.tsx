import React, { useMemo } from "react";
import { EnumFacetHooks, FacetCardProps } from "./types";
import { updateFacetEnum } from "./utils";

import {
  controlsIconStyle,
  FacetIconButton,
} from "@/features/facets/components";

import { trimFirstFieldNameToTitle } from "@gff/core";
import { LoadingOverlay, Switch, Tooltip } from "@mantine/core";
import { MdClose as CloseIcon } from "react-icons/md";
import { FacetDocTypeToLabelsMap } from "@/features/facets/hooks";
import { FaUndo as UndoIcon } from "react-icons/fa";

const extractToggleValue = (values?: ReadonlyArray<string>): boolean =>
  values && values.length > 0 && values.includes("true");

const ToggleFacet: React.FC<FacetCardProps<EnumFacetHooks>> = ({
  field,
  docType,
  indexType,
  hooks,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
}: FacetCardProps<EnumFacetHooks>) => {
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();

  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);

  const { data, isSuccess, enumFilters } = hooks.useGetFacetData(
    field,
    docType,
    indexType,
  );

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
          <FacetIconButton onClick={clearFilters} aria-label="clear selection">
            <UndoIcon size="1.15em" className={controlsIconStyle} />
          </FacetIconButton>
          {dismissCallback ? (
            <FacetIconButton
              onClick={() => {
                clearFilters(field);
                dismissCallback(field);
              }}
              aria-label="remove the facet"
            >
              <CloseIcon size="1.25em" className={controlsIconStyle} />
            </FacetIconButton>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row items-center justify-end flex-wrap p-1 mb-1 border-b-2">
        <p className="px-2">{FacetDocTypeToLabelsMap[docType]}</p>
      </div>
      <div className="w-full ">
        <div className="flex flex row flex-nowrap justify-between items-center p-2 ">
          <LoadingOverlay visible={!isSuccess} />
          <Switch
            color="accent"
            checked={toggleValue}
            onChange={(event) => setValue(event.currentTarget.checked)}
            aria-label="toggle facet value"
          />
          <p>
            {data === undefined || Object.keys(data).length == 0
              ? "No data for this field"
              : data["1"].toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToggleFacet;
