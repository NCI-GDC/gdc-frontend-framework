import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import tw from "tailwind-styled-components";
import {
  addFilterToCohortBuilder,
  CohortBuilderCategory,
  FacetDefinition,
  GQLDocType,
  GQLIndexType,
  removeFilterFromCohortBuilder,
  selectCohortBuilderConfig,
  selectCohortBuilderConfigCategory,
  selectCohortBuilderConfigFilters,
  selectFacetDefinitionsByName,
  useCoreDispatch,
  useCoreSelector,
  useFacetDictionary,
  usePrevious,
  selectFacetDefinition,
} from "@gff/core";
import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Tabs,
  TabsProps,
  Text,
} from "@mantine/core";
import { getFacetInfo } from "@/features/cohortBuilder/utils";
import {
  MdAdd as AddAdditionalIcon,
  MdLibraryAdd as AddFacetIcon,
} from "react-icons/md";
import isEqual from "lodash/isEqual";
import FacetSelection from "@/components/FacetSelection";
import { createFacetCardsFromList } from "@/features/facets/CreateFacetCard";
import {
  useClearFilters,
  useRangeFacet,
  useSelectFieldFilter,
  useTotalCounts,
  useUpdateFacetFilter,
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
  useEnumFacetValues,
  useEnumFacets,
} from "@/features/facets/hooks";
import { partial } from "lodash";

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
          fontFamily: theme.fontFamily,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderTopLeftRadius: theme.radius.sm,
          borderBottomLeftRadius: theme.radius.sm,

          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },
        },
        root: {
          display: "flex",
          flexDirection: "row",
          backgroundColor: theme.colors.base?.[0],
        },
        panel: {
          backgroundColor: theme.colors.base?.[0],
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

type FacetGroupProps = {
  children?: React.ReactNode;
  facets: ReadonlyArray<FacetDefinition>;
  indexType: GQLIndexType;
  docType: GQLDocType;
};

export const FacetGroup: React.FC<FacetGroupProps> = ({
  docType,
  indexType,
  facets,
  children,
}: FacetGroupProps) => {
  const enumFacets = facets.filter((x) => x.facet_type === "enum");

  useEnumFacets(
    docType,
    indexType,
    enumFacets.map((entry) => entry.full),
  );

  return (
    <div
      className="bg-base-max pr-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2"
      data-testid="title-cohort-builder-facet-groups"
    >
      {children}
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

  const customEnumFacets = customFacetDefinitions.filter(
    (x) => x.facet_type === "enum",
  );

  useEnumFacets(
    "cases",
    customConfig.index as GQLIndexType,
    customEnumFacets.map((entry) => entry.full),
  );

  // handle the case where there are no custom filters
  return (
    <div className="flex flex-col w-screen/1.5 h-full bg-base-max pr-6">
      <LoadingOverlay
        data-testid="loading-spinner"
        visible={!isDictionaryReady}
      />
      <Modal
        size="lg"
        opened={opened}
        onClose={() => setOpened(false)}
        zIndex={400}
      >
        <FacetSelection
          title="Add a Custom Filter"
          facetType="cases"
          handleFilterSelected={handleFilterSelected}
          usedFacets={cohortBuilderFilters}
        />
      </Modal>
      {customFacetDefinitions.length == 0 ? (
        <Flex>
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
              data-testid="button-cohort-builder-add-a-custom-filter"
              variant="outline"
              onClick={() => setOpened(true)}
              aria-label="Add a Custom Filter"
              className="bg-base-lightest text-base-contrast-lightest"
            >
              Add a Custom Filter
            </Button>
          </CustomFacetWhenEmptyGroup>
        </Flex>
      ) : (
        <FacetGroup
          indexType={customConfig.index as GQLIndexType}
          docType={"cases"}
          facets={customFacetDefinitions}
        >
          <Button
            data-testid="button-cohort-builder-add-a-custom-filter"
            variant="outline"
            className="h-48 bg-primary-lightest flex flex-row justify-center align-middle items-center border-base-darker b-2 border-dotted"
            onClick={() => setOpened(true)}
          >
            <AddAdditionalIcon
              className="text-primary-contrast-lightest"
              size="2em"
            />
            <Text
              size="md"
              weight={700}
              className="text-primary-contrast-lightest"
            >
              {" "}
              Add a Custom Filter
            </Text>
          </Button>
          {createFacetCardsFromList(
            customFacetDefinitions,
            {
              useGetEnumFacetData: partial(
                useEnumFacetValues,
                "cases",
                customConfig.index as GQLIndexType,
              ),
              useGetRangeFacetData: partial(
                useRangeFacet,
                "cases",
                customConfig.index,
              ),
              useGetFacetFilters: useSelectFieldFilter,
              useUpdateFacetFilters: useUpdateFacetFilter,
              useClearFilter: useClearFilters,
              useTotalCounts: partial(useTotalCounts, "caseCounts"),
            },
            "cohort-builder",
            FacetDocTypeToLabelsMap["cases"],
            handleRemoveFilter,
          )}
        </FacetGroup>
      )}
    </div>
  );
};

export const FacetTabs = (): JSX.Element => {
  const tabsConfig = useCoreSelector(
    (state) => selectCohortBuilderConfig(state),
    isEqual,
  );
  const router = useRouter();
  const facets =
    useCoreSelector((state) => selectFacetDefinition(state)).data || {};
  const [activeTab, setActiveTab] = useState(
    router?.query?.tab
      ? (router.query.tab as string)
      : Object.keys(tabsConfig)[0],
  );

  useEffect(() => {
    if (
      router !== null &&
      activeTab !== undefined &&
      activeTab !== router?.query?.tab
    ) {
      router.push({ query: { ...Router.query, tab: activeTab } }, undefined, {
        scroll: false,
      });
    }
    // https://github.com/vercel/next.js/discussions/29403#discussioncomment-1908563
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (router?.query?.tab && activeTab !== router.query.tab) {
      setActiveTab(router.query.tab as string);
    }
  }, [router?.query?.tab, activeTab, setActiveTab]);
  return (
    <div className="w-100 mt-2">
      <StyledFacetTabs
        orientation="vertical"
        value={activeTab}
        onTabChange={setActiveTab}
        keepMounted={false}
        classNames={{
          tab: "first:mt-2 last:mb-2 ml-2 sm:w-44 md:w-60 lg:w-80 data-active:text-primary-content-darkest data-active:border-primary-darkest text-primary-content-lightest font-medium data-active:border-primary-darker data-active:border-t-2 data-active:border-l-2 data-active:border-b-2 data-active:bg-base-max hover:bg-primary-darker active:shadow-lg",
          tabsList:
            "flex flex-col bg-primary-dark text-primary-contrast-dark w-64 border-r-2 border-primary-darkest",
          tabLabel: "text-left",
          root: "bg-base-max",
        }}
      >
        <Tabs.List>
          {Object.entries(tabsConfig).map(
            ([key, tabEntry]: [string, CohortBuilderCategory]) => {
              return (
                <Tabs.Tab
                  key={key}
                  value={key}
                  data-testid={
                    "button-cohort-builder-" +
                    tabEntry.label
                      .toLowerCase()
                      .replaceAll("_", "-")
                      .replaceAll(" ", "-")
                  }
                >
                  {tabEntry.label}
                </Tabs.Tab>
              );
            },
          )}
        </Tabs.List>
        {Object.entries(tabsConfig).map(
          ([key, tabEntry]: [string, CohortBuilderCategory]) => {
            const facetList =
              key === "custom" ? [] : getFacetInfo(tabEntry.facets, facets);
            return (
              <Tabs.Panel key={key} value={key}>
                {" "}
                {key === "custom" ? (
                  <CustomFacetGroup />
                ) : (
                  <FacetGroup
                    indexType={tabEntry.index as GQLIndexType}
                    docType={tabEntry.docType as GQLDocType}
                    facets={facetList}
                  >
                    {createFacetCardsFromList(
                      facetList,
                      {
                        useGetEnumFacetData: partial(
                          useEnumFacetValues,
                          tabEntry.docType as GQLDocType,
                          tabEntry.index as GQLIndexType,
                        ),
                        useGetRangeFacetData: partial(
                          useRangeFacet,
                          tabEntry.docType as GQLDocType,
                          tabEntry.index as GQLIndexType,
                        ),
                        useGetFacetFilters: useSelectFieldFilter,
                        useUpdateFacetFilters: useUpdateFacetFilter,
                        useClearFilter: useClearFilters,
                        useTotalCounts: partial(
                          useTotalCounts,
                          FacetDocTypeToCountsIndexMap[tabEntry.docType],
                        ),
                      },
                      "cohort-builder",
                      FacetDocTypeToLabelsMap[tabEntry.docType],
                      undefined,
                    )}
                  </FacetGroup>
                )}
              </Tabs.Panel>
            );
          },
        )}
      </StyledFacetTabs>
    </div>
  );
};

export default FacetTabs;
