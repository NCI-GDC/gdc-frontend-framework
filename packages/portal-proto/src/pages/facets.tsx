import { NextPage } from "next";
import { SimpleLayout } from "@/features/layout/Simple";
import EnumFacet from "../features/facets/EnumFacet";
import {
  useClearFilters,
  useEnumFacet,
  useTotalCounts,
  useUpdateFacetFilter,
} from "@/features/facets/hooks";

const FacetsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col content-center">
        <div className="grid grid-cols-3 gap-4">
          <EnumFacet
            docType="cases"
            field="primary_site"
            hooks={{
              useUpdateFacetFilters: useUpdateFacetFilter,
              useTotalCounts: useTotalCounts,
              useClearFilter: useClearFilters,
              useGetFacetData: useEnumFacet,
            }}
            dismissCallback={() => null}
          />
        </div>
      </div>
    </SimpleLayout>
  );
};

export default FacetsPage;
