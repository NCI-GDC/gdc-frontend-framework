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
} from "@gff/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import {
  Button,
  Center,
  LoadingOverlay,
  Modal,
  Stack,
  Tabs,
  TabsProps,
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
bg-base-lightest 
w-1/2 
border-2 
border-dotted
m-6
`;

const StyledFacetTabs = (props: TabsProps) => {
  return (
    <Tabs
      unstyled
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
          cursor: "pointer",
          fontSize: theme.fontSizes.md,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderTopLeftRadius: theme.radius.md,
          borderBottomLeftRadius: theme.radius.md,

          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },
        },
        root: {
          display: "flex",
          flexDirection: "row",
        },
        panel: {
          backgroundColor: theme.colors.base[0],
        },
        tabIcon: {
          marginRight: theme.spacing.xs,
          display: "flex",
          alignItems: "center",
        },
      })}
      {...props}
    />
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
      [
        "year",
        "years",
        "age",
        "days",
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
  });
};

type FacetGroupProps = {
  children?: React.ReactNode;
};

export const FacetGroup: React.FC<FacetGroupProps> = ({
  children,
}: FacetGroupProps) => {
  return (
    <div className="flex flex-col w-screen/1.5 bg-base-max pr-6 overflow-x-clip">
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
  const cohortBuilderFilters = useCoreSelector((state) =>
    selectCohortBuilderConfigFilters(state),
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

  // handle the case where there are no custom filters
  return (
    <div className="flex flex-col w-screen/1.5 h-full bg-base-max pr-6 overflow-x-clip">
      <LoadingOverlay visible={!isDictionaryReady} />
      <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
        <FacetSelection
          title={"Add Cohort Filter"}
          facetType="cases"
          handleFilterSelected={handleFilterSelected}
          usedFacets={cohortBuilderFilters}
        />
      </Modal>
      {customFacetDefinitions.length == 0 ? (
        <Center>
          <CustomFacetWhenEmptyGroup align="center" justify="center">
            <AddFacetIcon
              className="text-primary-content"
              size="3em"
            ></AddFacetIcon>
            <Text
              size="md"
              weight={700}
              className="text-primary-content-darker"
            >
              No custom filters added
            </Text>
            <Button
              variant="outline"
              onClick={() => setOpened(true)}
              aria-label="Add Custom Filter"
              className="bg-base-lightest text-primary-content-darker"
            >
              Add Custom Facet
            </Button>
          </CustomFacetWhenEmptyGroup>
        </Center>
      ) : (
        <FacetGroup>
          <Button
            variant="outline"
            className="h-48 bg-base-lightest flex flex-row justify-center align-middle items-center border-base-darker b-2 border-dotted"
            onClick={() => setOpened(true)}
          >
            <AddAdditionalIcon className="text-primary-content" size="2em" />
            <Text
              size="md"
              weight={700}
              className="text-primary-content-darker"
            >
              {" "}
              Add a Custom Filter
            </Text>
          </Button>
          {createFacets(
            customFacetDefinitions,
            "cases", // Cohort custom filter restricted to "cases"
            customConfig.index as GQLIndexType,
            handleRemoveFilter,
          )}
        </FacetGroup>
      )}
    </div>
  );
};

export const FacetTabs = (): JSX.Element => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );
  return (
    <div className="w-100">
      <StyledFacetTabs
        orientation="vertical"
        defaultValue={tabsConfig[Object.keys(tabsConfig)[0]].label}
        classNames={{
          tab: "data-active:text-primary-content-darkest text-primary-content-lightest font-medium data-active:border-primary-darker data-active:border-l-1 data-active:border-t-1 data-active:border-b-1 data-active:bg-base-max hover:bg-primary-darker",
          tabsList:
            "flex flex-col bg-primary-dark text-primary-content-max w-[240px] ",
          root: "bg-base-max",
        }}
      >
        <Tabs.List>
          {Object.values(tabsConfig).map((tabEntry: CohortBuilderCategory) => {
            return (
              <Tabs.Tab
                key={`cohortTab-${tabEntry.label}`}
                value={tabEntry.label}
              >
                {tabEntry.label}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {Object.values(tabsConfig).map((tabEntry: CohortBuilderCategory) => {
          return (
            <Tabs.Panel
              key={`cohortTab-${tabEntry.label}`}
              value={tabEntry.label}
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
            </Tabs.Panel>
          );
        })}
      </StyledFacetTabs>
    </div>
  );
};
