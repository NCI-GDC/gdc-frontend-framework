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
  MdOutlineViewComfy as TableIcon} from "react-icons/md";
import { FaCartPlus as AddToCartIcon } from "react-icons/fa";

import SummaryFacets from "./SummaryFacets";

 const ContextBar: React.FC<CohortGroupProps> = ({ cohorts }: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
  };

   const [summaryFields, setSummaryFields] = useState([
     "primary_site",
     "disease_type",
     "project.project_id",
     "project.program.name",
     "demographic.gender",
     "demographic.vital_status"
   ]);


  const filters = useCohortFacetFilters();
  const CohortBarWithProps = () => <CohortBar cohort_names={cohorts.map(o => o.name)}
                                              onSelectionChanged={handleCohortSelection}
                                              defaultIdx={currentIndex}
  />;
  return (
    <div className="mb-2">
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
              <DownloadIcon size="1.5rem" />
            </Button>
          } >
            <Menu.Item >Biospecimen</Menu.Item>
            <Menu.Item >Clinical</Menu.Item>
            <Menu.Item >Sample Sheet</Menu.Item>
        </Menu>
        </div>
        <Tabs position="right" variant="pills" >
          <Tabs.Tab label="Summary View" icon={<SummaryChartIcon size="1.5rem"/>}>
            <SummaryFacets fields={summaryFields}/>
          </Tabs.Tab>
          <Tabs.Tab  label="Table View" icon={<TableIcon size="1.5rem"/>}><div className="bg-secondary">
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
