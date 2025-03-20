import React, { useState, useRef, useEffect } from "react";
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
import useScrollToHash from "@/common/useScrollToHash";
//import { getFacetInfo, upload_facets } from "@/features/cohortBuilder/utils";
import { AddFacetIcon, AddIcon } from "src/commonIcons";
import { DataFetchingResult } from "src/types";
import createFacetCards from "./CreateFacetCard";
import FacetSelection from "./FacetSelection";
import {
  FacetCardDefinition,
  FacetRequiredHooks,
  CohortBuilderCategoryConfig,
  FacetDefinition,
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
  readonly facets: FacetDefinition[];
  readonly usePopulateFacetData?: (
    facets: FacetDefinition[],
    queryOptions?: Record<string, string>,
  ) => void;
  readonly queryOptions?: Record<string, string>;
};

export const FacetGroup: React.FC<FacetGroupProps> = ({
  facets,
  children,
  usePopulateFacetData,
  queryOptions,
}: FacetGroupProps) => {
  usePopulateFacetData && usePopulateFacetData(facets, queryOptions);

  const availableFields = facets.map((f) => f.full);
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
  readonly customFacetHooks: {
    readonly useCustomFacets: () => DataFetchingResult<FacetDefinition[]>;
    readonly useAvailableCustomFacets: (onlyFiltersWithValues: boolean) => {
      data: Record<string, FacetDefinition>;
    };
    readonly useAddCustomFilter: () => (filter: string) => void;
    readonly useRemoveCustomFilter: () => (filter: string) => void;
  };
  readonly usePopulateFacetData?: (
    facets: FacetDefinition[],
    queryOptions?: Record<string, string>,
  ) => void;
  readonly queryOptions?: Record<string, string>;
  readonly getFacetLabel: (queryOptions?: Record<string, string>) => string;
  readonly cardScrollMargin?: number;
}

const CustomFacetGroup: React.FC<CustomFacetGroupProps> = ({
  hooks,
  customFacetHooks,
  usePopulateFacetData,
  queryOptions,
  getFacetLabel,
  cardScrollMargin,
}) => {
  const [opened, setOpened] = useState(false);
  const { data: customFacetDefinitions, isSuccess } =
    customFacetHooks.useCustomFacets();
  const addCustomFilter = customFacetHooks.useAddCustomFilter();
  const removeCustomFilter = customFacetHooks.useRemoveCustomFilter();

  const handleFilterSelected = (filter: string) => {
    setOpened(false);
    addCustomFilter(filter);
  };

  usePopulateFacetData &&
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
            useAvailableCustomFacets={customFacetHooks.useAvailableCustomFacets}
            handleFilterSelected={handleFilterSelected}
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
              valueLabel: getFacetLabel(queryOptions),
              facetNameSections: 2,
              queryOptions,
              dismissCallback: removeCustomFilter,
              cardScrollMargin,
            })}
          </FacetGroup>
        )}
      </div>
    </div>
  );
};

interface FacetTabProps {
  readonly hooks: FacetRequiredHooks;
  readonly facetDefinitions: Record<string, FacetDefinition>;
  readonly tabsConfig: Record<string, CohortBuilderCategoryConfig>;
  readonly customFacetHooks?: {
    readonly useCustomFacets: () => DataFetchingResult<FacetDefinition[]>;
    readonly useAvailableCustomFacets: (onlyFiltersWithValues: boolean) => {
      data: Record<string, FacetDefinition>;
    };
    readonly useAddCustomFilter: () => (filter: string) => void;
    readonly useRemoveCustomFilter: () => (filter: string) => void;
  };
  readonly usePopulateFacetData?: (
    facets: FacetDefinition[],
    queryOptions?: Record<string, string>,
  ) => void;
  readonly getFacetLabel: (queryOptions?: Record<string, string>) => string;
  readonly cardScrollMargin?: number;
  readonly Chart?: React.FC;
}

export const FacetTabs: React.FC<FacetTabProps> = ({
  hooks,
  facetDefinitions,
  tabsConfig,
  customFacetHooks,
  usePopulateFacetData,
  getFacetLabel,
  cardScrollMargin,
  Chart,
}) => {
  const fieldNameToTitle = hooks.useFieldNameToTitle();

  const searchParams = new URLSearchParams(window.location.search);
  const routerTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string | null>(
    routerTab ? (routerTab as string) : Object.keys(tabsConfig)[0],
  );
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
  }, [hash, searchTermParam]);

  return (
    <div className="w-100">
      <span
        id="facetTab-liveRegion"
        aria-live="assertive"
        ref={liveRegionRef}
        className="sr-only"
      />
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
                    usePopulateFacetData={usePopulateFacetData}
                    queryOptions={tabEntry.queryOptions}
                    getFacetLabel={getFacetLabel}
                    customFacetHooks={customFacetHooks}
                    cardScrollMargin={cardScrollMargin}
                  />
                ) : (
                  <FacetGroup
                    facets={facetList}
                    usePopulateFacetData={usePopulateFacetData}
                    queryOptions={tabEntry.queryOptions}
                  >
                    {createFacetCards({
                      facets: facetList as FacetCardDefinition[],
                      hooks,
                      idPrefix: "cohort-builder",
                      valueLabel: getFacetLabel(tabEntry.queryOptions),
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
    </div>
  );
};

export default FacetTabs;
