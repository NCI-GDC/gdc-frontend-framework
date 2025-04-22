import React, { useState, useMemo } from "react";
import { ActionIcon, Popover } from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import { getFormattedTimestamp } from "../utils";
import { CalendarIcon, MinusIcon, PlusIcon } from "src/commonIcons";
import { buildRangeOperator, extractRangeValues } from "../utils";
import FacetControlsHeader from "./FacetControlsHeader";
import { FacetCardProps, ValueFacetHooks, StringRange } from "../types";

type DateRangeFacetProps = Omit<
  FacetCardProps<ValueFacetHooks>,
  "showSearch" | "showFlip" | "showPercent" | "valueLabel"
>;

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
 * Facet card component for date range fields
 * @param field - field to facet on
 * @param description - description of the facet
 * @param hooks - hooks to use for the facet
 * @param facetName - name of the facet
 * @param dismissCallback - callback to call when the facet is dismissed
 */
const DateRangeFacet: React.FC<DateRangeFacetProps> = ({
  field,
  description,
  hooks,
  facetName,
  dismissCallback = undefined,
}: DateRangeFacetProps) => {
  const clearFilters = hooks.useClearFilter();
  const facetValue = hooks.useGetFacetFilters(field);
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const showFilters = isFilterExpanded === undefined || isFilterExpanded;

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
      from: getFormattedTimestamp({ date: d[0] }),
      to: getFormattedTimestamp({ date: d[1] }),
      fromOp: ">=",
      toOp: "<=",
    };
    const rangeFilters = buildRangeOperator(field, data);
    if (rangeFilters !== undefined) updateFacetFilters(field, rangeFilters);
    // clear filters as range is empty
    else clearFilters(field);
  };

  return (
    <div className="flex flex-col mx-0 bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition">
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
        <fieldset className="flex flex-nowrap items-center p-2">
          <legend className="sr-only">Date range filters</legend>
          <DateInput
            data-testid="textbox-input-since-value"
            clearable
            size="sm"
            placeholder="Since"
            className="px-1"
            maxDate={dateRangeValue[1] ?? undefined}
            valueFormat="YYYY-MM-DD"
            onChange={(d: Date | null) =>
              setDateRangeValue([d, dateRangeValue[1]])
            }
            classNames={{ day: "hover:bg-primary hover:text-base-max" }}
            value={dateRangeValue[0]}
            aria-label="Set the since value"
            leftSection={<CalendarIcon />}
          />
          <MinusIcon />
          <DateInput
            data-testid="textbox-input-through-value"
            clearable
            size="sm"
            placeholder="Through"
            className="px-1"
            valueFormat="YYYY-MM-DD"
            value={dateRangeValue[1]}
            minDate={dateRangeValue[0] ?? undefined}
            onChange={(d: Date | null) =>
              setDateRangeValue([dateRangeValue[0], d])
            }
            classNames={{ day: "hover:bg-primary hover:text-base-max" }}
            leftSection={<CalendarIcon />}
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
                size="lg"
              >
                <PlusIcon />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <DatePicker
                classNames={{
                  day: "text-sm hover:bg-primary hover:text-base-max data-first-in-range:bg-accent-lighter data-first-in-range:rounded-full data-first-in-range:rounded-r-none data-last-in-range:bg-accent-lighter data-last-in-range:rounded-full data-last-in-range:rounded-l-none data-in-range:bg-accent-lightest data-in-range:text-accent-contrast-lightest",
                }}
                numberOfColumns={2}
                type="range"
                allowSingleDateInRange={false}
                value={dateRangeValue}
                onChange={(d: [Date | null, Date | null]) =>
                  setDateRangeValue(d)
                }
                aria-label="date range picker"
              />
            </Popover.Dropdown>
          </Popover>
        </fieldset>
      </div>
    </div>
  );
};

export default DateRangeFacet;
