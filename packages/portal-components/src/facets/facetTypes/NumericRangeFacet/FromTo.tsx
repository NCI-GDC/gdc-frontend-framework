import React, { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { NumberInput, Radio } from "@mantine/core";
import { useForm } from "@mantine/form";
import SegmentedControl from "@/common/SegmentedControl";
import {
  ClearFacetHook,
  FromToRange,
  RangeFromOp,
  RangeToOp,
  UpdateFacetFilterHook,
} from "../../types";
import {
  adjustDaysToYearsIfUnitsAreYears,
  adjustYearsToDaysIfUnitsAreYears,
  buildRangeOperator,
  getLowerAgeYears,
} from "../../utils";
import { WarningMessageIcon, WarningTriangleIcon } from "src/commonIcons";
import { DAYS_IN_YEAR } from "../../constants";

interface FromToProps {
  readonly minimum: number;
  readonly maximum: number;
  readonly units?: string;
  readonly field: string;
  readonly useClearFilter: ClearFacetHook;
  readonly useUpdateFacetFilters: UpdateFacetFilterHook;
  readonly values?: FromToRange<number>;
  readonly changedCallback?: () => void;
  readonly clearValues?: boolean;
  readonly rangeDatatype?: string;
  readonly radioSelected?: boolean;
  readonly onSelectRadio?: () => void;
}

const WARNING_DAYS = Math.floor(90 * DAYS_IN_YEAR);

const applyButtonClasses = `
  flex
  flex-row
  subpixel-antialiased
  rounded-md
  border-1
  border-primary
  text-primary
  font-montserrat
  font-medium
  text-sm
  transition
  w-full
  justify-center
  align-center
  py-1
  bg-base-max
  hover:bg-primary
  hover:text-base-max
`;

interface WarningOrErrorProps {
  hasErrors: boolean;
  isWarning: boolean;
  lowerUnitRange: number;
  upperUnitRange: number;
}

const WarningOrError: React.FC<WarningOrErrorProps> = ({
  hasErrors,
  isWarning,
  lowerUnitRange,
  upperUnitRange,
}: WarningOrErrorProps) => (
  <div className="flex flex-col gap-1 my-1 text-xs">
    {hasErrors ? (
      <div className="text-utility-error flex gap-2">
        <div>
          <WarningMessageIcon size="1rem" />
        </div>
        <span>
          Please enter a number between {lowerUnitRange} and {upperUnitRange}.
        </span>
      </div>
    ) : null}
    {isWarning ? (
      <div className="bg-utility-warning border-utility-warning flex gap-2 p-1">
        <div>
          <WarningTriangleIcon size="1rem" />
        </div>
        <span>
          {`For health information privacy concerns, individuals over 89 will all appear as 90 years old. For more information, `}
          <a
            href="https://gdc.cancer.gov/about-gdc/gdc-faqs#collapsible-item-618-question"
            rel="noopener noreferrer"
            target="_blank"
            className="underline"
          >
            click here
          </a>
          .
        </span>
      </div>
    ) : null}
  </div>
);

/**
 * A Component which manages a range. The From/To values are managed by a numeric text entry
 * @param field - field for this range
 * @param minimum - range minimum value
 * @param maximum - range maximum value
 * @param values - the current value of the range
 * @param changedCallback - function called when FromTo values change
 * @param units - string representation of unit: "days" | "years" | "year", "percent" | "numeric"
 * @param useClearFilter - hook to clear (e.x. reset)  field (facet) filters
 * @param clearValues - prop set to true to clear FromTo input fields
 * @param useUpdateFacetFilters - hook to update facet filters with new values
 */
const FromTo: React.FC<FromToProps> = ({
  field,
  useClearFilter,
  useUpdateFacetFilters,
  minimum,
  maximum,
  values,
  changedCallback = () => null,
  units = "",
  clearValues = undefined,
  rangeDatatype = undefined,
  radioSelected = false,
  onSelectRadio = undefined,
}: FromToProps) => {
  const [isWarning, setIsWarning] = useState(false);
  const clearFilter = useClearFilter();
  const updateFacetFilters = useUpdateFacetFilters();
  const unitsLabel = "%" != units ? ` ${units}` : "%";
  const queryInYears = rangeDatatype === "age_in_years";
  const lowerUnitRange =
    units !== "years" || queryInYears ? minimum : getLowerAgeYears(minimum);
  const upperUnitRange =
    units !== "years" || queryInYears ? maximum : getLowerAgeYears(maximum);

  const form = useForm({
    initialValues: {
      fromOp: values?.fromOp ?? ">=",
      fromValue:
        values?.from !== undefined
          ? adjustDaysToYearsIfUnitsAreYears(values.from, units, queryInYears)
          : undefined,
      toOp: values?.toOp ?? "<",
      toValue:
        values?.to !== undefined
          ? adjustDaysToYearsIfUnitsAreYears(values.to, units, queryInYears)
          : undefined,
    },
    validate: {
      fromValue: (value: number | undefined) => {
        if (
          value !== undefined &&
          (value < lowerUnitRange || value > upperUnitRange)
        ) {
          return true;
        }

        return false;
      },
      toValue: (value: number | undefined) => {
        if (
          value !== undefined &&
          (value < lowerUnitRange || value > upperUnitRange)
        ) {
          return true;
        }

        return false;
      },
    },
  });

  useDeepCompareEffect(() => {
    form.setValues({
      fromOp: values?.fromOp ?? ">=",
      fromValue:
        values?.from !== undefined
          ? adjustDaysToYearsIfUnitsAreYears(values.from, units, queryInYears)
          : undefined,
      toOp: values?.toOp ?? "<",
      toValue:
        values?.to !== undefined
          ? adjustDaysToYearsIfUnitsAreYears(values.to, units, queryInYears)
          : undefined,
    });
    // https://github.com/mantinedev/mantine/issues/5338
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, units]);

  useDeepCompareEffect(() => {
    if (clearValues) {
      form.reset();
    }
    // https://github.com/mantinedev/mantine/issues/5338
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearValues]);

  useDeepCompareEffect(() => {
    const fromValueInDays =
      form.values.fromValue !== undefined
        ? adjustYearsToDaysIfUnitsAreYears(
            form.values.fromValue,
            units,
            queryInYears,
          )
        : undefined;
    const toValueInDays =
      form.values.toValue !== undefined
        ? adjustYearsToDaysIfUnitsAreYears(
            form.values.toValue,
            units,
            queryInYears,
          )
        : undefined;
    if (["diagnoses.age_at_diagnosis"].includes(field)) {
      setIsWarning(
        (toValueInDays !== undefined && toValueInDays >= WARNING_DAYS) ||
          (fromValueInDays !== undefined && fromValueInDays >= WARNING_DAYS),
      );
    }
  }, [field, form.values.toValue, form.values.fromValue, units, queryInYears]);

  /**
   * Handle Apply button which will add/update/remove a range filter to the field.
   * In the case of units == years the value is converted to days as needed
   * for the filters
   */
  const handleApply = () => {
    if (form.validate().hasErrors) return;
    const data = {
      fromOp: form.values.fromOp as RangeFromOp,
      from:
        form.values.fromValue !== undefined
          ? adjustYearsToDaysIfUnitsAreYears(
              form.values.fromValue,
              units,
              queryInYears,
            )
          : undefined,
      toOp: form.values.toOp as RangeToOp,
      to:
        form.values.toValue !== undefined
          ? adjustYearsToDaysIfUnitsAreYears(
              form.values.toValue,
              units,
              queryInYears,
            )
          : undefined,
    };
    const rangeFilters = buildRangeOperator(field, data);
    if (rangeFilters === undefined) {
      clearFilter(field);
    } else {
      updateFacetFilters(field, rangeFilters);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 justify-items-stretch items-center">
        {onSelectRadio !== undefined && (
          <Radio
            aria-label="custom range"
            id={`${field}_custom`}
            name={`${field}_range_selection`}
            checked={radioSelected}
            onChange={onSelectRadio}
            color="accent"
          />
        )}
        <div className="flex flex-col grow mb-1 text-base-contrast-max bg-base-lightest rounded-md p-2">
          <fieldset className="flex flex-col gap-y-1 text-sm">
            <legend className="sr-only">Numeric from/to filters</legend>
            <div className="flex gap-2 justify-end font-content">
              <div className=" flex items-center justify-end font-bold font-montserrat h-8 w-16">
                From
              </div>
              <div
                className={`flex flex-col ${
                  onSelectRadio ? "min-[1800px]:flex-row" : "xl:flex-row"
                } flex-nowrap gap-2 grow`}
              >
                <SegmentedControl
                  size="sm"
                  className="w-16 h-10"
                  value={form.values.fromOp}
                  onChange={(value) => {
                    form.setFieldValue("fromOp", value as RangeFromOp);
                    changedCallback();
                  }}
                  data={[
                    { label: "\u2265", value: ">=" },
                    { label: ">", value: ">" },
                  ]}
                  aria-label="select greater and equal or greater than"
                  padding={1.5}
                />
                <NumberInput
                  {...form.getInputProps("fromValue")}
                  value={form.values.fromValue ?? ""}
                  data-testid="textbox-input-from-value"
                  className="text-sm grow"
                  placeholder={`Min: ${lowerUnitRange}${unitsLabel} `}
                  // units are always days
                  onChange={(value) => {
                    if (value === "") {
                      form.setFieldValue("fromValue", undefined);
                    } else {
                      form.setFieldValue("fromValue", Number(value));
                    }
                    changedCallback();
                  }}
                  error={form?.errors?.fromValue}
                  hideControls
                  aria-label="input from value"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end font-content pt-1">
              <div className=" flex items-center justify-end font-bold font-montserrat h-8 w-16">
                To
              </div>
              <div
                className={`flex flex-col ${
                  onSelectRadio ? "min-[1800px]:flex-row" : "xl:flex-row"
                } flex-nowrap gap-2 grow`}
              >
                <SegmentedControl
                  size="sm"
                  className="w-16 h-10"
                  value={form.values.toOp}
                  onChange={(value) => {
                    form.setFieldValue("toOp", value as RangeToOp);
                    changedCallback();
                  }}
                  data={[
                    { label: "\u2264", value: "<=" },
                    { label: "<", value: "<" },
                  ]}
                  aria-label="select less or less than and equal"
                  padding={1.5}
                />
                <NumberInput
                  {...form.getInputProps("toValue")}
                  value={form.values.toValue ?? ""}
                  data-testid="textbox-input-to-value"
                  className="text-sm grow"
                  placeholder={`Max: ${upperUnitRange}${unitsLabel} `}
                  onChange={(value) => {
                    if (value === "") {
                      form.setFieldValue("toValue", undefined);
                    } else {
                      form.setFieldValue("toValue", Number(value));
                    }
                    changedCallback();
                  }}
                  error={form?.errors?.toValue}
                  hideControls
                  aria-label="input to value"
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      {Object.keys(form.errors).length > 0 || isWarning ? (
        <WarningOrError
          hasErrors={Object.keys(form.errors).length > 0}
          isWarning={isWarning}
          lowerUnitRange={lowerUnitRange}
          upperUnitRange={upperUnitRange}
        />
      ) : null}
      <div className="flex items-stretch w-100 pt-1">
        <button className={applyButtonClasses} onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default FromTo;
