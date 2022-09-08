import React, { useState, useCallback, useMemo } from "react";
import {
  FacetCardProps,
  SelectFacetValueFunction,
  UpdateFacetValueFunction,
} from "./types";
import { ActionIcon, Popover, Tooltip } from "@mantine/core";
import { DatePicker, RangeCalendar } from "@mantine/dates";
import {
  convertFieldToName,
  buildRangeOperator,
  extractRangeValues,
} from "@/features/facets/utils";
import {
  controlsIconStyle,
  FacetIconButton,
} from "@/features/facets/components";
import { MdClose as CloseIcon } from "react-icons/md";
import {
  FaUndo as UndoIcon,
  FaMinus as MinusIcon,
  FaPlus as PlusIcon,
} from "react-icons/fa";
import { ImCalendar as CalendarIcon } from "react-icons/im";
import { removeCohortFilter, useCoreDispatch } from "@gff/core";
import { StringRange } from "./types";

interface DateRangeFacetProps
  extends Omit<FacetCardProps, "showSearch" | "showFlip" | "showPercent"> {
  getFacetValue: SelectFacetValueFunction;
  setFacetValue: UpdateFacetValueFunction;
}

/**
 * Converts a date into a string of YYY/MM/DD padding 0 for months and days < 10.
 * Note the use of UTC to ensure the GMT timezone.
 * @param d - date to convert
 */
const convertDateToString = (d: Date | null): string | undefined => {
  if (d === null) return undefined;
  return `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1) //UTC Months start at 0
    .toString()
    .padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}`;
};

/**
 * converts a string of the form YYYY/MM/DD to a Date object set to GMT
 * @param dateStr -
 */
const convertStringToDate = (dateStr?: string): Date | null => {
  if (dateStr === undefined) return null;
  return new Date(`${dateStr.replaceAll("-", "/")} GMT`);
};

type DateRange = [Date | null, Date | null];

const DateRangeFacet: React.FC<DateRangeFacetProps> = ({
  field,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
  getFacetValue,
  setFacetValue,
  clearFilterFunc = undefined,
}: DateRangeFacetProps) => {
  const coreDispatch = useCoreDispatch();

  const clearFilters = useCallback(() => {
    console.log("clearingFilter");
    clearFilterFunc
      ? clearFilterFunc(field)
      : coreDispatch(removeCohortFilter(field));
  }, [clearFilterFunc, coreDispatch, field]);

  const facetValue = getFacetValue(field);
  const dateRange = useMemo(
    () => extractRangeValues<string>(facetValue),
    [facetValue],
  );
  const dateRangeValue: DateRange = [
    convertStringToDate(dateRange ? dateRange.from : undefined),
    convertStringToDate(dateRange ? dateRange.to : undefined),
  ];

  const [opened, setOpened] = useState(false);

  const setDateRangeValue = (d: [Date | null, Date | null]) => {
    const data: StringRange = {
      from: convertDateToString(d[0]),
      to: convertDateToString(d[1]),
      fromOp: ">=",
      toOp: "<=",
    };
    const rangeFilters = buildRangeOperator(field, data);
    if (rangeFilters !== undefined) {
      setFacetValue(field, rangeFilters);
    }
    if (rangeFilters === undefined) {
      coreDispatch(removeCohortFilter(field));
    }
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-1"
      } bg-base-max relative border-primary-lightest border-1 rounded-b-md text-xs transition`}
    >
      <div className="flex items-center justify-between flex-wrap bg-primary-lighter shadow-md px-1.5">
        <Tooltip
          label={description}
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
            {facetName === null ? convertFieldToName(field) : facetName}
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
        <DatePicker
          allowFreeInput
          clearable
          size="xs"
          placeholder="Since"
          className="px-1"
          maxDate={dateRangeValue[1]}
          inputFormat="YYYY/MM/DD"
          onChange={(d: Date | null) =>
            setDateRangeValue([d, dateRangeValue[1]])
          }
          value={dateRangeValue[0]}
          icon={<CalendarIcon />}
        ></DatePicker>
        <MinusIcon />
        <DatePicker
          allowFreeInput
          clearable
          size="xs"
          placeholder="Through"
          className="px-1"
          inputFormat="YYYY/MM/DD"
          value={dateRangeValue[1]}
          minDate={dateRangeValue[0]}
          onChange={(d: Date | null) =>
            setDateRangeValue([dateRangeValue[0], d])
          }
          icon={<CalendarIcon />}
        ></DatePicker>
        <Popover
          position="bottom-end"
          withArrow
          shadow="md"
          opened={opened}
          onChange={setOpened}
        >
          <Popover.Target>
            <ActionIcon
              className="bg-accent text-accent-contrast"
              onClick={() => setOpened((o) => !o)}
            >
              <PlusIcon />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <RangeCalendar
              classNames={{
                day: "data-first-in-range:bg-accent-lighter data-first-in-range:rounded-full data-first-in-range:rounded-r-none data-last-in-range:bg-accent-lighter data-last-in-range:rounded-full data-last-in-range:rounded-l-none data-in-range:bg-accent-lightest data-in-range:text-accent-contrast-lightest",
              }}
              allowSingleDateInRange={false}
              amountOfMonths={2}
              value={dateRangeValue}
              onChange={(d: [Date | null, Date | null]) => setDateRangeValue(d)}
            />
          </Popover.Dropdown>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeFacet;
