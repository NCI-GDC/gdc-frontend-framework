import { useEffect, useState } from "react";
import { Switch, Divider, Tooltip, Collapse } from "@mantine/core";
import { groupBy } from "lodash";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowRight as RightIcon,
} from "react-icons/md";
import { FacetDefinition } from "@gff/core";
import { humanify } from "@/features/biospecimen/utils";
import { COLOR_MAP, DEFAULT_FIELDS } from "./constants";

type ParsedFacetDefinition = FacetDefinition & {
  readonly field_type: string;
  readonly field_name: string;
};

interface ControlGroupProps {
  readonly name: string;
  readonly fields: ParsedFacetDefinition[];
  readonly updateFields: (field: string) => void;
  readonly activeFields: string[];
}

const ControlGroup: React.FC<ControlGroupProps> = ({
  name,
  fields,
  updateFields,
  activeFields,
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
              key={field.field}
              field={field}
              updateFields={updateFields}
              activeFields={activeFields}
            />
          ))}
        </ul>
        <span
          onClick={() => setFieldsCollapsed(!fieldsCollapsed)}
          className="cursor-pointer float-right mr-2"
        >
          {fieldsCollapsed ? `${fields.length - 5} More ...` : "Less..."}
        </span>
      </Collapse>
    </>
  );
};

interface FieldControlProps {
  readonly field: ParsedFacetDefinition;
  readonly updateFields: (field: string) => void;
  readonly activeFields: string[];
}

const FieldControl: React.FC<FieldControlProps> = ({
  field,
  updateFields,
  activeFields,
}: FieldControlProps) => {
  const [checked, setChecked] = useState(DEFAULT_FIELDS.includes(field.full));

  useEffect(() => {
    setChecked(activeFields.includes(field.full));
  }, [activeFields]);

  return (
    <li key={field.field} className="cursor-pointer p-2">
      <div className="flex justify-between">
        <Tooltip label={field.description} withArrow wrapLines>
          {humanify({ term: field.field_name })}
        </Tooltip>
        <Switch
          classNames={{ input: "bg-none" }}
          checked={checked}
          onChange={(e) => {
            setChecked(e.currentTarget.checked);
            updateFields(field.full);
          }}
          color={COLOR_MAP[field.field_type]}
        />
      </div>
      <Divider />
    </li>
  );
};

interface ControlPanelProps {
  readonly updateFields: (field: string) => void;
  readonly cDaveFields: ParsedFacetDefinition[];
  readonly fieldsWithData: any;
  readonly activeFields: string[];
}

const Controls: React.FC<ControlPanelProps> = ({
  updateFields,
  cDaveFields,
  fieldsWithData,
  activeFields,
}: ControlPanelProps) => {
  const groupedFields = groupBy(cDaveFields, "field_type");

  return (
    <div className="w-80 h-[600px] overflow-scroll flex flex-col bg-white">
      <p>
        {Object.keys(fieldsWithData).length} of {cDaveFields.length} fields with
        values
      </p>
      <ControlGroup
        name={"Demographic"}
        fields={groupedFields["demographic"] || []}
        updateFields={updateFields}
        activeFields={activeFields}
      />
      <ControlGroup
        name={"Diagnosis"}
        fields={groupedFields["diagnoses"] || []}
        updateFields={updateFields}
        activeFields={activeFields}
      />
      <ControlGroup
        name={"Treatment"}
        fields={groupedFields["treatments"] || []}
        updateFields={updateFields}
        activeFields={activeFields}
      />
      <ControlGroup
        name={"Exposure"}
        fields={groupedFields["exposures"] || []}
        updateFields={updateFields}
        activeFields={activeFields}
      />
    </div>
  );
};

export default Controls;
