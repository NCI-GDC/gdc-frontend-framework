import { Divider } from "@mantine/core";
import { FacetChart } from "../charts/FacetChart";
import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";
import { divider_style } from "./style";

const Charts = () => {
  return (
    <article className="prose font-montserrat text-primary-content prose-md">
      <p className="prose font-medium text-2xl">Charts</p>

      <div className="flex flex-col content-center gap-y-4">
        <Divider
          label="Facet Bar chart with defaults"
          classNames={divider_style}
        />
        <div className="grid grid-cols-2 gap-4">
          <FacetChart field="primary_site" height={240} />
          <FacetChart field="demographic.gender" height={240} />
          <FacetChart field="disease_type" height={240} />
          <FacetChart field="samples.sample_type" height={240} />
          <FacetChart field="samples.tissue_type" height={240} />
          <FacetChart
            field="diagnoses.tissue_or_organ_of_origin"
            height={240}
          />
        </div>
        <Divider
          label="Facet Bar chart with customizations"
          classNames={divider_style}
        />
        <div className="grid grid-cols-2 gap-4">
          <FacetChart
            field="primary_site"
            height={200}
            maxBins={10}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="demographic.gender"
            height={200}
            maxBins={10}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="disease_type"
            height={200}
            marginBottom={30}
            maxBins={10}
            showXLabels={false}
          />
          <FacetChart
            field="samples.sample_type"
            height={200}
            marginBottom={30}
            maxBins={10}
            showXLabels={false}
          />
          <FacetChart
            field="samples.tissue_type"
            height={200}
            marginBottom={30}
            maxBins={10}
            showXLabels={false}
          />
          <FacetChart
            field="diagnoses.tissue_or_organ_of_origin"
            height={200}
            maxBins={10}
            marginBottom={30}
            showXLabels={false}
          />
        </div>
      </div>
      <Divider label="Gene Frequency Chart" classNames={divider_style} />
      <GeneFrequencyChart height={200} marginBottom={60} />
    </article>
  );
};

export default Charts;
