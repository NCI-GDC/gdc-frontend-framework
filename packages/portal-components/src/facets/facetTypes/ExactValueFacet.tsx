import React, { useState, useMemo } from "react";
import { ActionIcon, Badge, Group, TextInput } from "@mantine/core";
import { CloseIcon, PlusIcon, WarningMessageIcon } from "src/commonIcons";
import { FacetCardProps, ValueFacetHooks } from "../types";
import FacetControlsHeader from "./FacetControlsHeader";
import {
  Operation,
  Includes,
  Excludes,
  EnumOperandValue,
} from "@/cohort/QueryExpression/types";

type ExactValueProps = Omit<
  FacetCardProps<ValueFacetHooks>,
  "showSearch" | "showFlip" | "showPercent" | "valueLabel"
>;

const instanceOfIncludesExcludes = (op: Operation): op is Includes | Excludes =>
  ["includes", "excludes"].includes(op.operator);

/**
 * Extracts the operands if the operation isIncludes or Excludes. Returns an empty Array
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

/**
 * Facet component for exact value fields
 * @param field - field to facet on
 * @param description - description of the facet
 * @param facetName - name of the facet
 * @param dismissCallback - callback function to dismiss the facet
 * @param hooks - hooks to use for the facet
 */
const ExactValueFacet: React.FC<ExactValueProps> = ({
  field,
  description,
  facetName,
  dismissCallback = undefined,
  hooks,
}: ExactValueProps) => {
  const [textValue, setTextValue] = useState(""); // Handle the state of the TextInput
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const facetValue = hooks.useGetFacetFilters(field);
  const textValues = useMemo(() => extractValues(facetValue), [facetValue]);
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const showFilters = isFilterExpanded === undefined || isFilterExpanded;
  const [inputError, setInputError] = useState(false);

  const setValues = (values: EnumOperandValue) => {
    if (values.length > 0) {
      if (facetValue && instanceOfIncludesExcludes(facetValue)) {
        // updating facet value
        updateFacetFilters(field, {
          ...facetValue,
          operands: values,
        });
      }
      if (facetValue === undefined) {
        // TODO: Assuming Includes by default but this might change to Include|Excludes
        updateFacetFilters(field, {
          operator: "includes",
          field: field,
          operands: values,
        });
      }
    }
    // no values remove the filter
    else {
      clearFilters(field);
    }
  };

  const addValue = (s: string | number) => {
    if (s === "") return;
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
        onClick={() => {
          const updatedValues = textValues.filter((i) => i !== x);
          setValues(updatedValues);
          if (updatedValues.includes(textValue)) {
            setInputError(true);
          } else {
            setInputError(false);
          }
        }}
      >
        <CloseIcon size={10} aria-label="remove value from filter" />
      </ActionIcon>
    );
  };

  return (
    <div
      className={`flex flex-col mx-0 bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetControlsHeader
        field={field}
        description={description}
        hooks={hooks}
        facetName={facetName}
        dismissCallback={dismissCallback}
      />
      <div
        className={showFilters ? "h-full" : "h-0 invisible"}
        aria-hidden={!showFilters}
      >
        <div className="p-2">
          <TextInput
            data-testid="textbox-add-filter-value"
            size="sm"
            placeholder={`Enter ${facetName}`}
            classNames={{
              root: "grow",
              input: "border-r-0 py-1",
            }}
            aria-label="enter value to add filter"
            value={textValue}
            onChange={(event) => {
              setTextValue(event.currentTarget.value);
              setInputError(false);
            }}
            error={
              inputError ? (
                <div className="text-utility-error flex gap-2 font-content-noto">
                  <div>
                    <WarningMessageIcon size="1rem" />
                  </div>
                  <span>Please enter a unique value.</span>
                </div>
              ) : undefined
            }
            rightSection={
              <ActionIcon
                size="lg"
                aria-label="add string value"
                className="bg-accent text-accent-contrast border-base-min border-1 rounded-l-none h-[30px]"
                onClick={() => {
                  if (textValues.includes(textValue)) {
                    setInputError(true);
                  } else if (textValue.length > 0) {
                    addValue(textValue.trim());
                  }
                }}
              >
                <PlusIcon />
              </ActionIcon>
            }
          />
        </div>
        {/* h-96 is max height for the content of ExactValueFacet, EnumFacet, UploadFacet */}
        <Group
          gap="xs"
          className="px-2 py-2 max-h-96 overflow-y-auto"
          data-testid="values group"
        >
          {textValues.map((x) => (
            <Badge
              size="sm"
              variant="filled"
              color="accent"
              key={x}
              rightSection={removeButton(x)}
              className="normal-case"
            >
              {x}
            </Badge>
          ))}
        </Group>
      </div>
    </div>
  );
};

export default ExactValueFacet;
