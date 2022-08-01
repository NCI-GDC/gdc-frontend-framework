import React, { useState, useEffect } from "react";
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
  usePrevious,
  selectFacetDefinitionsByName,
  useFacetDictionary,
  selectFacetDefinition,
} from "@gff/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import {
  Button,
  UnstyledButton,
  LoadingOverlay,
  Modal,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { getFacetInfo } from "@/features/cohortBuilder/utils";
import {
  MdLibraryAdd as AddFacetIcon,
  MdAdd as AddAdditionalIcon,
} from "react-icons/md";
import FacetSelection from "@/components/FacetSelection";
import isEqual from "lodash/isEqual";

const CustomFacetWhenEmptyGroup = tw(Stack)`
h-64 
bg-nci-gray-lightest 
w-1/2 
border-2 
border-dotted
`;

const AddFacetPanel = () => {
  return (
    <UnstyledButton className="h-48 bg-nci-gray-lightest flex flex-row justify-center align-middle items-center">
      <AddAdditionalIcon />
      <div> Add A Custom Filter</div>
    </UnstyledButton>
  );
};

const createFacets = (
  facets: ReadonlyArray<FacetDefinition>,
  docType: GQLDocType,
  indexType: GQLIndexType,
  dismissCallback: (string) => void = undefined,
  hideIfEmpty = false,
) => {
  return facets.map((x, index) => {
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
      ["year", "years", "age", "numeric", "integer", "percent"].includes(
        x.facet_type,
      )
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
    if (x.facet_type === "add_facet") {
      console.log("add_facet");
      return <AddFacetPanel />;
    }
  });
};

type FacetGroupProps = {
  children?: React.ReactNode;
};

export const FacetGroup: React.FC<FacetGroupProps> = ({
  children,
}: FacetGroupProps) => {
  return (
    <div className="flex flex-col w-screen/1.5 bg-white overflow-y-scroll overflow-x-clip">
      <ResponsiveMasonry columnsCountBreakPoints={{ 640: 3, 1400: 3 }}>
        <Masonry gutter="0.5em" className="m-4">
          {children}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

const CustomFacetGroup = (): JSX.Element => {
  const customConfig = useCoreSelector((state) =>
    selectCohortBuilderConfigCategory(state, "custom"),
  );
  const prevCustomFacets = usePrevious(customConfig.facets);
  const [customFacetDefinitions, setCustomFacetDefinitions] = useState<
    ReadonlyArray<FacetDefinition>
  >([]);
  const [opened, setOpened] = useState(false);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();

  const coreDispatch = useCoreDispatch();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, customConfig.facets),
  );

  // rebuild customFacets
  useEffect(() => {
    if (isDictionaryReady && !isEqual(prevCustomFacets, customConfig.facets)) {
      setCustomFacetDefinitions(facets);
    }
  }, [customConfig.facets, facets, isDictionaryReady, prevCustomFacets]);

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

  // handle the empty case
  return (
    <div className="flex flex-col w-screen/1.5 bg-white overflow-y-scroll overflow-x-clip">
      <LoadingOverlay visible={!isDictionaryReady} />
      <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
        <FacetSelection
          title={"Add Cohort Filter"}
          facetType="cases"
          handleFilterSelected={handleFilterSelected}
          usedFacetsSelector={selectCohortBuilderConfigFilters}
        />
      </Modal>
      {customFacetDefinitions.length == 0 ? (
        <CustomFacetWhenEmptyGroup align="center" justify="center">
          <AddFacetIcon></AddFacetIcon>
          <Text>No Custom Facets Added</Text>
          <Button onClick={() => setOpened(true)}>Add Custom Facet</Button>
        </CustomFacetWhenEmptyGroup>
      ) : (
        <FacetGroup>
          <UnstyledButton
            className="h-48 bg-nci-gray-lightest flex flex-row justify-center align-middle items-center"
            onClick={() => setOpened(true)}
          >
            <AddAdditionalIcon />
            <div> Add A Custom Filter</div>
          </UnstyledButton>
          {createFacets(
            customFacetDefinitions,
            "cases",
            customConfig.index as GQLIndexType,
            handleRemoveFilter,
          )}
        </FacetGroup>
      )}
    </div>
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
                <FacetGroup>
                  {createFacets(
                    getFacetInfo(tabEntry.facets),
                    tabEntry.docType as GQLDocType,
                    tabEntry.index as GQLIndexType,
                  )}
                </FacetGroup>
              )}
            </Tabs.Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FacetTabs;
