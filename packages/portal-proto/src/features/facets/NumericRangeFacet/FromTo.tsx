import { useState } from "react";
import { DAYS_IN_YEAR } from "@gff/core";
import { NumberInput, SegmentedControl } from "@mantine/core";
import {
  ClearFacetHook,
  FromToRange,
  RangeFromOp,
  RangeToOp,
  UpdateFacetFilterHook,
} from "../types";
import {
  adjustDaysToYearsIfUnitsAreYears,
  adjustYearsToDaysIfUnitsAreYears,
  buildRangeOperator,
  getLowerAgeYears,
} from "../utils";
import { RiErrorWarningFill as ErrorWarningIcon } from "react-icons/ri";
import { MdWarning as WarningIcon } from "react-icons/md";
import { useDeepCompareEffect } from "use-deep-compare";
import { useForm } from "@mantine/form";

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
}

const WARNING_DAYS = Math.floor(90 * DAYS_IN_YEAR);

const applyButtonClasses = `
  flex
  flex-row
  subpixel-antialiased
  rounded-md
  text-base-max
  font-montserrat
  font-medium
  text-sm
  transition
  w-full
  justify-center
  align-center
  py-1
  bg-primary-dark
  hover:bg-primary-darkest
  hover:shadow-[0_4px_5px_0px_rgba(0,0,0,0.35)]
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
          <ErrorWarningIcon size="1rem" />
        </div>
        <span>
          Please enter a number between {lowerUnitRange} and {upperUnitRange}.
        </span>
      </div>
    ) : null}
    {isWarning ? (
      <div className="bg-utility-warning border-utility-warning flex gap-2 p-1">
        <div>
          <WarningIcon size="1rem" />
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
      fromValue: (value) => {
        if (
          value !== undefined &&
          (value < lowerUnitRange || value > upperUnitRange)
        )
          return true;
      },
      toValue: (value) => {
        if (
          value !== undefined &&
          (value < lowerUnitRange || value > upperUnitRange)
        )
          return true;
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
    <div className="flex flex-col grow m-2 text-base-contrast-max bg-base-max">
      <fieldset className="flex flex-col gap-y-1 text-sm">
        <legend className="sr-only">Numeric from/to filters</legend>
        <div className="flex gap-0.5 items-center flex-nowrap border font-content">
          <div className="basis-1/5 text-center">From</div>
          <SegmentedControl
            className="flex-1"
            size="sm"
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
          />
          <NumberInput
            {...form.getInputProps("fromValue")}
            value={form.values.fromValue ?? ""}
            data-testid="textbox-input-from-value"
            className="text-sm flex-1"
            placeholder={`Min: ${lowerUnitRange}${unitsLabel} `}
            // units are always days
            onChange={(value) => {
              if (value === "" || typeof value === "string") {
                form.setFieldValue("fromValue", undefined);
              } else {
                form.setFieldValue("fromValue", value);
              }
              changedCallback();
            }}
            error={form?.errors?.fromValue}
            hideControls
            aria-label="input from value"
          />
        </div>
        <div className="flex gap-0.5 items-center flex-nowrap border font-content">
          <div className="basis-1/5 text-center">To</div>
          <SegmentedControl
            className="flex-1"
            size="sm"
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
          />
          <NumberInput
            {...form.getInputProps("toValue")}
            value={form.values.toValue ?? ""}
            data-testid="textbox-input-to-value"
            className="flex-1 text-sm"
            placeholder={`Max: ${upperUnitRange}${unitsLabel} `}
            onChange={(value) => {
              if (value === "" || typeof value === "string") {
                form.setFieldValue("toValue", undefined);
              } else {
                form.setFieldValue("toValue", value);
              }
              changedCallback();
            }}
            error={form?.errors?.toValue}
            hideControls
            aria-label="input to value"
          />
        </div>
      </fieldset>
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
