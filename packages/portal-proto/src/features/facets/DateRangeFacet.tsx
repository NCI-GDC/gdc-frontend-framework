import React, { useState, useMemo } from "react";
import { FacetCardProps, ValueFacetHooks } from "./types";
import { ActionIcon, Popover, Tooltip } from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import {
  buildRangeOperator,
  extractRangeValues,
} from "@/features/facets/utils";
import {
  controlsIconStyle,
  FacetIconButton,
  FacetText,
  FacetHeader,
} from "@/features/facets/components";
import { MdClose as CloseIcon } from "react-icons/md";
import {
  FaUndo as UndoIcon,
  FaMinus as MinusIcon,
  FaPlus as PlusIcon,
} from "react-icons/fa";
import { ImCalendar as CalendarIcon } from "react-icons/im";
import { trimFirstFieldNameToTitle } from "@gff/core";
import { StringRange } from "./types";

type DateRangeFacetProps = Omit<
  FacetCardProps<ValueFacetHooks>,
  "showSearch" | "showFlip" | "showPercent" | "valueLabel"
>;

/**
 * Converts a date into a string of YYYY/MM/DD padding 0 for months and days \< 10.
 * @param d - date to convert
 */
const convertDateToString = (d: Date | null): string | undefined => {
  if (d === null) return undefined;
  return `${d.getFullYear()}-${(d.getMonth() + 1) //Months start at 0
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

/**
 * converts a string of the form YYYY/MM/DD to a Date object
 * @param dateStr -
 */
const convertStringToDate = (dateStr?: string): Date | null => {
  if (dateStr === undefined) return null;
  return new Date(dateStr.replaceAll("-", "/"));
};

type DateRange = [Date | null, Date | null];

/**
 * Facet card for a date range field
 * @param field - field to facet on
 * @param description - description of the facet
 * @param hooks - hooks to use for the facet
 * @param facetName - name of the facet
 * @param dismissCallback - callback to call when the facet is dismissed
 * @param width - width of the facet
 * @category Facets
 */
const DateRangeFacet: React.FC<DateRangeFacetProps> = ({
  field,
  description,
  hooks,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
}: DateRangeFacetProps) => {
  const clearFilters = hooks.useClearFilter();
  const facetValue = hooks.useGetFacetFilters(field);
  const updateFacetFilters = hooks.useUpdateFacetFilters();

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
    if (rangeFilters !== undefined) updateFacetFilters(field, rangeFilters);
    // clear filters as range is empty
    else clearFilters(field);
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
      } bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <Tooltip
          label={description}
          position="bottom-start"
          disabled={!description}
          multiline
          width={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
        >
          <FacetText>
            {facetName ? facetName : trimFirstFieldNameToTitle(field, true)}
          </FacetText>
        </Tooltip>
        <div className="flex flex-row">
          <Tooltip label="Clear selection">
            <FacetIconButton
              onClick={() => clearFilters(field)}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" className={controlsIconStyle} />
            </FacetIconButton>
          </Tooltip>
          {dismissCallback && (
            <Tooltip label="Remove the facet">
              <FacetIconButton
                onClick={() => {
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon size="1.25em" className={controlsIconStyle} />
              </FacetIconButton>
            </Tooltip>
          )}
        </div>
      </FacetHeader>
      <fieldset className="flex flex-nowrap items-center p-2">
        <legend className="sr-only">Date range filters</legend>
        <DateInput
          data-testid="textbox-input-since-value"
          clearable
          size="xs"
          placeholder="Since"
          className="px-1"
          maxDate={dateRangeValue[1]}
          valueFormat="YYYY-MM-DD"
          onChange={(d: Date | null) =>
            setDateRangeValue([d, dateRangeValue[1]])
          }
          classNames={{ day: "hover:bg-primary hover:text-base-max" }}
          value={dateRangeValue[0]}
          aria-label="Set the since value"
          icon={<CalendarIcon />}
        />
        <MinusIcon />
        <DateInput
          data-testid="textbox-input-through-value"
          clearable
          size="xs"
          placeholder="Through"
          className="px-1"
          valueFormat="YYYY-MM-DD"
          value={dateRangeValue[1]}
          minDate={dateRangeValue[0]}
          onChange={(d: Date | null) =>
            setDateRangeValue([dateRangeValue[0], d])
          }
          classNames={{ day: "hover:bg-primary hover:text-base-max" }}
          icon={<CalendarIcon />}
          aria-label="Set the through value"
        />
        <Popover
          position="bottom-end"
          withArrow
          shadow="md"
          opened={opened}
          onChange={setOpened}
        >
          <Popover.Target>
            <ActionIcon
              aria-label="open the date range picker"
              className="bg-accent text-accent-contrast"
              onClick={() => setOpened((o) => !o)}
            >
              <PlusIcon />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <DatePicker
              classNames={{
                day: "hover:bg-primary hover:text-base-max data-first-in-range:bg-accent-lighter data-first-in-range:rounded-full data-first-in-range:rounded-r-none data-last-in-range:bg-accent-lighter data-last-in-range:rounded-full data-last-in-range:rounded-l-none data-in-range:bg-accent-lightest data-in-range:text-accent-contrast-lightest",
              }}
              numberOfColumns={2}
              type="range"
              allowSingleDateInRange={false}
              value={dateRangeValue}
              onChange={(d: [Date | null, Date | null]) => setDateRangeValue(d)}
              aria-label="date range picker"
            />
          </Popover.Dropdown>
        </Popover>
      </fieldset>
    </div>
  );
};

export default DateRangeFacet;
