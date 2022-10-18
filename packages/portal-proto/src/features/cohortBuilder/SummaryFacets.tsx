import EnumFacet from "../facets/EnumFacet";
import { GQLDocType, GQLIndexType } from "@gff/core";
import {
  useClearFilters,
  useEnumFacet,
  useTotalCounts,
  useUpdateFacetFilter,
} from "@/features/facets/hooks";

export interface SummaryFacetInfo {
  readonly field: string;
  readonly name: string;
  readonly docType: GQLDocType;
  readonly indexType: GQLIndexType;
}

interface SummaryFacetProps {
  readonly fields: ReadonlyArray<SummaryFacetInfo>;
}
export const SummaryFacets: React.FC<SummaryFacetProps> = ({
  fields,
}: SummaryFacetProps) => {
  return (
    <div>
      <div className="grid gr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {fields.map((entry, index) => {
          const style =
            index == 4
              ? "xl:grid hidden w-fit"
              : index == 5
              ? "2xl:grid hidden"
              : "grid w-fit ";
          return (
            <div
              key={`summary-chart-${entry.field}-{${index}`}
              className={style}
            >
              <EnumFacet
                field={entry.field}
                docType={entry.docType}
                facetName={entry.name}
                startShowingData={false}
                key={`summary-chart-${entry.field}-${index}`}
                width="w-64"
                hideIfEmpty={false}
                indexType={entry.indexType}
                hooks={{
                  useUpdateFacetFilters: useUpdateFacetFilter,
                  useTotalCounts: useTotalCounts,
                  useClearFilter: useClearFilters,
                  useGetFacetData: useEnumFacet,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryFacets;
