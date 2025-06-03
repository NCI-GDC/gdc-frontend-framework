import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Button,
  Flex,
  LoadingOverlay,
  MantineProvider,
  Modal,
  Stack,
  Tabs,
  TabsProps,
  Text,
} from "@mantine/core";
import useScrollToHash from "@/common/useScrollToHash";
import { AppContext } from "src/context";
import { AddFacetIcon, AddIcon } from "src/commonIcons";
import createFacetCards from "./CreateFacetCard";
import FacetSelection from "./FacetSelection";
import {
  FacetCardDefinition,
  FacetRequiredHooks,
  CohortBuilderCategoryConfig,
  CustomFacetHooks,
  EnumChartProps,
  QueryOptions,
} from "./types";

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
  readonly children?: React.ReactNode;
  readonly facets: FacetCardDefinition[];
  readonly hooks: FacetRequiredHooks;
  readonly queryOptions?: QueryOptions;
};

export const FacetGroup: React.FC<FacetGroupProps> = ({
  facets,
  children,
  hooks,
  queryOptions,
}: FacetGroupProps) => {
  const { usePopulateFacetData = () => {} } = hooks;
  usePopulateFacetData(facets, queryOptions);

  const availableFields = facets.map((f) => f.field);
  useScrollToHash(availableFields, false);

  return (
    <div
      className="bg-base-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-content gap-4 m-4"
      data-testid="title-cohort-builder-facet-groups"
    >
      {children}
    </div>
  );
};

interface CustomFacetGroupProps {
  readonly hooks: FacetRequiredHooks;
  readonly customFacetHooks: CustomFacetHooks;
  readonly usedFacets: string[];
  readonly queryOptions?: QueryOptions;
  readonly getFacetLabel?: (queryOptions?: QueryOptions) => string;
  readonly cardScrollMargin?: number;
  readonly Chart?: React.FC<any>;
}

const CustomFacetGroup: React.FC<CustomFacetGroupProps> = ({
  hooks,
  customFacetHooks,
  queryOptions,
  getFacetLabel,
  cardScrollMargin,
  Chart,
  usedFacets,
}) => {
  const [opened, setOpened] = useState(false);
  const { data: customFacetDefinitions, isSuccess } =
    customFacetHooks.useCustomFacets();
  const addCustomFilter = customFacetHooks.useAddCustomFilter();
  const removeCustomFilter = customFacetHooks.useRemoveCustomFilter();
  const fieldNameToTitle = hooks.useFieldNameToTitle();
  const { usePopulateFacetData = () => {} } = hooks;

  const handleFilterSelected = (filter: string) => {
    setOpened(false);
    addCustomFilter(filter);
  };

  usePopulateFacetData(customFacetDefinitions, queryOptions);

  // handle the case where there are no custom filters
  return (
    <div className="flex flex-colw-full h-full bg-base-max pr-6">
      <LoadingOverlay data-testid="loading-spinner" visible={!isSuccess} />
      <Modal
        data-testid="modal-cohort-builder-add-custom-filter"
        size="xl"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add a Custom Filter"
      >
        <div className="p-4">
          <FacetSelection
            usedFacets={usedFacets}
            useAvailableCustomFacets={customFacetHooks.useAvailableCustomFacets}
            handleFilterSelected={handleFilterSelected}
            queryOptions={queryOptions}
          />
        </div>
      </Modal>
      <div className="w-full">
        {customFacetDefinitions.length == 0 ? (
          <Flex justify="center" align="center" className="h-full">
            <Stack
              align="center"
              justify="center"
              className="h-64 bg-base-lightest w-1/2 border-2 border-dotted m-6"
            >
              <AddFacetIcon className="text-primary-content" size="3em" />
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
            </Stack>
          </Flex>
        ) : (
          <FacetGroup
            facets={customFacetDefinitions}
            queryOptions={queryOptions}
            hooks={hooks}
          >
            <Button
              data-testid="button-cohort-builder-add-a-custom-filter"
              variant="outline"
              className="h-48 bg-base-max flex justify-center align-middle items-center border-base-darker b-2 border-dotted"
              onClick={() => setOpened(true)}
            >
              <AddIcon className="text-primary-contrast-lightest" size="2em" />
              <Text
                size="md"
                className="text-primary-contrast-lightest font-bold"
              >
                Add a Custom Filter
              </Text>
            </Button>
            {createFacetCards({
              facets: customFacetDefinitions as FacetCardDefinition[],
              hooks,
              idPrefix: "cohort-builder",
              valueLabel: getFacetLabel,
              facetNameFormatter: (field: string) => fieldNameToTitle(field, 2),
              queryOptions,
              dismissCallback: removeCustomFilter,
              cardScrollMargin,
              Chart,
            })}
          </FacetGroup>
        )}
      </div>
    </div>
  );
};

type FacetTabProps = {
  readonly activeTab: string;
  readonly setActiveTab: (tab: string | null) => void;
  readonly hooks: FacetRequiredHooks;
  readonly facetDefinitions: Record<string, FacetCardDefinition>;
  readonly tabsConfig: Record<string, CohortBuilderCategoryConfig>;
  readonly usedFacets: string[];
  readonly customFacetHooks?: CustomFacetHooks;
  readonly getFacetLabel?: (queryOptions?: QueryOptions) => string;
  readonly cardScrollMargin?: number;
  readonly Chart?: React.FC<EnumChartProps>;
};

/**
 * Component for rendering a tabbed facet selection view
 * @param activeTab - which tab is currently active
 * @param setActiveTab - function to set the active tab
 * @param hooks - Hooks for retrieving data, modifying cohort, etc for the various facet types
 * @param facetDefinitions - Description of facets and their properties
 * @param tabsConfig - Configuration for tab sections, which fields they contain and any additional fields needed to query data for that tab
 * @param customFacetHooks - Hooks for custom facet selection
 * @param getFacetLabel - Callback for determining the data label
 * @param cardScrollMargin - Scroll margin for cards, used for positioning cards on the page when scrolled to
 * @param Chart - Component for rendering a Chart view of the data
 */

export const FacetTabs: React.FC<FacetTabProps> = ({
  activeTab,
  setActiveTab,
  hooks,
  facetDefinitions,
  tabsConfig,
  usedFacets,
  customFacetHooks,
  getFacetLabel,
  cardScrollMargin,
  Chart,
}) => {
  const fieldNameToTitle = hooks.useFieldNameToTitle();
  const { theme } = useContext(AppContext);

  const searchParams = new URLSearchParams(window.location.search);
  const liveRegionRef = useRef<HTMLSpanElement>(null);

  const hash = window?.location?.hash.split("#")?.[1];
  const searchTermParam = searchParams.get("search");

  useEffect(() => {
    if (hash && searchTermParam) {
      const facetName = fieldNameToTitle(hash);
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = `Search applied. Focused on ${facetName}`;
      }
    }
  }, [hash, searchTermParam, fieldNameToTitle]);

  const firstEntry = Object.values(tabsConfig)[0];
  const firstFacetList = firstEntry?.facets
    .map((field) => facetDefinitions[field])
    .filter((facet) => facet);

  return (
    <MantineProvider theme={theme}>
      <div className="w-100">
        <span
          id="facetTab-liveRegion"
          aria-live="assertive"
          ref={liveRegionRef}
          className="sr-only"
        />
        {Object.entries(tabsConfig).length === 1 ? (
          Object.keys(tabsConfig)[0] === "custom" && customFacetHooks ? (
            <CustomFacetGroup
              hooks={hooks}
              queryOptions={firstEntry.queryOptions}
              getFacetLabel={getFacetLabel}
              customFacetHooks={customFacetHooks}
              cardScrollMargin={cardScrollMargin}
              Chart={Chart}
              usedFacets={usedFacets}
            />
          ) : (
            <FacetGroup
              facets={firstFacetList}
              hooks={hooks}
              queryOptions={firstEntry.queryOptions}
            >
              {createFacetCards({
                facets: firstFacetList,
                facetNameFormatter: (field: string) => fieldNameToTitle(field),
                hooks,
                idPrefix: "cohort-builder",
                valueLabel: getFacetLabel
                  ? getFacetLabel(firstEntry.queryOptions)
                  : undefined,
                queryOptions: firstEntry.queryOptions,
                cardScrollMargin,
                Chart,
              })}
            </FacetGroup>
          )
        ) : (
          <StyledFacetTabs
            orientation="vertical"
            value={activeTab}
            onChange={setActiveTab}
            keepMounted={false}
            classNames={{
              tab: "pl-0 data-active:pl-4 ml-4 data-active:text-primary-content-darkest data-active:border-primary-darkest data-active:border-accent-vivid data-active:border-l-4 data-active:bg-base-max data-active:font-bold sm:w-44 md:w-60 lg:w-80 text-primary-content-darkest font-medium hover:pl-4 hover:bg-accent-vivid hover:text-primary-contrast-min my-1",
              list: "flex flex-col bg-primary-lightest text-primary-contrast-dark w-60 md:w-72 lg:w-80 py-4",
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
                    : tabEntry.facets
                        .map((field) => facetDefinitions[field])
                        .filter((facet) => facet);
                return (
                  <Tabs.Panel key={key} value={key}>
                    {key === "custom" && customFacetHooks ? (
                      <CustomFacetGroup
                        hooks={hooks}
                        queryOptions={tabEntry.queryOptions}
                        getFacetLabel={getFacetLabel}
                        customFacetHooks={customFacetHooks}
                        cardScrollMargin={cardScrollMargin}
                        Chart={Chart}
                        usedFacets={usedFacets}
                      />
                    ) : (
                      <FacetGroup
                        facets={facetList}
                        hooks={hooks}
                        queryOptions={tabEntry.queryOptions}
                      >
                        {createFacetCards({
                          facets: facetList,
                          facetNameFormatter: (field: string) =>
                            fieldNameToTitle(field),
                          hooks,
                          idPrefix: "cohort-builder",
                          valueLabel: getFacetLabel,
                          queryOptions: tabEntry.queryOptions,
                          cardScrollMargin,
                          Chart,
                        })}
                      </FacetGroup>
                    )}
                  </Tabs.Panel>
                );
              },
            )}
          </StyledFacetTabs>
        )}
      </div>
    </MantineProvider>
  );
};

export default FacetTabs;
