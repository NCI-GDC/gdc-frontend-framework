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
  selectCurrentCohortFilters,
  useCoreSelector,
} from "@gff/core";
import { convertFieldToName } from "../facets/utils";
import { convertFilterToComponent } from "./QueryRepresentation";
import CountButton from "./CountButton";

const enum_menu_items = [
  { value: "any_of", label: "includes at least one:" },
  { value: "all_of", label: "includes all:" },
  { value: "none_of", label: "excludes:" },
  { value: "between", label: "between" },
];

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
    "mx-1 bg-nci-gray-light hover:bg-nci-gray transition-colors";
  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start pl-4 h-12 shadow-lg bg-nci-gray-lighter rounded-lg rounded-b-none rounded-r-none"
    >
      <CountButton countName="casesMax" label="Cases" className="px-2 ml-20 " />
      <div className="border-opacity-0">
        {!hide_controls ? (
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
            aria-label="Select cohort"
          />
        ) : (
          <div>
            <h2>{currentCohort.label}</h2>
          </div>
        )}
      </div>
      {!hide_controls ? (
        <div className="flex flex-row items-center ml-auto">
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
        </div>
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
}

export const useCohortFacetFilters = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
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
          console.log(filters.root[k]);
          return convertFilterToComponent(filters.root[k]);
        })}
      </div>
    </CollapsibleContainer>
  );
};
