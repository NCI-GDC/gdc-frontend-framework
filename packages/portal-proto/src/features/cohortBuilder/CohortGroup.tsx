import { useState } from "react";
import Select from '@material-ui/core/Select';
import { CollapsibleContainer} from '../../pages/user-flow/all-apps/exploration';
import { Button } from "../layout/UserFlowVariedPages";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import ClearIcon from "@material-ui/icons/Clear";
import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/Delete';
import UploadIcon from '@material-ui/icons/Publish';
import DownloadIcon from '@material-ui/icons/GetApp';
import { FacetChart } from "../charts/FacetChart";
import { nanoid } from "@reduxjs/toolkit";
import InputLabel from "@material-ui/core/InputLabel";

const CohortGroupSelect : React.FC<unknown> = () => {

  const [groupType, setGroupTop] = useState('any_of');

  const handleChange = (event) => {
    setGroupTop(event.target.value);
  };

  return (
    <div className="border-opacity-0 pl-4">
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
  );
};

interface CohortBarProps {
    readonly cohort_names: [string];
    onSelectionChanged: (number) => void;
}

const CohortBar : React.FC<CohortBarProps> = ({cohort_names, onSelectionChanged} : CohortBarProps) => {
  const [currentCohort, setCurrentCohort] = useState(0);

  return (
    <div className="flex flex-row items-center pl-4 h-16 bg-gray-300">
      <div className="border-opacity-0">
        <FormControl className="bg-white w-auto min-w-full">
          <InputLabel className="font-bold px-4">
            Current Cohort:
          </InputLabel>
          <Select
            disableUnderline
            value={currentCohort}
            onChange={(event: Record<string, any>) => {
              setCurrentCohort(event.target.value);
              onSelectionChanged(event.target.value);
            }}
            className="px-7"
          >
            { cohort_names.map((x, index) => {
              return  <MenuItem key={nanoid()} value={index}>{x}</MenuItem>
            })}
          </Select>
        </FormControl>
      </div>
      <CohortGroupSelect></CohortGroupSelect>
      <div className="ml-auto">
        <Button className="px-1">84,609 Cases</Button>
        <Button className="px-1 bg-opacity-0"><EditIcon/></Button>
        <Button className="px-1 bg-opacity-0"><SaveIcon/></Button>
        <Button className="px-1 bg-opacity-0"><AddIcon/></Button>
        <Button className="px-1 bg-opacity-0"><DeleteIcon/></Button>
        <Button className="px-1 bg-opacity-0"><UploadIcon/></Button>
        <Button className="px-1 bg-opacity-0"><DownloadIcon/></Button>
      </div>
    </div>
  );
};


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

interface FacetElementProp {
  readonly filter: Record<string, any>
}

const CohortFacetElement: React.FC<FacetElementProp>= ( { filter } : FacetElementProp) => {
  const {  name, op, value  } = filter;
  const [groupType, setGroupTop] = useState(op);

  const handleChange = (event) => {
    setGroupTop(event.target.value);
  };

  return (
    <div  className="flex flex-row items-center bg-gray-100 p-1 rounded-full text-black border-gray-300 border-2">{name} is
      <div className="pt-0.5">
        <FormControl className="px-4 py-2">
          <Select
            disableUnderline
            value={groupType}
            onChange={handleChange}
            className="pl-2"
          >
            <MenuItem value="any_of">any of</MenuItem>
            <MenuItem value="all_of">all of</MenuItem>
            <MenuItem value="none_of">none of</MenuItem>
            <MenuItem value="between">between</MenuItem>
          </Select>
        </FormControl>
      </div>
      {value} </div>
  );
}

interface CohortGroupProps {
  readonly cohorts: [{
    readonly name: string,
    readonly facets: [Record<string, any>]
  }]
}

export const CohortGroup: React.FC<CohortGroupProps> = ({ cohorts } : CohortGroupProps) => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);
  const [currentFacets, setCurrentFacets] = useState(cohorts[0].facets);

  const handleCohortSelection = (idx) => {
    setCurrentFacets(cohorts[idx].facets);
  }

  const CohortBarWithProps = () => <CohortBar cohort_names={cohorts.map(o => o.name)} onSelectionChanged={handleCohortSelection}/>

  return (
    <CollapsibleContainer
      Top={ CohortBarWithProps }
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
    >
      <div className="flex flex-row w-100">
        {
          currentFacets.map((facet) => {
            return <CohortFacetElement key={nanoid()} filter={facet} />
          })}

      </div>
    </CollapsibleContainer>
  )
};

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

