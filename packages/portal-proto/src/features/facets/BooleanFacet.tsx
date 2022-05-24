import { LoadingOverlay, Tooltip } from "@mantine/core";
import { convertFieldToName } from "@/features/facets/utils";
import { FacetCardProps } from "@/features/facets/types";
import React, { useEffect, useState } from "react";
import {
  FacetEnumHooks,
  FacetItemTypeToCountsIndexMap,
  UpdateEnums,
} from "@/features/facets/hooks";
import {
  selectTotalCountsByName,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

type BooleanEnumFacetCardProps = Pick<
  FacetCardProps,
  | "field"
  | "description"
  | "itemType"
  | "hideIfEmpty"
  | "facetName"
  | "showPercent"
>;

const BooleanFacet: React.FC<BooleanEnumFacetCardProps> = ({
  field,
  description,
  facetName,
  itemType,
  showPercent = true,
  hideIfEmpty = false,
}: BooleanEnumFacetCardProps) => {
  const [visibleItems, setVisibleItems] = useState(1);
  const { data, enumFilters, isSuccess } = FacetEnumHooks[itemType](field);
  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const coreDispatch = useCoreDispatch();
  const updateFilters = UpdateEnums[itemType];

  const totalCount = useCoreSelector((state) =>
    selectTotalCountsByName(state, FacetItemTypeToCountsIndexMap[itemType]),
  );

  console.log(
    "total count: ",
    data,
    totalCount,
    FacetItemTypeToCountsIndexMap[itemType],
  );

  const total = visibleItems;

  // useEffect(() => {
  //   if (isSuccess)
  //    setSelectedEnums(enumFilters);
  // }, [enumFilters]);

  // useEffect(() => {
  //   console.log("setVisibleItems");
  //   if (isSuccess) {
  //     setVisibleItems(
  //       Object.entries(data).length
  //     );
  //   }
  // }, [data, isSuccess]);

  useEffect(() => {
    console.log("updateFilters");
    updateFilters(coreDispatch, selectedEnums, field);
  }, [updateFilters, coreDispatch, selectedEnums, field, itemType]);

  if (total == 0 && hideIfEmpty) {
    return null; // nothing to render if total == 0
  }

  const handleChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      const updated = ["true"];
      console.log("setSelectedEnums: ", field, updated);
      updateFilters(coreDispatch, selectedEnums, field);
    } else {
      console.log("setSelectedEnums: ", field);
      updateFilters(coreDispatch, [], field);
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white relative shadow-lg border-nci-gray-lightest border-1 rounded-b-md text-xs transition ">
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
      <div className="flex flow-row items-center justify-between flex-wrap bg-nci-blue-lightest shadow-md px-1.5">
        <LoadingOverlay visible={!isSuccess} />
        {total == 0 ? (
          <div className="mx-4">No data for this field</div>
        ) : isSuccess ? (
          Object.entries(data).map(([value, count], i) => {
            return (
              <div
                key={`${field}-${value}`}
                className="flex flex-row gap-x-1 px-2 "
              >
                <input
                  type="checkbox"
                  value={value}
                  onChange={handleChange}
                  aria-label={`checkbox for ${field}`}
                  className="bg-nci-gray-lightest hover:bg-nci-gray-darkest text-nci-gray-darkest"
                  checked={selectedEnums?.includes(value)}
                />

                <div className="flex-grow truncate ... font-heading text-md pt-0.5">
                  {value}
                </div>
                <div className="flex-none text-right w-14 ">
                  {count.toLocaleString()}
                </div>
                {showPercent ? (
                  <div className="flex-none text-right w-18 ">
                    (
                    {(((count as number) / totalCount) * 100)
                      .toFixed(2)
                      .toLocaleString()}
                    %)
                  </div>
                ) : null}
              </div>
            );
          })
        ) : null}
      </div>
    </div>
  );
};

export default BooleanFacet;
