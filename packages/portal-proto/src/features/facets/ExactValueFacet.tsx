import React, { useState, useCallback, useMemo } from "react";
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

const instanceOfIncludesExcludes = (op: Operation): op is Includes | Excludes =>
  ["includes", "excludes"].includes(op.operator);

/**
 * Extracts the operands if the operation is Includes or Excludes. Returns an empty Array
 * if filter is not the correct type.
 * @param operation - filters to extract values from
 */
const extractValues = (
  operation?: Operation,
): ReadonlyArray<string | number> => {
  if (operation && instanceOfIncludesExcludes(operation)) {
    return operation.operands;
  }
  return [] as ReadonlyArray<string>;
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

  const [textValue, setTextValue] = useState(undefined); // Handle the state of the TextInput

  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  const facetValue = getFacetValue(field);
  const textValues = useMemo(() => extractValues(facetValue), [facetValue]);

  const setValues = (values: ReadonlyArray<string | number>) => {
    if (values.length > 0) {
      if (facetValue && instanceOfIncludesExcludes(facetValue)) {
        // updating facet value
        setFacetValue(field, { ...facetValue, operands: values });
      }
      if (facetValue === undefined) {
        // TODO: Assuming Includes by default but this might change to Include|Excludes
        setFacetValue(field, {
          operator: "includes",
          field: field,
          operands: values,
        });
      }
    }
    // no values remove the filter
    else {
      clearFilterFunc(field);
    }
  };

  const addValue = (s: string | number) => {
    if (textValues.includes(s)) return;
    setTextValue("");
    setValues([...textValues, s]);
  };

  const removeButton = (x: string | number) => {
    return (
      <ActionIcon
        size="xs"
        color="white"
        radius="xl"
        variant="transparent"
        onClick={() => setValues(textValues.filter((i) => i !== x))}
      >
        <CloseIcon size={10} />
      </ActionIcon>
    );
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
        {textValues.map((x) => (
          <Badge
            size="sm"
            variant="filled"
            color="accent"
            key={x}
            rightSection={removeButton(x)}
          >
            {x}
          </Badge>
        ))}
      </Group>
    </div>
  );
};

export default ExactValueFacet;
