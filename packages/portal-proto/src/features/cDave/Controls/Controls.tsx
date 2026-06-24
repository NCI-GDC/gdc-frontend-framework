import React, { useState } from "react";
import { Tooltip, ActionIcon, Input, Checkbox } from "@mantine/core";
import { groupBy } from "lodash";
import { Stats, Buckets } from "@gff/core";
import { TABS } from "../constants";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  CloseIcon,
  DoubleLeftIcon,
  DoubleRightIcon,
  SearchIcon,
} from "@/utils/icons";
import { CDaveField, sortFacetFields } from "./utils";
import ControlGroup from "./ControlGroup";
import { toDisplayName } from "../utils";

interface ControlsProps {
  readonly updateFields: (field: string) => void;
  readonly cDaveFields: CDaveField[];
  readonly fieldsWithData: Record<string, Stats | Buckets>;
  readonly activeFields: string[];
  readonly controlsExpanded: boolean;
  readonly setControlsExpanded: (expanded: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  updateFields,
  cDaveFields,
  fieldsWithData,
  activeFields,
  controlsExpanded,
  setControlsExpanded,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyDataChecked, setOnlyDataChecked] = useState(false);

  const filteredFields = useDeepCompareMemo(() => {
    let fieldsToFilter = cDaveFields;

    if (onlyDataChecked) {
      fieldsToFilter = cDaveFields.filter(
        (field) => fieldsWithData[field.full] !== undefined,
      );
    }

    if (!searchTerm) return fieldsToFilter;
    return fieldsToFilter.filter(
      (field) =>
        field.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toDisplayName(field.field_name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, cDaveFields, onlyDataChecked, fieldsWithData]);

  const groupedFilteredFields = useDeepCompareMemo(
    () => groupBy(filteredFields, "field_type"),
    [filteredFields],
  );

  const hasSomeResults = Object.values(groupedFilteredFields).some(
    (fields) => fields.length > 0,
  );

  return (
    <div
      className={`${
        controlsExpanded
          ? "min-w-56 w-3/12 max-w-92 shrink-0 flex flex-col min-h-[560px] max-h-screen"
          : ""
      }`}
    >
      <Tooltip
        withArrow
        offset={-2}
        label={controlsExpanded ? "Hide Control Panel" : "Show Control Panel"}
      >
        <ActionIcon
          data-testid="button-hide-show-filters-panel"
          onClick={() => setControlsExpanded(!controlsExpanded)}
          aria-label="Collapse/Expand controls"
          aria-controls="cdave-control-panel"
          aria-expanded={controlsExpanded}
          className="text-accent"
          variant="subtle"
        >
          {controlsExpanded ? (
            <DoubleLeftIcon size="24" aria-hidden="true" />
          ) : (
            <DoubleRightIcon size="24" aria-hidden="true" />
          )}
        </ActionIcon>
      </Tooltip>
      <div
        className={controlsExpanded ? "block" : "hidden"}
        id="cdave-control-panel"
        data-testid="cdave-control-panel"
      >
        <Input
          data-testid="textbox-cdave-search-bar"
          placeholder="Search"
          className="py-2"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          rightSectionPointerEvents="all"
          leftSection={<SearchIcon size={24} />}
          rightSection={
            searchTerm && (
              <ActionIcon onClick={() => setSearchTerm("")} variant="subtle">
                <CloseIcon aria-label="clear search" />
              </ActionIcon>
            )
          }
          aria-label="Search fields"
        />

        <p data-testid="text-fields-with-values" className="py-2 font-heading">
          <strong>{Object.keys(fieldsWithData).length}</strong> of{" "}
          <strong>{cDaveFields.length}</strong> properties with data
        </p>
        <Checkbox
          data-testid="checkbox-only-show-properties-with-data"
          checked={onlyDataChecked}
          onChange={(event) => setOnlyDataChecked(event.currentTarget.checked)}
          label="Only show properties with data"
          classNames={{
            input: "checked:bg-accent checked:border-accent",
            label: "font-montserrat text-[1rem]",
          }}
          className="mb-3"
          size="sm"
        />

        <>
          {!hasSomeResults ? (
            <div className="p-4 font-content">No results found</div>
          ) : (
            <div className="max-h-screen overflow-y-auto border-t-1 border-b-1 border-base-lighter rounded-b-md rounded-t-md">
              {Object.entries(TABS).map(([key, label]) => {
                const fieldsForCategory = sortFacetFields(
                  groupedFilteredFields[key] || [],
                  key,
                );

                if (
                  searchTerm &&
                  searchTerm.length > 0 &&
                  fieldsForCategory.length === 0
                ) {
                  return null;
                }

                return (
                  <ControlGroup
                    name={label}
                    fields={fieldsForCategory}
                    updateFields={updateFields}
                    activeFields={activeFields}
                    searchTerm={searchTerm}
                    key={key}
                  />
                );
              })}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Controls;
