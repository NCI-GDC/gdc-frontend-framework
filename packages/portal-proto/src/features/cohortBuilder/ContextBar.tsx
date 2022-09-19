import React, { useState } from "react";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { Menu, Tabs, Divider } from "@mantine/core";
import { ContextualCasesView } from "../cases/CasesView";
import CountButton from "./CountButton";
import { convertFilterToComponent } from "./QueryRepresentation";
import {
  CohortGroupProps,
  CohortBar,
  useCohortFacetFilters,
} from "./CohortGroup";

import {
  MdDownload as DownloadIcon,
  MdInsertChartOutlined as SummaryChartIcon,
  MdOutlineViewComfy as TableIcon,
  MdFileCopy as FilesIcon,
} from "react-icons/md";
import {
  FaCartPlus as AddToCartIcon,
  FaUndo as UndoIcon,
} from "react-icons/fa";

import SummaryFacets, { SummaryFacetInfo } from "./SummaryFacets";
import { updateEnumFilters } from "../facets/hooks";
import {
  useCoreDispatch,
  clearCohortFilters,
  setCurrentCohort,
} from "@gff/core";
import { SecondaryTabStyle } from "@/features/cohortBuilder/style";
import FunctionButton from "@/components/FunctionButton";

const ContextBar: React.FC<CohortGroupProps> = ({
  cohorts,
}: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
    setCohort(idx);
  };

  const coreDispatch = useCoreDispatch();

  const setCohort = (idx: number) => {
    coreDispatch(setCurrentCohort(cohorts[idx].name));

    if (cohorts[idx].facets) {
      if (cohorts[idx].facets.length == 0) {
        coreDispatch(clearCohortFilters());
      } else {
        cohorts[idx].facets.map((x) => {
          updateEnumFilters(x.value, x.field, coreDispatch);
        });
      }
    }
  };

  // TODO: move this to a configuration files or slice
  const [summaryFields] = useState([
    {
      field: "cases.primary_site",
      name: "Primary Site",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.disease_type",
      name: "Disease Type",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.project.project_id",
      name: "Project",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.project.program.name",
      name: "Program Name",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.demographic.gender",
      name: "Gender",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.demographic.race",
      name: "Race",
      docType: "cases",
      indexType: "repository",
    },
  ] as ReadonlyArray<SummaryFacetInfo>);

  const filters = useCohortFacetFilters();

  const CohortBarWithProps = () => (
    <CohortBar
      // TODO: need to connect to cohort persistence
      // eslint-disable-next-line react/prop-types
      cohort_names={cohorts.map((o) => o.name)}
      onSelectionChanged={handleCohortSelection}
      defaultIdx={currentIndex}
    />
  );

  const clearAllFilters = () => {
    coreDispatch(clearCohortFilters());
  };

  return (
    <div
      className="mb-2 font-heading bg-base-lightest flex flex-col"
      data-tour="context_bar"
    >
      <CollapsibleContainer
        Top={CohortBarWithProps}
        isCollapsed={isGroupCollapsed}
        toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
      >
        <div className="flex flex-col ">
          <div className="relative p-2">
            <div className="flex flex-row absolute ml-2">
              <Menu>
                <Menu.Target>
                  <FunctionButton>
                    <DownloadIcon size="1.5rem" />
                    <CountButton
                      countName="fileCounts"
                      label="Files"
                      className="px-2"
                    />
                  </FunctionButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<AddToCartIcon size="1.5rem" />}>
                    Add to Cart
                  </Menu.Item>
                  <Menu.Item icon={<DownloadIcon size="1.5rem" />}>
                    Download Manifest
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu>
                <Menu.Target>
                  <FunctionButton className="ml-2">
                    <FilesIcon size="1.5rem" className="mr-1" /> Metadata
                  </FunctionButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Biospecimen</Menu.Item>
                  <Menu.Item>Clinical</Menu.Item>
                  <Menu.Item>Sample Sheet</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            <Tabs
              classNames={{
                tab: SecondaryTabStyle,
                tabsList: "px-2 mb-4 border-0",
                root: "border-0",
              }}
              data-tour="cohort_summary"
              defaultValue="summary"
            >
              <Tabs.List position="right">
                <Tabs.Tab
                  data-tour="cohort_summary_charts"
                  value="summary"
                  icon={<SummaryChartIcon size="1.5rem" />}
                >
                  Summary View
                </Tabs.Tab>

                <Tabs.Tab
                  data-tour="cohort_summary_table"
                  value="table"
                  icon={<TableIcon size="1.5rem" />}
                >
                  Table View
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="summary">
                <SummaryFacets fields={summaryFields} />{" "}
              </Tabs.Panel>
              <Tabs.Panel value={"table"}>
                <ContextualCasesView />
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </CollapsibleContainer>
      <div className="flex items-center bg-primary-lightest shadow border-y-1 border-primary-lighter h-20 ml-2 my-2 mr-1">
        <CountButton
          countName="casesMax"
          label="CASES"
          className="text-primary-contrast-lightest pl-4"
          bold
        />
        <Divider
          orientation="vertical"
          my="md"
          className="m-2 h-[80%] border-accent-darkest"
        />

        {Object.keys(filters.root).length !== 0 ? (
          <div className="flex flex-row items-center w-full">
            <div className="flex flex-row flex-wrap w-100 p-2 gap-y-1 ">
              {Object.keys(filters.root).map((k) => {
                return convertFilterToComponent(filters.root[k]);
              })}
            </div>
            <button
              className="hover:text-primary-darkest text-primary-contrast-lightest font-bold py-2 px-1 rounded ml-auto mr-4 "
              onClick={clearAllFilters}
            >
              <UndoIcon size="1.15em" color="secondary" />
            </button>
          </div>
        ) : (
          <span className="text-lg text-primary-darkest ">
            Currently viewing all cases in the GDC. Further refine your cohort
            with tools such as the Cohort Builder.
          </span>
        )}
      </div>
    </div>
  );
};

export default ContextBar;
