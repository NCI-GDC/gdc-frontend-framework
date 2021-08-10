import { useState } from "react";
import Select from '@material-ui/core/Select';
import { CollapsibleContainer} from '../../pages/user-flow/all-apps/exploration';
import { Button } from "../layout/UserFlowVariedPages";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import ClearIcon from "@material-ui/icons/Clear";
import SettingsIcon from '@material-ui/icons/Settings';
import { FacetChart } from "../charts/FacetChart";
import { nanoid } from "@reduxjs/toolkit";
import { selectCurrentCohort } from "@gff/core";


const Top : React.FC<unknown> = () => {

  const [groupType, setGroupTop] = useState('any_of');

  const handleChange = (event) => {
    setGroupTop(event.target.value);
  };

  return (
  <div className="flex flex-row items-center h-16 bg-gray-300">
    <div className="font-bold px-4">Current Cohort</div>
    <div className="border-opacity-0">
      <FormControl className="bg-white w-32 min-w-full">
        <Select
          disableUnderline
          value={groupType}
          onChange={handleChange}
          className="px-2"
        >
          <MenuItem value="any_of">is any of</MenuItem>
          <MenuItem value="all_of">is all of</MenuItem>
          <MenuItem value="none_of">is none of</MenuItem>
        </Select>
      </FormControl>
    </div>
<div className="ml-auto">
  <Button className="px-4">84,609 Cases</Button>
  <Button className="px-4 bg-opacity-0"><ClearIcon/></Button>
</div>
  </div>
  );
};



interface CohortFacetElementProps {
  readonly element: Record<string, any>;
}


export const CohortFacetElement: React.FC<CohortFacetElementProps>= ({ element } : CohortFacetElementProps) => {
  return (
    <div className="flex flex-row bg-green-200 ">{element.name} {elment.op} {element.value}</div>
  );
}

interface CohortGroupProps {
  readonly facets_with_values: [CohortFacetElementProps];
}

export const CohortGroup: React.FC<CohortGroupProps> = ({ facets_with_values } : CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);

  return (
    <CollapsibleContainer
      Top={Top}
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
    >
      <div className="h-32 bg-white">
        { facets_with_values.map((facet) => {
         <CohortFacetElement key={nanoid()} element={facet}></CohortFacetElement>
        })}

      </div>
    </CollapsibleContainer>
  )
};

CohortGroup.defaultProps = { facets_with_values: [] };

const SummaryStatsTop : React.FC<unknown> = () => {
  return (
    <div className="flex flex-row items-center h-16 bg-gray-300 w-100">
    <div className="px-4">Summary Statistics</div>

  <div className="ml-auto">
  <Button className="bg-opacity-0"><SettingsIcon/></Button>
    </div>

  </div>
);
};

export const SummaryCharts: React.FC<unknown> = () => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);

  return (
    <CollapsibleContainer
      Top={SummaryStatsTop}
  isCollapsed={isGroupCollapsed}
  toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
>
  <div className="h-72 bg-white">
  <div className="flex flex-col content-center">
  <div className="grid grid-cols-4 gap-2">
  <FacetChart field="primary_site" />
  <FacetChart field="demographic.gender" />
  <FacetChart field="disease_type" />
  <FacetChart field="diagnoses.tissue_or_organ_of_origin" />
    </div>
    </div>
    </div>

    </CollapsibleContainer>
)
};

