import { useState } from "react";
import { CollapsibleContainer } from "../../components/CollapsibleContainer";
import { FacetChart } from "../charts/FacetChart";
import { Button } from "../layout/UserFlowVariedPages";
import { MdSettings as SettingsIcon } from "react-icons/md";

const SummaryStatsTop: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row items-center h-16 bg-nci-gray-lighter w-100">
      <div className="px-4">Summary Statistics</div>

      <div className="ml-auto">
        <Button className="mx-2 bg-nci-gray-lighter "> <SettingsIcon size="1.5em" /></Button>
      </div>

    </div>
  );
};

interface SummaryChartsProps {
  fields:  string[];
}
export const SummaryCharts: React.FC<SummaryChartsProps> = ({ fields} :  SummaryChartsProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);

  return (
    <CollapsibleContainer
      Top={SummaryStatsTop}
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {fields.map((name, index) => {
          return (<FacetChart
            field={name}
            height={200}
            marginBottom={30}
            showXLabels={true}
            key={`summary-chart-${index}`}
          />)
        })
        }

      </div>
    </CollapsibleContainer>
  );
};

export default SummaryCharts;
