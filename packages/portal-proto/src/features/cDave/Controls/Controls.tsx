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
  const groupedFields = useDeepCompareMemo(
    () => groupBy(cDaveFields, "field_type"),
    [cDaveFields],
  );

  return (
    <div
      className={`${
        controlsExpanded
          ? "min-w-[14rem] w-3/12 max-w-[23rem] flex-shrink-0 flex flex-col min-h-[560px] max-h-screen"
          : ""
      }`}
    >
      <Tooltip
        withArrow
        withinPortal
        offset={-2}
        label={controlsExpanded ? "Hide Control Panel" : "Show Control Panel"}
      >
        <ActionIcon
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
          checked={onlyDataChecked}
          onChange={(event) => setOnlyDataChecked(event.currentTarget.checked)}
          label="Only show properties with data"
          classNames={{
            input: "checked:bg-accent checked:border-accent",
          }}
          className="mb-3"
          size="sm"
        />

        <div className="max-h-screen overflow-y-auto border-t-1 border-b-1 border-base-lighter rounded-b-md rounded-t-md">
          {Object.entries(TABS).map(([key, label]) => (
            <ControlGroup
              name={label}
              fields={sortFacetFields(groupedFields[key] || [], key)}
              updateFields={updateFields}
              activeFields={activeFields}
              searchTerm={searchTerm}
              key={key}
              onlyDataChecked={onlyDataChecked}
              fieldsWithData={fieldsWithData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;
