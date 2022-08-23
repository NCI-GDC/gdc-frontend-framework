import { useEffect, useState } from "react";
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
          f.description?.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
          toDisplayName(f.field_name)
            .toLowerCase()
            .search(searchTerm.toLowerCase()) > -1,
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
        className="text-lg text-nci-blue-darkest cursor-pointer bg-nci-gray-lightest flex items-center p-2 sticky top-0 z-10"
        aria-controls={`cdave-control-group-${name}`}
        aria-expanded={groupOpen}
      >
        {groupOpen ? <DownIcon /> : <RightIcon />} {name}
      </span>
      <Collapse in={groupOpen} id={`cdave-control-group-${name}`}>
        <div className="flex flex-col">
          <ul className="bg-white">
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
                ? `${filteredFields.length - 5} More...`
                : "Less...")}
          </span>
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
    <li key={field.full} className="p-2">
      {searchTerm ? (
        <>
          <div className="flex justify-between">
            <label htmlFor={`switch-${field.full}`}>
              <Highlight highlight={searchTerm}>{displayName}</Highlight>
            </label>
            <Switch
              styles={(theme) => ({
                input: {
                  "&:hover": {
                    backgroundColor: theme.fn.darken(
                      tailwindConfig.theme.extend.colors[
                        COLOR_MAP[field.field_type]
                      ]?.DEFAULT,
                      0.05,
                    ),
                  },
                  "&:checked": {
                    color:
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
        <div className="flex justify-between cursor-pointer bg-none">
          <Tooltip
            label={field?.description || "No description available"}
            withArrow
            width={200}
            multiline
          >
            <Box>
              <label
                className="pointer-events-none"
                htmlFor={`switch-${field.full}`}
              >
                {displayName}
              </label>
            </Box>
          </Tooltip>
          <Switch
            styles={(theme) => ({
              input: {
                "&:hover": {
                  backgroundColor: theme.fn.darken(
                    tailwindConfig.theme.extend.colors[
                      COLOR_MAP[field.field_type]
                    ]?.DEFAULT,
                    0.05,
                  ),
                },
                "&:checked": {
                  backgroundColor:
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
        controlsExpanded ? "w-80 bg-white overflow-scroll -ml-2" : ""
      } flex flex-col min-h-[560px] max-h-[calc(100vh-50px)]`}
    >
      <Tooltip
        withArrow
        withinPortal
        label={controlsExpanded ? "Hide Control Panel" : "Show Control Panel"}
      >
        <ActionIcon
          onClick={() => setControlsExpanded(!controlsExpanded)}
          aria-label={"Collapse/Expand controls"}
          aria-controls={"cdave-control-panel"}
          aria-expanded={controlsExpanded}
          className="text-nci-gray"
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
        />
        <p className="p-2">
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
