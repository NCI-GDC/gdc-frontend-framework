import { Tooltip } from "@mantine/core";
import {
  convertFieldToName,
  DEFAULT_VISIBLE_ITEMS,
} from "@/features/facets/utils";
import { FacetCardProps } from "@/features/facets/types";
import React, { useEffect, useState } from "react";
import { FacetEnumHooks, UpdateEnums } from "@/features/facets/hooks";
import { useCoreDispatch } from "@gff/core";

type BooleanEnumFacetCardProps = Pick<
  FacetCardProps,
  "field" | "description" | "itemType" | "hideIfEmpty" | "facetName"
>;

const BooleanFacet: React.FC<BooleanEnumFacetCardProps> = ({
  field,
  description,
  facetName,
  itemType,
  hideIfEmpty = false,
}: BooleanEnumFacetCardProps) => {
  const [visibleItems, setVisibleItems] = useState(1);
  const { data, enumFilters, isSuccess } = FacetEnumHooks[itemType](field);
  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const coreDispatch = useCoreDispatch();
  const updateFilters = UpdateEnums[itemType];

  const total = visibleItems;

  useEffect(() => {
    setSelectedEnums(enumFilters);
  }, [enumFilters]);

  useEffect(() => {
    if (isSuccess) {
      setVisibleItems(
        Object.entries(data).filter(
          (data) => data[0] != "_missing" && data[0] != "",
        ).length,
      );
    }
  }, [data, isSuccess]);

  if (total == 0 && hideIfEmpty) {
    return null; // nothing to render if total == 0
  }

  return (
    <div className="flex flex-col w-64 bg-white relative shadow-lg border-nci-gray-lightest border-1 rounded-b-md text-xs transition ">
      <div>
        <div className="flex items-center justify-between flex-wrap bg-nci-blue-lightest shadow-md px-1.5">
          <Tooltip
            label={description}
            classNames={{
              arrow: "bg-nci-gray-light",
              body: "bg-white text-nci-gray-darkest",
            }}
            position="bottom"
            placement="start"
            wrapLines
            width={220}
            withArrow
            transition="fade"
            transitionDuration={200}
          >
            <div className="has-tooltip text-nci-gray-darkest font-heading font-semibold text-md">
              {facetName === null ? convertFieldToName(field) : facetName}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default BooleanFacet;
