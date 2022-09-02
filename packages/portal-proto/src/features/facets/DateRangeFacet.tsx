import React from "react";
import { FacetCardProps } from "./types";
import { ActionIcon, TextInput, Tooltip } from "@mantine/core";
import { convertFieldToName } from "@/features/facets/utils";
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

type DateRangeFacetProps = Omit<
  FacetCardProps,
  "showSearch" | "showFlip" | "showPercent"
>;

const DateRangeFacet: React.FC<DateRangeFacetProps> = ({
  field,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
  clearFilterFunc = undefined,
}: DateRangeFacetProps) => {
  const coreDispatch = useCoreDispatch();
  const clearFilters = () => {
    clearFilterFunc
      ? clearFilterFunc(field)
      : coreDispatch(removeCohortFilter(field));
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
        <TextInput
          size="xs"
          placeholder="Since"
          className="px-1"
          rightSection={<CalendarIcon />}
        ></TextInput>
        <MinusIcon />
        <TextInput
          size="xs"
          placeholder="Through"
          className="px-1"
          rightSection={<CalendarIcon />}
        ></TextInput>
        <ActionIcon className="bg-accent text-accent-contrast">
          <PlusIcon />
        </ActionIcon>
      </div>
    </div>
  );
};

export default DateRangeFacet;
