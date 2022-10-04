/* eslint-disable */
// TODO need to revisit this file for more changes to fix eslint issues
import { useEffect } from "react";
import { useCallback, useState } from "react";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { Button, NativeSelect, Select } from "@mantine/core";
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
import tw from "tailwind-styled-components";
import {
  FilterSet,
  Operation,
  selectCurrentCohortFilters,
  useCoreSelector,
  selectAvailableCohorts,
  useCoreDispatch,
  addNewCohort,
  selectCurrentCohort,
  DEFAULT_COHORT_ID,
} from "@gff/core";
import { convertFilterToComponent } from "./QueryRepresentation";
import { CohortBarProps } from "@/features/cohortBuilder/types";

const CohortGroupButton = tw(Button)`
p-2
bg-base-lightest
transition-colors
text-primary-content-darkest
hover:bg-primary
hover:text-primary-content-lightest
`;

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
        className="border-base-light w-36"
        onChange={handleChange}
      />
    </div>
  );
};

// TODO: Move this to it's own component.
export const CohortBar: React.FC<CohortBarProps> = ({
  cohorts,
  onSelectionChanged,
  defaultId,
  hide_controls = false,
}: CohortBarProps) => {
  const menu_items = cohorts.map((x) => {
    return { value: x.id, label: x.name };
  });
  const coreDispatch = useCoreDispatch();
  const cohortName = useCoreSelector((state) => selectCurrentCohort(state));
  const newCohort = useCallback(() => {
    // TODO: replace with other UUID function
    const newId = `${nanoid()}`;
    coreDispatch(addNewCohort(newId));
    onSelectionChanged(newId);
  }, []);

  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 pl-4 h-20 shadow-lg bg-primary-darkest"
    >
      <div className="border-opacity-0">
        {!hide_controls ? (
          <Select
            data={menu_items}
            searchable
            clearable={false}
            value={defaultId}
            onChange={(x) => {
              onSelectionChanged(x);
            }}
            className="border-base-light w-80 p-0 z-10 "
            aria-items-centerlabel="Select cohort"
          />
        ) : (
          <div>
            <h2>{cohortName}</h2>
          </div>
        )}
      </div>
      {!hide_controls ? (
        <>
          <CohortGroupButton>
            <SaveIcon size="1.5em" aria-label="Save cohort" />
          </CohortGroupButton>
          <CohortGroupButton onClick={() => newCohort()}>
            <AddIcon size="1.5em" aria-label="Add cohort" />
          </CohortGroupButton>
          <CohortGroupButton>
            <DeleteIcon size="1.5em" aria-label="Delete cohort" />
          </CohortGroupButton>
          <CohortGroupButton>
            <UploadIcon size="1.5em" aria-label="Upload cohort" />
          </CohortGroupButton>
          <CohortGroupButton>
            <DownloadIcon size="1.5em" aria-label="Download cohort" />
          </CohortGroupButton>
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
    <div className="m-1 px-2 rounded-full bg-base-lighter text-primary-content-darker border-base-light border-2">
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

export const useCohortFacetFilters = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

export const CohortGroup: React.FC = () => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(DEFAULT_COHORT_ID);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
  };

  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const filters = useCohortFacetFilters();
  // eslint-disable-next-line react/prop-types
  const CohortBarWithProps = () => (
    <CohortBar
      cohorts={cohorts}
      onSelectionChanged={handleCohortSelection}
      defaultId={currentIndex}
    />
  );
  return (
    <CollapsibleContainer
      Top={CohortBarWithProps}
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
    >
      <div className="flex flex-row flex-wrap w-100 p-2 bg-base-lightest ">
        {Object.keys(filters.root).map((k) => {
          return convertFilterToComponent(filters.root[k]);
        })}
      </div>
    </CollapsibleContainer>
  );
};
