import React, { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import tw from "tailwind-styled-components";
import {
  GQLIndexType,
  GQLDocType,
  selectCohortBuilderConfig,
  useCoreSelector,
  FacetDefinition,
  CohortBuilderCategory,
  addFilterToCohortBuilder,
  removeFilterFromCohortBuilder,
  selectCohortBuilderConfigCategory,
  selectCohortBuilderConfigFilters,
  useCoreDispatch,
  selectFacetDefinitionsByName,
} from "@gff/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import { Button, Modal, Stack, Tabs, Text } from "@mantine/core";
import { getFacetInfo } from "@/features/cohortBuilder/utils";
import { MdLibraryAdd as AddFacetIcon } from "react-icons/md";
import FacetSelection from "@/components/FacetSelection";

export const CustomFacetWhenEmptyGroup = tw(Stack)`
h-64 
bg-nci-gray-lightest 
w-1/2 
border-2 
border-dotted
`;

interface FacetGroupProps {
  readonly facets: ReadonlyArray<FacetDefinition>;
  readonly indexType?: GQLIndexType;
  readonly docType: GQLDocType;
  readonly dismissCallback?: (string) => void;
  readonly hideIfEmpty?: boolean;
}

export const FacetGroup: React.FC<FacetGroupProps> = ({
  facets,
  docType,
  indexType = "explore",
  dismissCallback = undefined,
  hideIfEmpty = false,
}: FacetGroupProps) => {
  return (
    <div className="flex flex-col w-screen/1.5 bg-white overflow-y-scroll overflow-x-clip">
      <ResponsiveMasonry columnsCountBreakPoints={{ 640: 3, 1400: 3 }}>
        <Masonry gutter="0.5em" className="m-4">
          {facets.map((x, index) => {
            if (x.facet_type === "enum")
              return (
                <EnumFacet
                  key={`${x.full}-${index}`}
                  docType={docType}
                  indexType={indexType}
                  field={x.full}
                  description={x.description}
                  dismissCallback={dismissCallback}
                  hideIfEmpty={hideIfEmpty}
                />
              );
            if (
              [
                "year",
                "years",
                "age",
                "numeric",
                "integer",
                "percent",
              ].includes(x.facet_type)
            ) {
              return (
                <NumericRangeFacet
                  key={`${x.full}-${index}`}
                  field={x.full}
                  description={x.description}
                  rangeDatatype={x.facet_type}
                  docType={docType}
                  indexType={indexType}
                  minimum={x?.range?.minimum}
                  maximum={x?.range?.maximum}
                  dismissCallback={dismissCallback}
                  hideIfEmpty={hideIfEmpty}
                />
              );
            }
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

const CustomFacetGroup = (): JSX.Element => {
  const customConfig = useCoreSelector((state) =>
    selectCohortBuilderConfigCategory(state, "custom"),
  );
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, customConfig.facets),
  );
  const [opened, setOpened] = useState(false);
  const coreDispatch = useCoreDispatch();

  const handleFilterSelected = (filter: string) => {
    setOpened(false);
    coreDispatch(
      addFilterToCohortBuilder({ category: "custom", facetName: filter }),
    );
  };

  const handleRemoveFilter = (filter: string) => {
    coreDispatch(
      removeFilterFromCohortBuilder({ category: "custom", facetName: filter }),
    );
  };

  if (facets.length == 0) {
    // handle the empty case
    return (
      <div className="flex flex-col w-screen/1.5 bg-white overflow-y-scroll overflow-x-clip">
        <CustomFacetWhenEmptyGroup align="center" justify="center">
          <AddFacetIcon></AddFacetIcon>
          <Text>No Custom Facets Added</Text>
          <Button onClick={() => setOpened(true)}>Add Custom Facet</Button>
          <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
            <FacetSelection
              title={"Add Cohort Filter"}
              facetType="cases"
              handleFilterSelected={handleFilterSelected}
              usedFacetsSelector={selectCohortBuilderConfigFilters}
            />
          </Modal>
        </CustomFacetWhenEmptyGroup>
      </div>
    );
  } else
    return (
      <FacetGroup
        facets={facets}
        docType={"cases"}
        indexType={customConfig.index}
        dismissCallback={handleRemoveFilter}
      />
    );
};

export const FacetTabs = () => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );
  return (
    <div className="w-100">
      <Tabs
        variant="unstyled"
        orientation="vertical"
        classNames={{
          tabControl: "!font-medium !bg-nci-blue-dark !text-nci-gray-lightest",
          tabActive: "!bg-white !text-nci-gray-darkest",
          body: "!pl-0 !ml-0",
        }}
      >
        {Object.values(tabsConfig).map((tabEntry: CohortBuilderCategory) => {
          return (
            <Tabs.Tab
              key={`cohortTab-${tabEntry.label}`}
              label={tabEntry.label}
            >
              {" "}
              {tabEntry.label === "Custom" ? (
                <CustomFacetGroup />
              ) : (
                <FacetGroup
                  facets={getFacetInfo(tabEntry.facets)}
                  docType={tabEntry.docType as GQLDocType}
                  indexType={tabEntry.index as GQLIndexType}
                />
              )}
            </Tabs.Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FacetTabs;
