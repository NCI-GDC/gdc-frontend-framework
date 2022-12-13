import EnumFacet from "../facets/EnumFacet";
import { GQLDocType, GQLIndexType } from "@gff/core";
import {
  useClearFilters,
  useEnumFacet,
  useTotalCounts,
  useUpdateFacetFilter,
  FacetDocTypeToLabelsMap,
  FacetDocTypeToCountsIndexMap,
} from "@/features/facets/hooks";
import partial from "lodash/partial";

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
      <div className="grid grid-cols-5 gap-4">
        {fields.map((entry, index) => {
          const style =
            index == 4
              ? "xl:grid  w-fit"
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
                valueLabel={FacetDocTypeToLabelsMap[entry.docType]}
                facetName={entry.name}
                startShowingData={false}
                key={`summary-chart-${entry.field}-${index}`}
                width="w-64"
                hideIfEmpty={false}
                hooks={{
                  useUpdateFacetFilters: useUpdateFacetFilter,
                  useTotalCounts: partial(
                    useTotalCounts,
                    FacetDocTypeToCountsIndexMap[entry.docType],
                  ),
                  useClearFilter: useClearFilters,
                  useGetFacetData: partial(
                    useEnumFacet,
                    entry.docType,
                    entry.indexType,
                  ),
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
