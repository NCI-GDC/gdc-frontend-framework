import { useState, useEffect } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";
import { Button } from "../layout/UserFlowVariedPages";
import Select from "react-select";
import {
  MdClose as ClearIcon,
  MdSave as SaveIcon,
  MdAdd as AddIcon,
  MdDelete as DeleteIcon,
  MdFileUpload as UploadIcon,
  MdFileDownload as DownloadIcon,
  MdArrowDropDown as DropDownIcon,
} from "react-icons/md";
import { nanoid } from "@reduxjs/toolkit";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilters,
  handleGqlOperation,
  FilterSet,
  CohortFilter,
  CohortFilterHandler,
  EnumFilter,
  RangeFilter, removeCohortFilter,
} from "@gff/core";
import { convertFieldToName } from "../facets/utils";

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
      <Select
        options={menu_items}
        defaultValue={menu_items[0]}
        className="border-nci-gray-light w-36"
        onChange={handleChange}
        components={{
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};

interface CohortBarProps {
  readonly cohort_names: string[];
  onSelectionChanged: (number) => void;
  defaultIdx: number;
  case_count: string;
  hide_controls?: boolean;
}

const CohortBar: React.FC<CohortBarProps> = ({
                                               cohort_names,
                                               onSelectionChanged,
                                               defaultIdx,
                                               case_count = "84,609",
                                               hide_controls = false,
                                             }: CohortBarProps) => {
  const menu_items = cohort_names.map((x, index) => {
    return { value: index, label: x };
  });

  const [currentCohort, setCurrentCohort] = useState(menu_items[defaultIdx]);

  return (
    <div className="flex flex-row items-center pl-4 h-14 bg-nci-gray-light">
      <div className="border-opacity-0">
        {!hide_controls ?
          <Select
            inputId="cohort-bar_cohort_select"
            components={{
              IndicatorSeparator: () => null,
            }}
            options={menu_items}
            isSearchable={false}
            isClearable={false}
            value={currentCohort}
            onChange={(x) => {
              setCurrentCohort(x);
              onSelectionChanged(x.value);
            }}
            className="border-nci-gray-light w-40 p-0"
          /> : <div><h2>{currentCohort.label}</h2></div>
        }
      </div>
      <CohortGroupSelect></CohortGroupSelect>
      {!hide_controls ?
        <div className="flex flex-row items-center">
          <Button className="mx-1">{case_count} Cases</Button>
          <Button className="mx-2 "><SaveIcon size="1.5em" /></Button>
          <Button className="mx-2 "><AddIcon size="1.5em" /></Button>
          <Button className="mx-2 "><DeleteIcon size="1.5em" /></Button>
          <Button className="mx-2 "><UploadIcon size="1.5em" /></Button>
          <Button className="mx-2 "><DownloadIcon size="1.5em" /></Button>
        </div> : <div />
      }
    </div>
  );
};


interface FacetElementProp {
  readonly filter: Record<string, any>;
}

const CohortFacetElement: React.FC<FacetElementProp> = ({ filter }: FacetElementProp) => {
  const { name, op, value } = filter;
  const [groupType, setGroupTop] = useState(op);

  const handleChange = (event) => {
    setGroupTop(event.target.value);
  };

  const menu_items = [
    { value: "any_of", label: "any of" },
    { value: "all_of", label: "all of" },
    { value: "none_of", label: "none of" },
    { value: "between", label: "between" },
  ];

  return (
    <div className="m-1 px-2 rounded-full bg-nci-blue-lighter text-black border-nci-blue-lighter border-2">
      <div key={nanoid()} className="flex flex-row items-center flex-grow truncate ... ">
        <ClearIcon className="pr-1" />{name} is <span className="px-1 underline">{op}</span> {value}<DropDownIcon />
      </div>
    </div>
  );
};

interface EnumFilterProps {
  readonly filter: EnumFilter;
}

const CohortEnumFilterElement: React.FC<EnumFilterProps> = ({ filter }: EnumFilterProps) => {
  const [groupType, setGroupTop] = useState(filter.op);

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
    coreDispatch(removeCohortFilter(filter.field));
  };

  return (
    <div className="m-1 px-2 font- rounded-xl bg-nci-blue-lightest text-nci-gray-darkest border-nci-gray-light border-2">
      <div key={nanoid()} className="flex flex-row items-center">
        {convertFieldToName(filter.field)} is <span className="px-1 underline">{"any of"}</span>
        <div className="flex truncate ... max-w-sm px-2 border-l-2 border-nci-gray-light ">{filter.values.join(",")}</div>
        <DropDownIcon size="1.5em" />
        <Button stylingOff={true}><ClearIcon onClick={handleRemoveFilter} size="1.5em"
                                             className="pl-1 border-l-2 border-nci-gray-light " /></Button>
      </div>
    </div>
  );
};

interface RangeFilterProps {
  readonly filter: RangeFilter;
}

const CohortRangeFilterElement: React.FC<RangeFilterProps> = ({ filter }: RangeFilterProps) => {
  const [groupType, setGroupTop] = useState(filter.op);

  const handleChange = (event) => {
    setGroupTop(event.target.value);
  };

  const menu_items = [
    { value: "between", label: "between" },
  ];

  return (
    <div className="m-1 px-2 rounded-full bg-nci-blue-lighter text-black border-nci-blue-lighter border-2">
      <div className="flex flex-row items-center flex-grow truncate ... ">
        <ClearIcon className="pr-1" />{filter.field} <span className="px-1 underline">{filter.op}</span>
        {filter.from} and {filter.to}<DropDownIcon />
      </div>
    </div>
  );
};

export interface CohortGroupProps {
  readonly cohorts: Array<{
    readonly name: string,
    readonly facets: Array<Record<string, any>>,
    readonly case_count: string
  }>;
  readonly simpleMode?: boolean;
}

const useCohortFacetFilters = (): FilterSet => {
  const filters: FilterSet = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  return filters;
};

class CohortFilterToComponent implements CohortFilterHandler<JSX.Element> {
  handleEnum = (f: EnumFilter) => <CohortEnumFilterElement filter={f} />;
  handleRange = (f: RangeFilter) => <CohortRangeFilterElement filter={f} />;
}

const convertFilterToComponent = (filter: CohortFilter): JSX.Element => {
  const handler: CohortFilterHandler<JSX.Element> = new CohortFilterToComponent();
  return handleGqlOperation(handler, filter);
};


export const CohortGroup: React.FC<CohortGroupProps> = ({ cohorts, simpleMode = false }: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
  };

  const filters = useCohortFacetFilters();

  const CohortBarWithProps = () => <CohortBar cohort_names={cohorts.map(o => o.name)}
                                              onSelectionChanged={handleCohortSelection}
                                              defaultIdx={currentIndex} case_count={cohorts[currentIndex].case_count}
                                              hide_controls={simpleMode} />;

  if (simpleMode) {
    return (
      <div
        className="flex flex-row flex-wrap w-100 p-2 bg-nci-yellow-lightest border-2 rounded border-nci-gray-lighter">
        {
          Object.keys(filters.root).map((k) => {
            return convertFilterToComponent(filters.root[k]);
          })}

      </div>

    );
  } else {
    return (

      <CollapsibleContainer
        Top={CohortBarWithProps}
        isCollapsed={isGroupCollapsed}
        toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
      >
        <div
          className="flex flex-row flex-wrap w-100 p-2 bg-nci-yellow-lightest border-b-2 border-r-2 border-l-2 rounded border-nci-gray-lighter">
          {
            Object.keys(filters.root).map((k) => {
              return convertFilterToComponent(filters.root[k]);
            })}

        </div>
      </CollapsibleContainer>
    );
  }
};





