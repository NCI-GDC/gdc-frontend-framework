import { useEffect, useState } from "react";
import { Switch, Divider, Tooltip, Collapse } from "@mantine/core";
import { groupBy } from "lodash";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowRight as RightIcon,
} from "react-icons/md";
import { FacetDefinition } from "@gff/core";
import { humanify } from "@/features/biospecimen/utils";
import { DEFAULT_FIELDS } from "./constants";

interface ControlGroupProps {
  readonly name: string;
  readonly fields: FacetDefinition[];
  readonly color: string;
  readonly updateFields: (field: string) => void;
}

const ControlGroup: React.FC<ControlGroupProps> = ({
  name,
  fields,
  color,
  updateFields,
}: ControlGroupProps) => {
  const [groupOpen, setGroupOpen] = useState(true);
  const [fieldsCollapsed, setFieldsCollapsed] = useState(true);
  const [visibleFields, setVisibleFields] = useState(fields.slice(0, 5));

  useEffect(() => {
    setVisibleFields(fieldsCollapsed ? fields.slice(0, 5) : fields);
  }, [fieldsCollapsed, fields]);

  return (
    <>
      <span
        onClick={() => setGroupOpen(!groupOpen)}
        className="text-lg text-nci-blue-darkest cursor-pointer bg-nci-gray-lightest flex items-center p-2"
      >
        {groupOpen ? <DownIcon /> : <RightIcon />} {name}
      </span>
      <Collapse in={groupOpen}>
        <ul className="bg-white">
          {visibleFields.map((field) => (
            <FieldControl
              field={field}
              color={color}
              updateFields={updateFields}
              key={field.field}
            />
          ))}
        </ul>
        <span
          onClick={() => setFieldsCollapsed(!fieldsCollapsed)}
          className="cursor-pointer"
        >
          {fieldsCollapsed ? `${fields.length - 5} More ...` : "Less..."}
        </span>
      </Collapse>
    </>
  );
};

interface FieldControlProps {
  readonly field: FacetDefinition;
  readonly color: string;
  readonly updateFields: (field: string) => void;
}

const FieldControl: React.FC<FieldControlProps> = ({
  field,
  color,
  updateFields,
}: FieldControlProps) => {
  const [checked, setChecked] = useState(DEFAULT_FIELDS.includes(field.field));

  return (
    <li key={field.field} className="cursor-pointer p-2">
      <div className="flex justify-between">
        <Tooltip label={field.description} withArrow wrapLines>
          {humanify({ term: field.field_name })}
        </Tooltip>
        <Switch
          classNames={{ input: "bg-none" }}
          checked={checked}
          onChange={() => {
            setChecked(!checked);
            updateFields(field.full);
          }}
          color={color}
        />
      </div>
      <Divider />
    </li>
  );
};

interface ControlPanelProps {
  readonly updateFields: (field: string) => void;
  readonly cDaveFields: FacetDefinition[];
  readonly numFieldsWithData: number;
}

const Controls: React.FC<ControlPanelProps> = ({
  updateFields,
  cDaveFields,
  numFieldsWithData,
}: ControlPanelProps) => {
  const groupedFields = groupBy(cDaveFields, "field_type");

  return (
    <div className="w-80 h-[600px] overflow-scroll flex flex-col bg-white">
      <p>
        {numFieldsWithData} of {cDaveFields.length} fields with values
      </p>
      <ControlGroup
        name={"Demographic"}
        fields={groupedFields["demographic"] || []}
        color={"blue"}
        updateFields={updateFields}
      />
      <ControlGroup
        name={"Diagnosis"}
        fields={groupedFields["diagnoses"] || []}
        color={"orange"}
        updateFields={updateFields}
      />
      <ControlGroup
        name={"Treatment"}
        fields={groupedFields["treatments"] || []}
        color={"green"}
        updateFields={updateFields}
      />
      <ControlGroup
        name={"Exposure"}
        fields={groupedFields["exposures"] || []}
        color={"purple"}
        updateFields={updateFields}
      />
    </div>
  );
};

export default Controls;
