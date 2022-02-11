import { useState } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";

import { Button } from '@mantine/core';
import { NativeSelect } from '@mantine/core';
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

const enum_menu_items = [
  { value: "any_of", label: "includes at least one:" },
  { value: "all_of", label: "includes all:" },
  { value: "none_of", label: "excludes:" },
  { value: "between", label: "between" },
];

const filter_set_label_v1 = {
  "any_of": "any of:",
  "all_of": "all:",
  "none_of": "none:",
};

const filter_set_label_v2 = {
  "any_of": "includes at least one:",
  "all_of": "includes all:",
  "none_of": "excludes:",
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
      <NativeSelect rightSection={<DropDownIcon />}
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
  case_count: string;
  hide_controls?: boolean;
}

export const CohortBar: React.FC<CohortBarProps> = ({
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
    <div className="flex flex-row items-center justify-start pl-4 h-12 shadow-lg bg-nci-gray-lighter rounded-lg rounded-b-none rounded-r-none">
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
            className="border-nci-gray-light w-80 p-0"
          /> : <div><h2>{currentCohort.label}</h2></div>
        }
      </div>
      {!hide_controls ?
        <div className="flex flex-row items-center ml-auto">
          <Button className="mx-1 font-heading font-medium bg-nci-teal-darker ">{case_count} Cases</Button>
          <Button className="mx-1 bg-nci-teal-darker"><SaveIcon size="1.5em" /></Button>
          <Button className="mx-1 bg-nci-teal-darker"><AddIcon size="1.5em" /></Button>
          <Button className="mx-1 bg-nci-teal-darker"><DeleteIcon size="1.5em" /></Button>
          <Button className="mx-1 bg-nci-teal-darker"><UploadIcon size="1.5em" /></Button>
          <Button className="mx-1 bg-nci-teal-darker"><DownloadIcon size="1.5em" /></Button>
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

  return (
    <div className="m-1 px-2 rounded-full bg-nci-gray-lighter text-nci-gray-darker border-nci-gray-light border-2">
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
  const [showPopup, setShowpopup] = useState(false);

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

  const handlePopupFacet = () => {
    setShowpopup(!showPopup);
  };

  return (
    <div className="m-1 px-2 font-heading shadow-md font-medium text-sm rounded-xl bg-nci-gray-lighter text-nci-gray-darkest border-nci-gray-light border-1">
      <div key={nanoid()} className="flex flex-row items-center">
        {convertFieldToName(filter.field)} is <span className="px-1 underline">{filter_set_label_v1["any_of"]}</span>
        <div className="flex truncate ... max-w-sm px-2 border-l-2 border-nci-gray-light ">{filter.values.join(",")}</div>
        <DropDownIcon size="1.5em" onClick={handlePopupFacet} />
        <button ><ClearIcon onClick={handleRemoveFilter} size="1.5em"
                                             className="pl-1 border-l-2 border-nci-gray-light " /></button>
      </div>
    </div>
  )
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
    <div className="m-1 px-2 rounded-full bg-nci-gray-lighter font-heading text-gray-dark border-nci-gray-lighter border-width">
      <div className="flex flex-row items-center flex-grow truncate ... ">
        <ClearIcon className="pr-1" />{filter.field} <span className="px-1 underline">{filter.op}</span>
        {filter.from} and {filter.to}<DropDownIcon />
      </div>
    </div>
  );
};

interface CohortCounts {
  readonly name: string,
  readonly facets: Array<Record<string, any>>,
  readonly case_count: string
}

export interface CohortGroupProps {
  readonly cohorts: ReadonlyArray<CohortCounts>;
  readonly simpleMode?: boolean;
}

export const useCohortFacetFilters = (): FilterSet => {
  const filters: FilterSet = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  return filters;
};

class CohortFilterToComponent implements CohortFilterHandler<JSX.Element> {
  handleEnum = (f: EnumFilter) => <CohortEnumFilterElement key={f.filter} filter={f} />;
  handleRange = (f: RangeFilter) => <CohortRangeFilterElement key={f.filter} filter={f} />;
}

export const convertFilterToComponent = (filter: CohortFilter): JSX.Element => {
  const handler: CohortFilterHandler<JSX.Element> = new CohortFilterToComponent();
  return handleGqlOperation(handler, filter);
};


export const CohortGroup: React.FC<CohortGroupProps> = ({ cohorts }: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
  };

  const filters = useCohortFacetFilters();
  const CohortBarWithProps = () => <CohortBar cohort_names={cohorts.map(o => o.name)}
                                              onSelectionChanged={handleCohortSelection}
                                              defaultIdx={currentIndex} case_count={"85415"}
                                              />;
    return (
      <CollapsibleContainer
        Top={CohortBarWithProps}
        isCollapsed={isGroupCollapsed}
        toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
      >
        <div
          className="flex flex-row flex-wrap w-100 p-2 bg-nci-cyan-lightest border-b-2 border-r-2 border-l-2 rounded-lg rounded-t-none border-nci-gray-lighter">
          {
            Object.keys(filters.root).map((k) => {
              return convertFilterToComponent(filters.root[k]);
            })}

        </div>
      </CollapsibleContainer>
    );
};





