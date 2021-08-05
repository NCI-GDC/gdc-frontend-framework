import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { FacetChart } from "../features/charts/FacetChart";

const FacetsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col content-center">
        <div className="grid grid-cols-3 gap-4">
          <FacetChart field="primary_site" />
          <FacetChart field="demographic.gender" />
          <FacetChart field="disease_type" />
          <FacetChart field="samples.sample_type" />
          <FacetChart field="samples.tissue_type" />
          <FacetChart field="diagnoses.tissue_or_organ_of_origin" />
        </div>
      </div>
    </SimpleLayout>
  );
};

export default FacetsPage;
