import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  FacetCardProps,
  SelectFacetValueFunction,
  UpdateFacetValueFunction,
} from "./types";
import { ActionIcon, Badge, Group, TextInput, Tooltip } from "@mantine/core";
import {
  controlsIconStyle,
  FacetIconButton,
} from "@/features/facets/components";
import { MdClose as CloseIcon } from "react-icons/md";
import { FaUndo as UndoIcon, FaPlus as PlusIcon } from "react-icons/fa";
import {
  Operation,
  Excludes,
  Includes,
  removeCohortFilter,
  useCoreDispatch,
  trimFirstFieldNameToTitle,
} from "@gff/core";

interface ExactValueProps
  extends Omit<FacetCardProps, "showSearch" | "showFlip" | "showPercent"> {
  getFacetValue: SelectFacetValueFunction;
  setFacetValue: UpdateFacetValueFunction;
}

const extractTextValues = (operation: Operation): ReadonlyArray<string> => {
  return [];
};

const ExactValueFacet: React.FC<ExactValueProps> = ({
  field,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
  getFacetValue,
  setFacetValue,
  clearFilterFunc = undefined,
}: ExactValueProps) => {
  const coreDispatch = useCoreDispatch();

  const clearFilters = useCallback(() => {
    clearFilterFunc
      ? clearFilterFunc(field)
      : coreDispatch(removeCohortFilter(field));
  }, [clearFilterFunc, coreDispatch, field]);

  const [textValue, setTextValue] = useState(undefined);
  const [values, setValues] = useState([]); // TODO Remove after attaching facet
  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  const facetValue = getFacetValue(field);
  const textValues = useMemo(() => extractTextValues(facetValue), [facetValue]);

  const addValue = (s: string) => {
    setTextValue("");
    setValues([...values, s]);
  };

  // const setDateRangeValue = (d: [Date | null, Date | null]) => {
  //   const data: StringRange = {
  //     from: convertDateToString(d[0]),
  //     to: convertDateToString(d[1]),
  //     fromOp: ">=",
  //     toOp: "<=",
  //   };
  //   const rangeFilters = buildRangeOperator(field, data);
  //   if (rangeFilters !== undefined) setFacetValue(field, rangeFilters);
  //   // clear filters as range is empty
  //   else coreDispatch(removeCohortFilter(field));
  // };

  const removeButton = (
    <ActionIcon size="xs" color="white" radius="xl" variant="transparent">
      <CloseIcon size={10} />
    </ActionIcon>
  );

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
                clearFilters();
                dismissCallback(field);
              }}
              aria-label="Remove the facet"
            >
              <CloseIcon size="1.25em" className={controlsIconStyle} />
            </FacetIconButton>
          ) : null}
        </div>
      </div>
      <div className="flex flex row flex-nowrap items-center p-2 ">
        <TextInput
          size="xs"
          placeholder={`Enter ${facetTitle}`}
          classNames={{ input: "border-r-0 rounded-r-none py-1" }}
          aria-label="Enter value"
          value={textValue}
          onChange={(event) => setTextValue(event.currentTarget.value)}
        ></TextInput>
        <ActionIcon
          size="md"
          aria-label="add string value"
          className="bg-accent text-accent-contrast border-base-min border-1 rounded-l-none"
          onClick={() => addValue(textValue)}
        >
          <PlusIcon />
        </ActionIcon>
      </div>
      <Group spacing="xs" className="px-2 py-1">
        {values.map((x) => (
          <Badge
            size="sm"
            variant="filled"
            color="accent"
            key={x}
            rightSection={removeButton}
          >
            {x}
          </Badge>
        ))}
      </Group>
    </div>
  );
};

export default ExactValueFacet;
