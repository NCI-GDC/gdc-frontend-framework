import { useState } from "react";
import { CDaveField } from "./utils";
import { COLOR_CLASS_HOVER_MAP, COLOR_MAP, DEFAULT_FIELDS } from "../constants";
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from "use-deep-compare";
import { toDisplayName } from "../utils";
import tailwindConfig from "tailwind.config";
import { Switch, Highlight, Tooltip, Collapse } from "@mantine/core";
import { createKeyboardAccessibleFunction } from "@/utils/index";
import { FacetExpander } from "@gff/portal-components";
import { DownArrowIcon, UpArrowIcon } from "@/utils/icons";

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

  useDeepCompareEffect(() => {
    setChecked(activeFields.includes(field.full));
  }, [activeFields, field.full]);

  const displayName = toDisplayName(field.field_name);
  const variant =
    field.field_type === "other_clinical_attributes" ? "darker" : "DEFAULT";
  const fieldColor =
    tailwindConfig.theme.extend.colors[COLOR_MAP[field.field_type]]?.[variant];

  const handleChange = useDeepCompareCallback(
    (e) => {
      setChecked(e.currentTarget.checked);
      updateFields(field.full);
    },
    [field.full, updateFields],
  );

  return (
    <li data-testid={`row-field-${displayName}-cdave`} className="px-2">
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
            >
              <div>{displayName}</div>
            </Tooltip>
          )
        }
        labelPosition="left"
        color={fieldColor}
        classNames={{
          root: "py-1",
          body: "flex justify-between items-center",
          label: "cursor-pointer text-sm text-black font-content font-medium",
          track: `cursor-pointer ${COLOR_CLASS_HOVER_MAP[field.field_type]}`,
        }}
        checked={checked}
        onChange={handleChange}
      />
      {searchTerm && (
        <Highlight highlight={searchTerm}>{field?.description || ""}</Highlight>
      )}
    </li>
  );
};

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
  const [fieldsCollapsed, setFieldsCollapsed] = useState(true);

  const visibleFields = useDeepCompareMemo(
    () => (fieldsCollapsed ? fields.slice(0, 5) : fields),
    [fieldsCollapsed, fields],
  );

  return (
    <div className="mb-4 last:mb-0">
      <span
        onClick={() => setGroupOpen(!groupOpen)}
        onKeyDown={createKeyboardAccessibleFunction(() =>
          setGroupOpen(!groupOpen),
        )}
        tabIndex={0}
        role="button"
        className="text-sm xl:text-[1rem] text-primary-contrast cursor-pointer bg-primary-darker font-heading font-semibold flex items-center p-2 sticky top-0 z-table-header"
        aria-controls={`cdave-control-group-${name}`}
        aria-expanded={groupOpen}
      >
        {groupOpen ? (
          <UpArrowIcon aria-hidden="true" size={24} />
        ) : (
          <DownArrowIcon aria-hidden="true" size={24} />
        )}{" "}
        {name}
      </span>
      <Collapse
        in={groupOpen}
        id={`cdave-control-group-${name}`}
        className="border-1 border-base-lighter rounded-b-md"
      >
        {fields.length > 0 ? (
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
                remainingValues={fields.length - 5}
                isGroupExpanded={!fieldsCollapsed}
                onShowChanged={() => setFieldsCollapsed(!fieldsCollapsed)}
              />
            </div>
          </div>
        ) : (
          <div
            className="p-4 font-content text-sm"
            data-testid={`text-no-properties-with-data-${name
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            No properties with data
          </div>
        )}
      </Collapse>
    </div>
  );
};

export default ControlGroup;
