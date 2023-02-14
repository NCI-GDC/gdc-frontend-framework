import { NextPage } from "next";
import { SimpleLayout } from "@/features/layout/Simple";
import EnumFacet from "../features/facets/EnumFacet";
import {
  useClearFilters,
  useEnumFacet,
  useTotalCounts,
  useUpdateFacetFilter,
} from "@/features/facets/hooks";
import partial from "lodash/partial";

const FacetsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col content-center">
        <div className="grid grid-cols-3 gap-4">
          <EnumFacet
            valueLabel="Cases"
            field="primary_site"
            hooks={{
              useUpdateFacetFilters: useUpdateFacetFilter,
              useTotalCounts: partial(useTotalCounts, "caseCounts"),
              useClearFilter: useClearFilters,
              useGetFacetData: partial(useEnumFacet, "cases", "explore"),
            }}
            dismissCallback={() => null}
          />
        </div>
      </div>
    </SimpleLayout>
  );
};

export default FacetsPage;
