import { NextPage } from "next";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import PrimarySiteTable from "../features/projectSummary/PrimarySiteTable";
import DataCategoryTable  from "../features/projectSummary/DataCategoryTable";
import ExperimentalStrategyTable  from "../features/projectSummary/ExperimentalStrategyTable";
import { PRIMARY_SITES_TABLE } from '../features/projectSummary/project_summary_facets';
import { DATA_CATEGORIES_TABLE, EXPERIMENTAL_STRATEGY_TABLE } from '../features/projectSummary/project_summary_facets';


const ProjectSummary: NextPage = () => {
    return (
      <UserFlowVariedPages headerElements={[]}>
        <div>
        <div className="ml-5 flex flex-row w-max">
            <DataCategoryTable dataCategories={DATA_CATEGORIES_TABLE}></DataCategoryTable>
            <ExperimentalStrategyTable dataStrategies={EXPERIMENTAL_STRATEGY_TABLE}></ExperimentalStrategyTable>
        </div>
        <div className="w-max">
            <PrimarySiteTable sites={PRIMARY_SITES_TABLE}/>
        </div>
        </div>
      </UserFlowVariedPages>
    );
  };

  export default ProjectSummary;