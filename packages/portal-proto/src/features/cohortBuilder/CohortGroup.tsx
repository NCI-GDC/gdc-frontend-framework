/* eslint-disable */
// TODO need to revisit this file for more changes to fix eslint issues
import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { NativeSelect } from "@mantine/core";
import {
  MdArrowDropDown as DropDownIcon,
  MdClose as ClearIcon,
} from "react-icons/md";

import {
  FilterSet,
  selectCurrentCohortFilterSet,
  useCoreSelector,
  selectAvailableCohorts,
} from "@gff/core";
import { convertFilterToComponent } from "./QueryRepresentation";
import CohortManager from "@/features/cohortBuilder/CohortManager";

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
  const [groupType, setGroupType] = useState(menu_items[0]);

  const handleChange = (value) => {
    setGroupType(value);
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

interface FacetElementProp {
  readonly filter: Record<string, any>;
}

const CohortFacetElement: React.FC<FacetElementProp> = ({
  filter,
}: FacetElementProp) => {
  const { name, op, value } = filter;
  const [, setGroupTop] = useState(op);

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

export const useCohortFacetFilters = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilterSet(state));
};

export const CohortGroup: React.FC = () => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(undefined);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
  };

  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const filters = useCohortFacetFilters();
  // eslint-disable-next-line react/prop-types
  const CohortBarWithProps = () => (
    <CohortManager
      cohorts={cohorts}
      onSelectionChanged={handleCohortSelection}
      startingId={currentIndex}
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
