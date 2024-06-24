import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import tw from "tailwind-styled-components";
import {
  addFilterToCohortBuilder,
  CohortBuilderCategoryConfig,
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
import { getFacetInfo, trial_facets } from "@/features/cohortBuilder/utils";
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
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
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
          width: "100%",
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
      className="bg-base-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-content gap-4 m-4"
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
    coreDispatch(addFilterToCohortBuilder({ facetName: filter }));
  };

  const handleRemoveFilter = (filter: string) => {
    coreDispatch(removeFilterFromCohortBuilder({ facetName: filter }));
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
    <div className="flex flex-colw-full h-full bg-base-max pr-6">
      <LoadingOverlay
        data-testid="loading-spinner"
        visible={!isDictionaryReady}
      />
      <Modal
        data-testid="modal-cohort-builder-add-custom-filter"
        size="xl"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add a Custom Filter"
      >
        <div className="p-4">
          <FacetSelection
            facetType="cases"
            handleFilterSelected={handleFilterSelected}
            usedFacets={cohortBuilderFilters}
          />
        </div>
      </Modal>
      <div className="w-full">
        {customFacetDefinitions.length == 0 ? (
          <Flex justify="center" align="center" className="h-full">
            <CustomFacetWhenEmptyGroup align="center" justify="center">
              <AddFacetIcon
                className="text-primary-content"
                size="3em"
              ></AddFacetIcon>
              <Text size="md" className="text-primary-content-darker font-bold">
                No custom filters added
              </Text>
              <Button
                data-testid="button-cohort-builder-add-a-custom-filter"
                variant="outline"
                onClick={() => setOpened(true)}
                aria-label="Add a Custom Filter"
                className="bg-base-max text-primary border-primary"
              >
                Add a Custom Filter
              </Button>
            </CustomFacetWhenEmptyGroup>
          </Flex>
        ) : (
          <FacetGroup
            indexType={customConfig.index as GQLIndexType}
            docType="cases"
            facets={customFacetDefinitions}
          >
            <Button
              data-testid="button-cohort-builder-add-a-custom-filter"
              variant="outline"
              className="h-48 bg-base-max flex justify-center align-middle items-center border-base-darker b-2 border-dotted"
              onClick={() => setOpened(true)}
            >
              <AddAdditionalIcon
                className="text-primary-contrast-lightest"
                size="2em"
              />
              <Text
                size="md"
                className="text-primary-contrast-lightest font-bold"
              >
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
    </div>
  );
};

export const FacetTabs = (): JSX.Element => {
  const tabsConfig = useCoreSelector(
    (state) => selectCohortBuilderConfig(state),
    isEqual,
  );
  const router = useRouter();
  const routerTab = router?.query?.tab;
  const prevRouterTab = usePrevious(routerTab);
  const facets =
    useCoreSelector((state) => selectFacetDefinition(state)).data || {};
  // console.log({ facets });
  const [activeTab, setActiveTab] = useState(
    routerTab ? (routerTab as string) : Object.keys(tabsConfig)[0],
  );

  useEffect(() => {
    // Check if the change was initiated by the router
    if (routerTab !== prevRouterTab) {
      setActiveTab(routerTab as string);
    } else {
      // Change initiated by user interaction
      if (activeTab !== routerTab) {
        router.push({ query: { ...router.query, tab: activeTab } }, undefined, {
          scroll: false,
        });
      }
    }
    // https://github.com/vercel/next.js/discussions/29403#discussioncomment-1908563
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, routerTab, prevRouterTab]);

  // console.log({ tabsConfig });
  return (
    <div className="w-100">
      <StyledFacetTabs
        orientation="vertical"
        value={activeTab}
        onChange={setActiveTab}
        keepMounted={false}
        classNames={{
          tab: "pl-0 data-active:pl-4 ml-4 data-active:text-primary-content-darkest data-active:border-primary-darkest data-active:border-accent-vivid data-active:border-l-4 data-active:bg-base-max data-active:font-bold sm:w-44 md:w-60 lg:w-80 text-primary-content-darkest font-medium hover:pl-4 hover:bg-accent-vivid hover:text-primary-contrast-min my-1",
          list: "flex flex-col bg-primary-lightest text-primary-contrast-dark sm:w-50 md:w-60 lg:w-72 py-4",
          tabLabel: "text-left",
          root: "bg-base-max",
        }}
      >
        <Tabs.List>
          {Object.entries(tabsConfig).map(
            ([key, tabEntry]: [string, CohortBuilderCategoryConfig]) => {
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
          ([key, tabEntry]: [string, CohortBuilderCategoryConfig]) => {
            const facetList =
              key === "custom"
                ? []
                : getFacetInfo(tabEntry.facets, { ...facets, ...trial_facets });
            return (
              <Tabs.Panel key={key} value={key}>
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
