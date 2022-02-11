import { useState } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";
import { Tabs } from '@mantine/core';
import { CohortGroupProps,
  CohortBar,
  convertFilterToComponent,
  useCohortFacetFilters} from "./CohortGroup";

import SummaryCharts from "./SummaryCharts";

 const ContextBar: React.FC<CohortGroupProps> = ({ cohorts }: CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleCohortSelection = (idx) => {
    setCurrentIndex(idx);
  };

   const [summaryFields, setSummaryFields] = useState([
     "primary_site",
     "demographic.gender",
     "disease_type",
     "diagnoses.tissue_or_organ_of_origin"
   ]);


  const filters = useCohortFacetFilters();
  const CohortBarWithProps = () => <CohortBar cohort_names={cohorts.map(o => o.name)}
                                              onSelectionChanged={handleCohortSelection}
                                              defaultIdx={currentIndex} case_count={"85415"}
  />;
  return (
    <CollapsibleContainer
      Top={CohortBarWithProps}
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
    >
      <div className="flex flex-col">
        <div
          className="flex flex-row flex-wrap w-100 p-2 border-b-2 border-r-2 border-l-2 rounded-lg rounded-t-none border-nci-gray-lighter">
          {
            Object.keys(filters.root).map((k) => {
              return convertFilterToComponent(filters.root[k]);
            })}

        </div>
        <Tabs position="right" variant="pills" >
          <Tabs.Tab label="Summary"><SummaryCharts fields={summaryFields}/></Tabs.Tab>
          <Tabs.Tab label="Case Table"><div className="bg-secondary h-96 ">
            Cases Table
          </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </CollapsibleContainer>
  );
};


 export default ContextBar;
