/* eslint-disable */
// TODO need to revisit this file for more changes to fix eslint issues
import { useState } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";

import { Button, NativeSelect } from "@mantine/core";
import Select from "react-select";
import {
  MdAdd as AddIcon,
  MdArrowDropDown as DropDownIcon,
  MdClose as ClearIcon,
  MdDelete as DeleteIcon,
  MdFileDownload as DownloadIcon,
  MdFileUpload as UploadIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { nanoid } from "@reduxjs/toolkit";
import {
  FilterSet,
  Operation,
  EnumOperandValue,
  handleOperation,
  OperationHandler,
  removeCohortFilter,
  selectCurrentCohortFilters,
  useCoreDispatch,
  useCoreSelector,
  Includes,
  Equals,
  NotEquals,
  LessThan,
  LessThanOrEquals,
  GreaterThan,
  Exists,
  GreaterThanOrEquals,
  ExcludeIfAny,
  Excludes,
  Missing,
  Intersection,
  Union,
} from "@gff/core";
import * as tailwindConfig from "tailwind.config";
import { convertFieldToName } from "../facets/utils";
import CountButton from "./CountButton";

const enum_menu_items = [
  { value: "any_of", label: "includes at least one:" },
  { value: "all_of", label: "includes all:" },
  { value: "none_of", label: "excludes:" },
  { value: "between", label: "between" },
];

const filter_set_label_v1 = {
  any_of: "any of:",
  all_of: "all:",
  none_of: "none:",
};

const filter_set_label_v2 = {
  any_of: "includes at least one:",
  all_of: "includes all:",
  none_of: "excludes:",
};

const CohortGroupSelect: React.FC<unknown> = () => {
  const menu_items = [
    { value: "any_of", label: "is any of" },
    { value: "all_of", label: "is all of" },
    { value: "none_of", label: "is none of" },
  ];
  const [groupType, setGroupTop] = useState(menu_items[0]);

  const handleChange = (value) => {
    setGroupTop(value);
  };

  return (
    <div className="border-opacity-0 pl-4">
      <NativeSelect
        rightSection={<DropDownIcon />}
        data={menu_items}
        value={groupType.value}
        className="border-nci-gray-light w-36"
        onChange={handleChange}
      />
    </div>
  );
};

export interface CohortBarProps {
  readonly cohort_names: string[];
  onSelectionChanged: (number) => void;
  defaultIdx: number;
  hide_controls?: boolean;
}

export const CohortBar: React.FC<CohortBarProps> = ({
  cohort_names,
  onSelectionChanged,
  defaultIdx,
  hide_controls = false,
}: CohortBarProps) => {
  const menu_items = cohort_names.map((x, index) => {
    return { value: index, label: x };
  });

  const [currentCohort, setCurrentCohort] = useState(menu_items[defaultIdx]);

  const buttonStyle =
    "p-2 bg-white transition-colors text-nci-blue-darkest hover:bg-nci-blue hover:text-white";
  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 pl-4 h-20 shadow-lg bg-nci-blue-darkest"
    >
      <div className="border-opacity-0">
        {!hide_controls ? (
          <Select
            inputId="cohort-bar_cohort_select"
            options={menu_items}
            isSearchable={false}
            isClearable={false}
            value={currentCohort}
            onChange={(x) => {
              setCurrentCohort(x);
              onSelectionChanged(x.value);
            }}
            className="border-nci-gray-light w-80 p-0 z-10 "
            aria-items-centerlabel="Select cohort"
            styles={{
              dropdownIndicator: (provided) => ({
                ...provided,
                color: tailwindConfig.theme.extend.colors["gdc-blue"].darkest,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: tailwindConfig.theme.extend.colors["gdc-blue"].darkest,
              }),
            }}
          />
        ) : (
          <div>
            <h2>{currentCohort.label}</h2>
          </div>
        )}
      </div>
      {!hide_controls ? (
        <>
          <Button className={buttonStyle}>
            <SaveIcon size="1.5em" aria-label="Save cohort" />
          </Button>
          <Button className={buttonStyle}>
            <AddIcon size="1.5em" aria-label="Add cohort" />
          </Button>
          <Button className={buttonStyle}>
            <DeleteIcon size="1.5em" aria-label="Delete cohort" />
          </Button>
          <Button className={buttonStyle}>
            <UploadIcon size="1.5em" aria-label="Upload cohort" />
          </Button>
          <Button className={buttonStyle}>
            <DownloadIcon size="1.5em" aria-label="Download cohort" />
          </Button>
        </>
      ) : (
        <div />
      )}
    </div>
  );
};

interface FacetElementProp {
  readonly filter: Record<string, any>;
}

const CohortFacetElement: React.FC<FacetElementProp> = ({
  filter,
}: FacetElementProp) => {
  const { name, op, value } = filter;
  const [groupType, setGroupTop] = useState(op);

  const handleChange = (event) => {
    setGroupTop(event.target.value);
  };

  return (
    <div className="m-1 px-2 rounded-full bg-nci-gray-lighter text-nci-gray-darker border-nci-gray-light border-2">
      <div
        key={nanoid()}
        className="flex flex-row items-center flex-grow truncate ... "
      >
        <ClearIcon className="pr-1" />
        {name} is <span className="px-1 underline">{op}</span> {value}
        <DropDownIcon />
      </div>
    </div>
  );
};

interface EnumFilterProps {
  readonly op: string;
  readonly field: string;
  readonly values: ReadonlyArray<string>;
}

const CohortEnumFilterElement: React.FC<EnumFilterProps> = ({
  field,
  op,
  values,
}: EnumFilterProps) => {
  const [groupType, setGroupTop] = useState(op);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (event) => {
    setGroupTop(event.target.value);
  };

  const menu_items = [
    { value: "any_of", label: "any of" },
    { value: "all_of", label: "all of" },
    { value: "none_of", label: "none of" },
  ];

  const coreDispatch = useCoreDispatch();

  const handleRemoveFilter = () => {
    coreDispatch(removeCohortFilter(field));
  };

  const handlePopupFacet = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="m-1 px-2 font-heading shadow-md font-medium text-sm rounded-xl bg-nci-gray-lighter text-nci-gray-darkest border-nci-gray-light border-1">
      <div className="flex flex-row items-center">
        {convertFieldToName(field)} is{" "}
        <span className="px-1 underline">{filter_set_label_v1["any_of"]}</span>
        <div className="flex truncate ... max-w-sm px-2 border-l-2 border-nci-gray-light ">
          {values.join(",")}
        </div>
        <DropDownIcon size="1.5em" onClick={handlePopupFacet} />
        <button>
          <ClearIcon
            onClick={handleRemoveFilter}
            size="1.5em"
            className="pl-1 border-l-2 border-nci-gray-light "
          />
        </button>
      </div>
    </div>
  );
};

interface RangeFilterProps {
  readonly filter: Operation;
}

interface CohortFacet {
  readonly field: string;
  readonly value: ReadonlyArray<string>;
}
interface PersistentCohort {
  readonly name: string;
  readonly facets?: ReadonlyArray<CohortFacet>;
}

export interface CohortGroupProps {
  readonly cohorts: ReadonlyArray<PersistentCohort>;
  readonly simpleMode?: boolean;
  readonly isGroupCollapsed: boolean;
  readonly setIsGroupCollapsed: (collapsed: boolean) => void;
}

export const useCohortFacetFilters = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

/**
 *  Processes a Filter into a component representation
 */
class CohortFilterToComponent implements OperationHandler<JSX.Element> {
  handleIncludes = (f: Includes) => (
    <CohortEnumFilterElement
      key={f.field}
      field={f.field}
      op={f.operator}
      values={f.operands.map(String)}
    />
  );
  handleEquals = (f: Equals) => (
    <CohortEnumFilterElement
      key={f.field}
      field={f.field}
      op={f.operator}
      values={[String(f.operand)]}
    />
  );
  handleNotEquals = (f: NotEquals) => null;
  handleLessThan = (f: LessThan) => null;
  handleLessThanOrEquals = (f: LessThanOrEquals) => null;
  handleGreaterThan = (f: GreaterThan) => null;
  handleGreaterThanOrEquals = (f: GreaterThanOrEquals) => null;
  handleExists = (f: Exists) => null;
  handleExcludeIfAny = (f: ExcludeIfAny) => null;
  handleMissing = (f: Missing) => null;
  handleExcludes = (f: Excludes) => null;
  handleIntersection = (f: Intersection) => null;
  handleUnion = (f: Union) => null;
}

export const convertFilterToComponent = (filter: Operation): JSX.Element => {
  const handler: OperationHandler<JSX.Element> = new CohortFilterToComponent();
  return handleOperation(handler, filter);
};

export const CohortGroup: React.FC<CohortGroupProps> = ({
  cohorts,
}: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
  };

  const filters = useCohortFacetFilters();
  // eslint-disable-next-line react/prop-types
  const CohortBarWithProps = () => (
    <CohortBar
      cohort_names={cohorts.map((o) => o.name)}
      onSelectionChanged={handleCohortSelection}
      defaultIdx={currentIndex}
    />
  );
  return (
    <CollapsibleContainer
      Top={CohortBarWithProps}
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
    >
      <div className="flex flex-row flex-wrap w-100 p-2 bg-nci-gray-lightest ">
        {Object.keys(filters.root).map((k) => {
          return convertFilterToComponent(filters.root[k]);
        })}
      </div>
    </CollapsibleContainer>
  );
};
