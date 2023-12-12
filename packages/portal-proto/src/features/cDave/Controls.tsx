import React, { useEffect, useState } from "react";
import {
  Box,
  Switch,
  Divider,
  Tooltip,
  Collapse,
  ActionIcon,
  Input,
  Highlight,
} from "@mantine/core";
import { groupBy, get, sortBy } from "lodash";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowRight as RightIcon,
  MdClose as CloseIcon,
} from "react-icons/md";
import {
  FaAngleDoubleLeft as DoubleLeftIcon,
  FaAngleDoubleRight as DoubleRightIcon,
} from "react-icons/fa";
import { Stats, Buckets } from "@gff/core";
import { createKeyboardAccessibleFunction } from "src/utils";
import { COLOR_MAP, DEFAULT_FIELDS, FACET_SORT, TABS } from "./constants";
import { toDisplayName } from "./utils";
import tailwindConfig from "../../../tailwind.config";
import FacetExpander from "../facets/FacetExpander";

interface CDaveField {
  readonly field_type: string;
  readonly field_name: string;
  readonly description?: string;
  readonly full: string;
}

interface ControlGroupProps {
  readonly name: string;
  readonly fields: CDaveField[];
  readonly updateFields: (field: string) => void;
  readonly activeFields: string[];
  readonly searchTerm?: string;
}

const ControlGroup: React.FC<ControlGroupProps> = ({
  name,
  fields,
  updateFields,
  activeFields,
  searchTerm,
}: ControlGroupProps) => {
  const [groupOpen, setGroupOpen] = useState(true);
  const [filteredFields, setFilteredFields] = useState(fields);
  const [fieldsCollapsed, setFieldsCollapsed] = useState(true);
  const [visibleFields, setVisibleFields] = useState(fields.slice(0, 5));

  useEffect(() => {
    if (!searchTerm) {
      setVisibleFields(fieldsCollapsed ? fields.slice(0, 5) : fields);
      setFilteredFields(fields);
    } else {
      const filteredFields = fields.filter(
        (f) =>
          f.description?.toLowerCase().search(searchTerm.trim().toLowerCase()) >
            -1 ||
          toDisplayName(f.field_name)
            .toLowerCase()
            .search(searchTerm.trim().toLowerCase()) > -1,
      );

      setVisibleFields(
        fieldsCollapsed ? filteredFields.slice(0, 5) : filteredFields,
      );
      setFilteredFields(filteredFields);
    }
  }, [searchTerm, fieldsCollapsed, fields]);

  return filteredFields.length > 0 ? (
    <>
      <span
        onClick={() => setGroupOpen(!groupOpen)}
        onKeyDown={createKeyboardAccessibleFunction(() =>
          setGroupOpen(!groupOpen),
        )}
        tabIndex={0}
        role="button"
        className="text-md text-primary-contrast cursor-pointer bg-primary font-heading font-semibold flex items-center p-2 sticky top-0 z-10"
        aria-controls={`cdave-control-group-${name}`}
        aria-expanded={groupOpen}
      >
        {groupOpen ? <DownIcon /> : <RightIcon />} {name}
      </span>
      <Collapse in={groupOpen} id={`cdave-control-group-${name}`}>
        <div className="flex flex-col">
          <ul className="bg-base-max text-md">
            {visibleFields.map((field) => (
              <FieldControl
                key={field.full}
                field={field}
                updateFields={updateFields}
                activeFields={activeFields}
                searchTerm={searchTerm}
              />
            ))}
          </ul>
          <div className="text-sm">
            <FacetExpander
              remainingValues={filteredFields.length - 5}
              isGroupExpanded={!fieldsCollapsed}
              onShowChanged={() => setFieldsCollapsed(!fieldsCollapsed)}
            />
          </div>
        </div>
      </Collapse>
    </>
  ) : null;
};

interface FieldControlProps {
  readonly field: CDaveField;
  readonly updateFields: (field: string) => void;
  readonly activeFields: string[];
  readonly searchTerm?: string;
}

const FieldControl: React.FC<FieldControlProps> = ({
  field,
  updateFields,
  activeFields,
  searchTerm = "",
}: FieldControlProps) => {
  const [checked, setChecked] = useState(DEFAULT_FIELDS.includes(field.full));

  useEffect(() => {
    setChecked(activeFields.includes(field.full));
  }, [activeFields, field.full]);

  const displayName = toDisplayName(field.field_name);

  return (
    <li key={field.full} className="px-2 pt-2">
      {searchTerm ? (
        <>
          <div className="flex justify-between items-center pb-1">
            <label
              className="font-content font-medium text-md"
              htmlFor={`switch-${field.full}`}
              aria-labelledby={`switch-${field.full}`}
            >
              <span id={`switch-${field.full}`}>
                <Highlight highlight={searchTerm}>{displayName}</Highlight>
              </span>
            </label>
            <Switch
              styles={(theme) => ({
                track: {
                  "&:hover": {
                    backgroundColor: theme.fn.darken(
                      tailwindConfig.theme.extend.colors[
                        COLOR_MAP[field.field_type]
                      ]?.DEFAULT,
                      0.05,
                    ),
                  },
                },
                input: {
                  "&:checked + .mantine-Switch-track": {
                    backgroundColor:
                      tailwindConfig.theme.extend.colors[
                        COLOR_MAP[field.field_type]
                      ]?.DEFAULT,
                    borderColor:
                      tailwindConfig.theme.extend.colors[
                        COLOR_MAP[field.field_type]
                      ]?.DEFAULT,
                  },
                },
              })}
              classNames={{
                input: "bg-none rounded-lg",
              }}
              checked={checked}
              onChange={(e) => {
                setChecked(e.currentTarget.checked);
                updateFields(field.full);
              }}
              id={`switch-${field.full}`}
            />
          </div>
          <Highlight highlight={searchTerm}>
            {field?.description || ""}
          </Highlight>
        </>
      ) : (
        <div className="flex justify-between cursor-pointer items-center bg-none py-2">
          <Tooltip
            label={field?.description || "No description available"}
            withArrow
            width={200}
            multiline
          >
            <Box>
              <label
                className="pointer-events-none font-content font-medium"
                htmlFor={`switch-${field.full}`}
              >
                {displayName}
              </label>
            </Box>
          </Tooltip>
          <Switch
            styles={(theme) => ({
              track: {
                "&:hover": {
                  backgroundColor: theme.fn.darken(
                    tailwindConfig.theme.extend.colors[
                      COLOR_MAP[field.field_type]
                    ]?.DEFAULT,
                    0.05,
                  ),
                },
              },
              input: {
                "&:checked + .mantine-Switch-track": {
                  backgroundColor:
                    tailwindConfig.theme.extend.colors[
                      COLOR_MAP[field.field_type]
                    ]?.DEFAULT,
                  borderColor:
                    tailwindConfig.theme.extend.colors[
                      COLOR_MAP[field.field_type]
                    ]?.DEFAULT,
                },
              },
            })}
            classNames={{
              input: "bg-none rounded-lg",
            }}
            checked={checked}
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
              updateFields(field.full);
            }}
            id={`switch-${field.full}`}
          />
        </div>
      )}
      <Divider />
    </li>
  );
};

const sortFacetFields = (
  fields: CDaveField[],
  facet_type: string,
): CDaveField[] => {
  return sortBy(fields, (item) =>
    FACET_SORT[facet_type].indexOf(item.field_name) !== -1
      ? FACET_SORT[facet_type].indexOf(item.field_name)
      : fields.length,
  );
};

interface ControlPanelProps {
  readonly updateFields: (field: string) => void;
  readonly cDaveFields: CDaveField[];
  readonly fieldsWithData: Record<string, Stats | Buckets>;
  readonly activeFields: string[];
  readonly controlsExpanded: boolean;
  readonly setControlsExpanded: (expanded: boolean) => void;
}

const Controls: React.FC<ControlPanelProps> = ({
  updateFields,
  cDaveFields,
  fieldsWithData,
  activeFields,
  controlsExpanded,
  setControlsExpanded,
}: ControlPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const groupedFields = groupBy(cDaveFields, "field_type");

  return (
    <div
      className={`${
        controlsExpanded ? "w-80 bg-base-max shadow-md overflow-y-scroll" : ""
      } pl-4 pt-2 flex flex-col min-h-[560px] max-h-screen`}
    >
      <Tooltip
        withArrow
        withinPortal
        offset={-2}
        label={controlsExpanded ? "Hide Control Panel" : "Show Control Panel"}
      >
        <ActionIcon
          onClick={() => setControlsExpanded(!controlsExpanded)}
          aria-label={"Collapse/Expand controls"}
          aria-controls={"cdave-control-panel"}
          aria-expanded={controlsExpanded}
          className="text-base"
        >
          {controlsExpanded ? <DoubleLeftIcon /> : <DoubleRightIcon />}
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
          className="p-2"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.currentTarget.value)
          }
          rightSection={
            searchTerm && (
              <CloseIcon onClick={() => setSearchTerm("")}></CloseIcon>
            )
          }
          aria-label="Search fields"
        />
        <p
          data-testid="text-fields-with-values"
          className="p-2 font-heading font-medium"
        >
          {Object.keys(fieldsWithData).length} of {cDaveFields.length} fields
          with values
        </p>
        {Object.entries(TABS).map(([key, label]) => (
          <ControlGroup
            name={label}
            fields={sortFacetFields(get(groupedFields, key, []), key)}
            updateFields={updateFields}
            activeFields={activeFields}
            searchTerm={searchTerm}
            key={key}
          />
        ))}
      </div>
    </div>
  );
};

export default Controls;
