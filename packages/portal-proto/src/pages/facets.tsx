import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { Facet } from "../features/facets/Facet";

const FacetsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col content-center">
        <div className="grid grid-cols-3 gap-4">
          <Facet field="primary_site" />
          <Facet field="demographic.gender" />
          <Facet field="disease_type" />
          <Facet field="samples.sample_type" />
          <Facet field="samples.tissue_type" />
          <Facet field="diagnoses.tissue_or_organ_of_origin" />
        </div>
      </div>
    </SimpleLayout>
  );
};

export default FacetsPage;
