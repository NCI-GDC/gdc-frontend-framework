import { Stack, Divider, Card } from "@mantine/core";
import { FacetChart } from "../charts/FacetChart";
import { GeneFrequencyChart } from "../charts/GeneFrequencyChart";


const Colors = () => {
  return (
    <Stack>
      <p className="prose font-montserrat text-xl text-nci-gray-darker">Charting Component</p>

      <div className="flex flex-col content-center gap-y-4">
        <Divider label="Charts with Defaults"/>
        <div className="grid grid-cols-3 gap-4">
          <Card>
          <FacetChart field="primary_site"  height={200} />
          </Card>
          <FacetChart field="demographic.gender"height={200} />
          <FacetChart field="disease_type" height={200} />
          <FacetChart field="samples.sample_type" height={200} />
          <FacetChart field="samples.tissue_type" height={200} />
          <FacetChart field="diagnoses.tissue_or_organ_of_origin" height={200} />
        </div>
        <Divider label="Charts with Defaults"/>
        <div className="grid grid-cols-3 gap-4">
          <FacetChart field="primary_site" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="demographic.gender" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="disease_type" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="samples.sample_type" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="samples.tissue_type" height={200} marginBottom={30} showXLabels={false}/>
          <FacetChart field="diagnoses.tissue_or_organ_of_origin" height={200} marginBottom={30} showXLabels={false}/>
        </div>
      </div>
      <Divider label="Gene Frequency Chart"/>
      <GeneFrequencyChart height={200} marginBottom={30} />

    </Stack>
  );
};

export default Colors;
