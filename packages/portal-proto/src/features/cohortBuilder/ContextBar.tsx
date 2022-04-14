import { useState } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";
import { Button, Menu, Tabs } from '@mantine/core';
import { ContextualCasesView } from "../cases/CasesView";
import CountButton from "./CountButton";

import { CohortGroupProps,
  CohortBar,
  convertFilterToComponent,
  useCohortFacetFilters
} from "./CohortGroup";

import {
  MdDownload as DownloadIcon,
  MdInsertChartOutlined as SummaryChartIcon,
  MdOutlineViewComfy as TableIcon, MdFileCopy as FilesIcon} from "react-icons/md";
import { FaCartPlus as AddToCartIcon } from "react-icons/fa";

import SummaryFacets from "./SummaryFacets";
import { updateEnumFilters } from "../facets/hooks";
import { useCoreDispatch, setCurrentCohort, clearCurrentCohort, clearCohortFilters } from "@gff/core";

 const ContextBar: React.FC<CohortGroupProps> = ({ cohorts }: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
    setCohort(idx);
  };

   const coreDispatch = useCoreDispatch();


  const setCohort = (idx:number) => {

    if (cohorts[idx].facets)
      if (cohorts[idx].facets.length == 0) {
        coreDispatch(clearCohortFilters());
      } else {
        cohorts[idx].facets.map(x => {
          updateEnumFilters(coreDispatch, x.value, x.field);
        })
      }
  }

   const [summaryFields, setSummaryFields] = useState([
     { field: "primary_site", name: "Primary Site" },
     { field: "disease_type", name: "Disease Type" },
     { field: "project.project_id", name: "Project" },
     { field: "project.program.name", name: "Program Name" },
     { field: "demographic.gender", name: "Gender" },
     { field: "demographic.vital_status", name: "Vital Status" },
   ]);


  const filters = useCohortFacetFilters();
   // eslint-disable-next-line react/prop-types
  const CohortBarWithProps = () => <CohortBar   cohort_names={cohorts.map(o => o.name)}
                                              onSelectionChanged={handleCohortSelection}
                                              defaultIdx={currentIndex}
  />;
  return (
    <div className="mb-2" data-tour="context_bar">
    <CollapsibleContainer
      Top={CohortBarWithProps}
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}

    >
      <div className="flex flex-col bg-white rounded-md shadow-sm">
        <div
          className="flex flex-row flex-wrap w-100 p-2 bg-nci-gray-lightest ">
          {
            Object.keys(filters.root).map((k) => {
              return convertFilterToComponent(filters.root[k]);
            })}

        </div>
        <div className="relative">
        <div className="flex flex-row absolute z-20 ml-2 mt-2 ">
          <Menu control={
            <Button className="bg-nci-gray-light hover:bg-nci-gray transition-colors">
              <DownloadIcon size="1.5rem" />
              <CountButton countName="fileCounts" label="Files" className="px-2" />
            </Button>
          } >
            <Menu.Item icon={<AddToCartIcon size="1.5rem" />}>Add to Cart</Menu.Item>
            <Menu.Item icon={<DownloadIcon size="1.5rem" />}>Download Manifest</Menu.Item>
          </Menu>
          <Menu control={
            <Button className="ml-2 bg-nci-gray-light hover:bg-nci-gray transition-colors">
              <FilesIcon size="1.5rem" className="mr-1"/> Metadata
            </Button>
          } >
            <Menu.Item >Biospecimen</Menu.Item>
            <Menu.Item >Clinical</Menu.Item>
            <Menu.Item >Sample Sheet</Menu.Item>
        </Menu>
        </div>
        <Tabs position="right" variant="pills" data-tour="cohort_summary">
          <Tabs.Tab data-tour="cohort_summary_charts" label="Summary View" icon={<SummaryChartIcon size="1.5rem"/>}>
            <SummaryFacets fields={summaryFields}/>
          </Tabs.Tab>
          <Tabs.Tab data-tour="cohort_summary_table"  label="Table View" icon={<TableIcon size="1.5rem"/>}><div className="bg-secondary">
            <ContextualCasesView />
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
