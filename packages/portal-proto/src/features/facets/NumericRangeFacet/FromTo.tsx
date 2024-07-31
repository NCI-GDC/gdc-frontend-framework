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
import { buildRangeOperator, getLowerAgeYears } from "../utils";
import { MdWarning as WarningIcon } from "react-icons/md";
import { useDeepCompareEffect } from "use-deep-compare";

interface FromToProps {
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly field: string;
  readonly useClearFilter: ClearFacetHook;
  readonly useUpdateFacetFilters: UpdateFacetFilterHook;
  readonly values?: FromToRange<number>;
  readonly changedCallback?: () => void;
  readonly clearValues?: boolean;
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
  units = "years",
  clearValues = undefined,
}: FromToProps) => {
  const unitsLabel = "%" != units ? ` ${units}` : "%";
  const [fromOp, setFromOp] = useState(values?.fromOp ?? ">=");
  const [fromValue, setFromValue] = useState(values?.from);
  const [toOp, setToOp] = useState(values?.toOp ?? "<");
  const [toValue, setToValue] = useState(values?.to);
  const [isWarning, setIsWarning] = useState(false);

  const clearFilter = useClearFilter();
  const updateFacetFilters = useUpdateFacetFilters();

  useDeepCompareEffect(() => {
    setFromOp(values?.fromOp ?? ">=");
    setFromValue(values?.from);
    setToOp(values?.toOp ?? "<");
    setToValue(values?.to);
  }, [values]);

  useDeepCompareEffect(() => {
    if (clearValues) {
      setFromValue(undefined);
      setToValue(undefined);
    }
  }, [clearValues]);

  useDeepCompareEffect(() => {
    if (["diagnoses.age_at_diagnosis"].includes(field)) {
      if (toValue >= WARNING_DAYS || fromValue >= WARNING_DAYS)
        setIsWarning(true);
      else setIsWarning(false);
    }
  }, [field, toValue, fromValue]);

  /**
   * Handle Apply button which will add/update/remove a range filter to the field.
   * In the case of units == years the value is converted to days as needed
   * for the filters
   */
  const handleApply = () => {
    //need to verify the values here and show red border and text if there's an issue
    const data = {
      fromOp: fromOp as RangeFromOp,
      from: fromValue,
      toOp: toOp as RangeToOp,
      to: toValue,
    };
    const rangeFilters = buildRangeOperator(field, data);
    if (rangeFilters === undefined) {
      clearFilter(field);
    } else {
      updateFacetFilters(field, rangeFilters);
    }
  };

  const lowerUnitRange =
    units !== "years" ? minimum : getLowerAgeYears(minimum);
  const upperUnitRange =
    units !== "years" ? maximum : getLowerAgeYears(maximum);

  return (
    <div className="flex flex-col grow m-2 text-base-contrast-max bg-base-max">
      <fieldset className="flex flex-col gap-y-1 text-sm">
        <legend className="sr-only">Numeric from/to filters</legend>
        <div className="flex gap-0.5 items-center flex-nowrap border font-content">
          <div className="basis-1/5 text-center">From</div>
          <SegmentedControl
            className="flex-1"
            size="sm"
            value={fromOp}
            onChange={(value) => {
              setFromOp(value as RangeFromOp);
              changedCallback();
            }}
            data={[
              { label: "\u2265", value: ">=" },
              { label: ">", value: ">" },
            ]}
            aria-label="select greater and equal or greater than"
          />
          <NumberInput
            data-testid="textbox-input-from-value"
            className="text-sm flex-1"
            placeholder={`Min: ${lowerUnitRange}${unitsLabel} `}
            // units are always days
            value={
              fromValue
              // ? adjustDaysToYearsIfUnitsAreYears(fromValue, units)
              // : ""
            }
            onChange={(value) => {
              if (value === "" || typeof value === "string") return;
              setFromValue(
                // adjustYearsToDaysIfUnitsAreYears(
                //   clamp(value, lowerUnitRange, upperUnitRange),
                //   units,
                // ),
                value,
              );
              changedCallback();
            }}
            hideControls
            aria-label="input from value"
          />
        </div>
        <div className="flex gap-0.5 items-center flex-nowrap border font-content">
          <div className="basis-1/5 text-center">To</div>
          <SegmentedControl
            className="flex-1"
            size="sm"
            value={toOp}
            onChange={(value) => {
              setToOp(value as RangeToOp);
              changedCallback();
            }}
            data={[
              { label: "\u2264", value: "<=" },
              { label: "<", value: "<" },
            ]}
            aria-label="select less or less than and equal"
          />
          <NumberInput
            data-testid="textbox-input-to-value"
            className="flex-1 text-sm"
            placeholder={`Max: ${upperUnitRange}${unitsLabel} `}
            onChange={(value) => {
              if (value === "" || typeof value === "string") return;
              setToValue(
                // adjustYearsToDaysIfUnitsAreYears(
                //   clamp(value, lowerUnitRange, upperUnitRange),
                //   units,
                // ),
                value,
              );
              changedCallback();
            }}
            value={
              toValue
              // ? adjustDaysToYearsIfUnitsAreYears(toValue, units) : ""
            }
            hideControls
            aria-label="input to value"
          />
        </div>
      </fieldset>
      {isWarning ? (
        <div className="bg-utility-warning border-utility-warning">
          <span>
            {" "}
            <WarningIcon size="24px" />
            {`For health information privacy concerns, individuals over 89
                    will all appear as 90 years old. For more information, click `}
            <a
              href="https://gdc.cancer.gov/about-gdc/gdc-faqs#collapsible-item-618-question"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </span>
        </div>
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
