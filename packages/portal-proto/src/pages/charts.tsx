import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { FacetChart } from "../features/charts/FacetChart";
import { GeneFrequencyChart } from "../features/charts/GeneFrequencyChart";
import { SurvivalPlot } from "../features/charts/SurvivalPlot";

const FacetsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col content-center gap-y-4">
        <div>Charts with Defaults</div>
        <div className="grid grid-cols-3 gap-4">
          <FacetChart field="primary_site" />
          <FacetChart field="demographic.gender" />
          <FacetChart field="disease_type" />
          <FacetChart field="samples.sample_type" />
          <FacetChart field="samples.tissue_type" />
          <FacetChart field="diagnoses.tissue_or_organ_of_origin" />
        </div>

        <div>Charts with Customizations</div>
        <div className="grid grid-cols-3 gap-4">
          <FacetChart field="primary_site" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="demographic.gender" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="disease_type" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="samples.sample_type" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="samples.tissue_type" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="diagnoses.tissue_or_organ_of_origin" height={200} marginBottom={30} showXLabels={false}/>
        </div>
      </div>
      <GeneFrequencyChart height={200} marginBottom={30} />
      <SurvivalPlot height={200} marginBottom={30} />
    </SimpleLayout>
  );
};

export default FacetsPage;
