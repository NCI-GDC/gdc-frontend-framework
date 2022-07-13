import { useEffect, useState } from "react";
import { Switch, Divider, Tooltip, Collapse } from "@mantine/core";
import { groupBy } from "lodash";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowRight as RightIcon,
} from "react-icons/md";
import { useFacetDictionary } from "@gff/core";
import { humanify } from "@/features/biospecimen/utils";

const tabs = ["demographic", "diagnoses", "exposures", "treatment"];

export const CLINICAL_FIELD_BLACKLIST = [
  "state",
  "score",
  "submitter_id",
  "demographic_id",
  "updated_datetime",
  "diagnosis_id",
  "created_datetime",
  "exposure_id",
  "treatment_id",
];
const blacklistRegex = new RegExp(
  CLINICAL_FIELD_BLACKLIST.map((item) => `(${item})`).join("|"),
);

const ControlGroup = ({ name, fields, color }) => {
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
        className="text-lg text-nci-blue-darkest cursor-pointer bg-nci-gray-lightest flex items-center"
      >
        {groupOpen ? <DownIcon /> : <RightIcon />} {name}
      </span>
      <Collapse in={groupOpen}>
        <ul className="bg-white">
          {visibleFields.map((field) => (
            <li key={field.field} className="cursor-pointer p-2">
              <Tooltip
                label={field.description}
                withArrow
                wrapLines
                className="w-full"
              >
                <div className="flex justify-between">
                  {humanify({ term: field.field_name })}
                  <Switch classNames={{ input: `text-${color}` }} />
                </div>
              </Tooltip>
              <Divider />
            </li>
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

const parseFieldName = (field) => {
  const parsed = field.split(".");
  return { field_type: parsed.at(-2), field_name: parsed.at(-1) };
};

const Controls = () => {
  const { data } = useFacetDictionary();
  const cDaveFields = Object.values(data)
    .map((d) => ({ ...d, ...parseFieldName(d.field) }))
    .filter((d) => d.doc_type === "cases" && tabs.includes(d.field_type))
    .filter((field) => !blacklistRegex.test(field.field));

  const groupedFields = groupBy(cDaveFields, "field_type");
  console.log(cDaveFields);
  return (
    <div className="w-52 h-[600px] overflow-scroll flex flex-col bg-white">
      <ControlGroup
        name={"Demographic"}
        fields={groupedFields["demographic"] || []}
        color={"nci-blue"}
      />
      <ControlGroup
        name={"Diagnosis"}
        fields={groupedFields["diagnoses"] || []}
        color={"nci-orange"}
      />
      <ControlGroup
        name={"Treatment"}
        fields={groupedFields["treatment"] || []}
        color={"nci-green"}
      />
      <ControlGroup
        name={"Exposure"}
        fields={groupedFields["exposures"] || []}
        color={"nci-purple"}
      />
    </div>
  );
};

export default Controls;
