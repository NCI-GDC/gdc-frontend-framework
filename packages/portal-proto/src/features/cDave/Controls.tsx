import { useEffect, useState } from "react";
import {
  Switch,
  Divider,
  Tooltip,
  Collapse,
  ActionIcon,
  Input,
} from "@mantine/core";
import { groupBy } from "lodash";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowRight as RightIcon,
} from "react-icons/md";
import {
  FaAngleDoubleLeft as DoubleLeftIcon,
  FaAngleDoubleRight as DoubleRightIcon,
} from "react-icons/fa";
import { FacetDefinition } from "@gff/core";
import Highlight from "@/components/Highlight";
import { createKeyboardAccessibleFunction } from "src/utils";
import { COLOR_MAP, DEFAULT_FIELDS } from "./constants";
import { toDisplayName } from "./utils";

type ParsedFacetDefinition = FacetDefinition & {
  readonly field_type: string;
  readonly field_name: string;
};

interface ControlGroupProps {
  readonly name: string;
  readonly fields: ParsedFacetDefinition[];
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
          f.description.toLowerCase().search(searchTerm) > -1 ||
          f.field_name.search(searchTerm) > -1,
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
        onKeyPress={createKeyboardAccessibleFunction(() =>
          setGroupOpen(!groupOpen),
        )}
        tabIndex={0}
        role="button"
        className="text-lg text-nci-blue-darkest cursor-pointer bg-nci-gray-lightest flex items-center p-2"
      >
        {groupOpen ? <DownIcon /> : <RightIcon />} {name}
      </span>
      <Collapse in={groupOpen}>
        <div className="flex flex-col">
          <ul className="bg-white">
            {visibleFields.map((field) => (
              <FieldControl
                key={field.field}
                field={field}
                updateFields={updateFields}
                activeFields={activeFields}
                searchTerm={searchTerm}
              />
            ))}
          </ul>
          <span
            onClick={() => setFieldsCollapsed(!fieldsCollapsed)}
            onKeyPress={createKeyboardAccessibleFunction(() =>
              setFieldsCollapsed(!fieldsCollapsed),
            )}
            tabIndex={0}
            role="button"
            className="cursor-pointer mr-2 self-end"
          >
            {filteredFields.length > 5 &&
              (fieldsCollapsed
                ? `${filteredFields.length - 5} More ...`
                : "Less...")}
          </span>
        </div>
      </Collapse>
    </>
  ) : null;
};

interface FieldControlProps {
  readonly field: ParsedFacetDefinition;
  readonly updateFields: (field: string) => void;
  readonly activeFields: string[];
  readonly searchTerm?: string;
}

const FieldControl: React.FC<FieldControlProps> = ({
  field,
  updateFields,
  activeFields,
  searchTerm,
}: FieldControlProps) => {
  const [checked, setChecked] = useState(DEFAULT_FIELDS.includes(field.full));

  useEffect(() => {
    setChecked(activeFields.includes(field.full));
  }, [activeFields, field.full]);

  const displayName = toDisplayName(field.field_name);

  return (
    <li key={field.field} className="p-2">
      {searchTerm ? (
        <>
          <div className="flex justify-between">
            <Highlight search={searchTerm} text={displayName} />
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
          <Highlight search={searchTerm} text={field.description} />
        </>
      ) : (
        <div className="flex justify-between cursor-pointer">
          <Tooltip label={field.description} withArrow wrapLines width={200}>
            {displayName}
          </Tooltip>
          <Switch
            classNames={{
              input: `bg-none text-${COLOR_MAP[field.field_type]}`,
            }}
            checked={checked}
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
              updateFields(field.full);
            }}
            color={COLOR_MAP[field.field_type]}
          />
        </div>
      )}
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
  const [searchTerm, setSearchTerm] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const groupedFields = groupBy(cDaveFields, "field_type");

  return (
    <div
      className={`${
        !panelCollapsed ? "w-80 bg-white overflow-scroll -ml-2" : ""
      } h-[600px] flex flex-col`}
    >
      <ActionIcon
        className="self-end"
        onClick={() => setPanelCollapsed(!panelCollapsed)}
      >
        {panelCollapsed ? <DoubleRightIcon /> : <DoubleLeftIcon />}
      </ActionIcon>
      <div className={panelCollapsed ? "hidden" : "block"}>
        <Input
          placeholder="Search"
          className="p-2"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.currentTarget.value)
          }
        />
        <p className="p-2">
          {Object.keys(fieldsWithData).length} of {cDaveFields.length} fields
          with values
        </p>
        <ControlGroup
          name={"Demographic"}
          fields={groupedFields["demographic"] || []}
          updateFields={updateFields}
          activeFields={activeFields}
          searchTerm={searchTerm}
        />
        <ControlGroup
          name={"Diagnosis"}
          fields={groupedFields["diagnoses"] || []}
          updateFields={updateFields}
          activeFields={activeFields}
          searchTerm={searchTerm}
        />
        <ControlGroup
          name={"Treatment"}
          fields={groupedFields["treatments"] || []}
          updateFields={updateFields}
          activeFields={activeFields}
          searchTerm={searchTerm}
        />
        <ControlGroup
          name={"Exposure"}
          fields={groupedFields["exposures"] || []}
          updateFields={updateFields}
          activeFields={activeFields}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default Controls;
