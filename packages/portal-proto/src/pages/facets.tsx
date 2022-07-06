import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { EnumFacet } from "../features/facets/EnumFacet";

const FacetsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col content-center">
        <div className="grid grid-cols-3 gap-4">
          <EnumFacet
            docType="cases"
            field="primary_site"
            dismissCallback={() => null}
          />
        </div>
      </div>
    </SimpleLayout>
  );
};

export default FacetsPage;
