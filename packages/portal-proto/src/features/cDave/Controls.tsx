import React, { useState } from "react";
import {
  Switch,
  Divider,
  Tooltip,
  Collapse,
  ActionIcon,
  Input,
  Highlight,
} from "@mantine/core";
import { groupBy, sortBy } from "lodash";
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
import {
  COLOR_MAP,
  COLOR_CLASS_HOVER_MAP,
  DEFAULT_FIELDS,
  FACET_SORT,
  TABS,
} from "./constants";
import { toDisplayName } from "./utils";
import tailwindConfig from "../../../tailwind.config";
import FacetExpander from "../facets/FacetExpander";
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from "use-deep-compare";

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
}) => {
  const [groupOpen, setGroupOpen] = useState(true);
  const [fieldsCollapsed, setFieldsCollapsed] = useState(true);

  const filteredFields = useDeepCompareMemo(() => {
    if (!searchTerm) return fields;
    return fields.filter(
      (f) =>
        f.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toDisplayName(f.field_name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, fields]);

  const visibleFields = useDeepCompareMemo(
    () => (fieldsCollapsed ? filteredFields.slice(0, 5) : filteredFields),
    [fieldsCollapsed, filteredFields],
  );

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
        {groupOpen ? (
          <DownIcon aria-hidden="true" />
        ) : (
          <RightIcon aria-hidden="true" />
        )}{" "}
        {name}
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
}) => {
  const [checked, setChecked] = useState(DEFAULT_FIELDS.includes(field.full));

  useDeepCompareEffect(() => {
    setChecked(activeFields.includes(field.full));
  }, [activeFields, field.full]);

  const displayName = toDisplayName(field.field_name);
  const fieldColor =
    tailwindConfig.theme.extend.colors[COLOR_MAP[field.field_type]]?.DEFAULT;

  const handleChange = useDeepCompareCallback(
    (e) => {
      setChecked(e.currentTarget.checked);
      updateFields(field.full);
    },
    [field.full, updateFields],
  );

  return (
    <li data-testid={`row-field-${displayName}-cdave`} className="px-2 pt-2">
      <Switch
        label={
          searchTerm ? (
            <Highlight highlight={searchTerm}>{displayName}</Highlight>
          ) : (
            <Tooltip
              label={field?.description || "No description available"}
              withArrow
              w={200}
              multiline
              zIndex={15}
            >
              <div>{displayName}</div>
            </Tooltip>
          )
        }
        labelPosition="left"
        color={fieldColor}
        classNames={{
          root: "py-2",
          body: "flex justify-between items-center",
          label: "cursor-pointer text-base text-black font-content font-medium",
          track: `cursor-pointer ${COLOR_CLASS_HOVER_MAP[field.field_type]}`,
        }}
        checked={checked}
        onChange={handleChange}
      />
      {searchTerm && (
        <Highlight highlight={searchTerm}>{field?.description || ""}</Highlight>
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
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const groupedFields = useDeepCompareMemo(
    () => groupBy(cDaveFields, "field_type"),
    [cDaveFields],
  );

  return (
    <div
      className={`${
        controlsExpanded ? "w-80 bg-base-max shadow-md" : ""
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
          variant="subtle"
        >
          {controlsExpanded ? (
            <DoubleLeftIcon aria-hidden="true" />
          ) : (
            <DoubleRightIcon aria-hidden="true" />
          )}
        </ActionIcon>
      </Tooltip>
      <div
        className={controlsExpanded ? "block" : "hidden"}
        id="cdave-control-panel"
        data-testid="cdave-control-panel"
      >
        <div className="mr-4">
          <Input
            data-testid="textbox-cdave-search-bar"
            placeholder="Search"
            className="py-2"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            rightSectionPointerEvents="all"
            rightSection={
              searchTerm && (
                <ActionIcon onClick={() => setSearchTerm("")} variant="subtle">
                  <CloseIcon aria-label="clear search" />
                </ActionIcon>
              )
            }
            aria-label="Search fields"
          />
        </div>
        <p
          data-testid="text-fields-with-values"
          className="p-2 font-heading font-medium"
        >
          {Object.keys(fieldsWithData).length} of {cDaveFields.length} fields
          with values
        </p>
        <div className="max-h-screen overflow-y-scroll">
          {Object.entries(TABS).map(([key, label]) => (
            <ControlGroup
              name={label}
              fields={sortFacetFields(groupedFields[key] || [], key)}
              updateFields={updateFields}
              activeFields={activeFields}
              searchTerm={searchTerm}
              key={key}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;
