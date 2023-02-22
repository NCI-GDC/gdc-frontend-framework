import EnumFacet from "../facets/EnumFacet";
import { GQLDocType, GQLIndexType } from "@gff/core";
import {
  useClearFilters,
  useTotalCounts,
  useUpdateFacetFilter,
  FacetDocTypeToLabelsMap,
  FacetDocTypeToCountsIndexMap,
  useEnumFacets,
  useEnumFacetValues,
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
  useEnumFacets(
    fields[0].docType,
    fields[0].indexType,
    fields.map((entry) => entry.field),
  );

  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {fields.map((entry, index) => {
          return (
            <div
              key={`summary-chart-${entry.field}-{${index}`}
              className="grid w-fit"
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
                    useEnumFacetValues,
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
