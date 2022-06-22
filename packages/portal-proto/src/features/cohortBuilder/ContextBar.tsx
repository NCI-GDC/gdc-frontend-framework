import React, { useState } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";
import { Button, Menu, Tabs, Divider } from "@mantine/core";
import { ContextualCasesTableView } from "../cases/CasesTableView";
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
import * as tailwindConfig from "../../../tailwind.config";

const ContextBar: React.FC<CohortGroupProps> = ({
  cohorts,
}: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
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
          updateEnumFilters(coreDispatch, x.value, x.field);
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

  const buttonStyle =
    "bg-white text-nci-blue-darkest border border-solid border-nci-blue-darkest h-12 hover:bg-nci-blue hover:text-white hover:border-nci-blue";
  const tabStyle = `${buttonStyle} rounded-md first:border-r-0 last:border-l-0 first:rounded-r-none last:rounded-l-none hover:border-nci-blue-darkest`;

  const clearAllFilters = () => {
    coreDispatch(clearCohortFilters());
  };

  return (
    <div className="mb-2 font-montserrat" data-tour="context_bar">
      <CollapsibleContainer
        Top={CohortBarWithProps}
        isCollapsed={isGroupCollapsed}
        toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
      >
        <div className="flex flex-col bg-nci-gray-lightest">
          <div className="flex items-center bg-nci-blue-lightest h-20 mb-6">
            <CountButton
              countName="casesMax"
              label="CASES"
              className="text-nci-blue-darkest pl-4"
              bold
            />
            <Divider
              orientation="vertical"
              my="md"
              className="m-2 h-[80%] border-nci-blue-darkest"
            />

            {Object.keys(filters.root).length !== 0 ? (
              <div className="flex flex-row items-center w-full">
                <div className="flex flex-row flex-wrap w-100 p-2 ">
                  {Object.keys(filters.root).map((k) => {
                    return convertFilterToComponent(filters.root[k]);
                  })}
                </div>
                <button
                  className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded ml-auto mr-4 "
                  onClick={clearAllFilters}
                >
                  <UndoIcon
                    size="1.15em"
                    color={
                      tailwindConfig.theme.extend.colors["gdc-blue"].darker
                    }
                  />
                </button>
              </div>
            ) : (
              <span className="text-lg text-nci-blue-darkest ">
                Currently viewing all cases in the GDC. Further refine your
                cohort with tools such as the Cohort Builder.
              </span>
            )}
          </div>
          <div className="relative p-2">
            <div className="flex flex-row absolute ml-2">
              <Menu
                control={
                  <Button className={buttonStyle}>
                    <DownloadIcon size="1.5rem" />
                    <CountButton
                      countName="fileCounts"
                      label="Files"
                      className="px-2"
                    />
                  </Button>
                }
              >
                <Menu.Item icon={<AddToCartIcon size="1.5rem" />}>
                  Add to Cart
                </Menu.Item>
                <Menu.Item icon={<DownloadIcon size="1.5rem" />}>
                  Download Manifest
                </Menu.Item>
              </Menu>
              <Menu
                control={
                  <Button className={`ml-2 ${buttonStyle}`}>
                    <FilesIcon size="1.5rem" className="mr-1" /> Metadata
                  </Button>
                }
              >
                <Menu.Item>Biospecimen</Menu.Item>
                <Menu.Item>Clinical</Menu.Item>
                <Menu.Item>Sample Sheet</Menu.Item>
              </Menu>
            </div>
            <Tabs
              position="right"
              variant="unstyled"
              data-tour="cohort_summary"
              classNames={{
                tabActive: "!bg-nci-blue-darkest !text-white",
                tabControl: tabStyle,
                body: "py-8 px-2",
              }}
            >
              <Tabs.Tab
                data-tour="cohort_summary_charts"
                label="Summary View"
                icon={<SummaryChartIcon size="1.5rem" />}
              >
                <SummaryFacets fields={summaryFields} />
              </Tabs.Tab>
              <Tabs.Tab
                data-tour="cohort_summary_table"
                label="Table View"
                icon={<TableIcon size="1.5rem" />}
              >
                <div className="bg-secondary">
                  <ContextualCasesTableView />
                </div>
              </Tabs.Tab>
            </Tabs>
          </div>
        </div>
      </CollapsibleContainer>
    </div>
  );
};

export default ContextBar;
