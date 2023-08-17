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
import tw from "tailwind-styled-components";

export interface SummaryFacetInfo {
  readonly field: string;
  readonly name: string;
  readonly docType: GQLDocType;
  readonly indexType: GQLIndexType;
}

interface SummaryFacetProps {
  readonly fields: ReadonlyArray<SummaryFacetInfo>;
}

export const SummaryFacetHeader = tw.div`
flex items-start justify-between flex-nowrap shadow-md px-1.5 border-base- border-b-1`;

export const SummaryFacetHeaderLabel = tw.div`
text-primary-darkest font-heading font-semibold text-[1.25em] break-words py-2
`;

export const SummaryFacetIconButton = tw.button`
text-red
font-bold
py-2
px-1
rounded
inline-flex
items-center
hover:text-primary-darker
`;

export const SummaryFacets: React.FC<SummaryFacetProps> = ({
  fields,
}: SummaryFacetProps) => {
  useEnumFacets(
    fields[0].docType,
    fields[0].indexType,
    fields.map((entry) => entry.field),
  );

  return (
    <div className="grid grid-cols-5 gap-4">
      {fields.map((entry, index) => {
        return (
          <EnumFacet
            field={entry.field}
            header={{
              Panel: SummaryFacetHeader,
              Label: SummaryFacetHeaderLabel,
              iconStyle: "text-primary-darkest hover:text-primary-lighter",
            }}
            valueLabel={FacetDocTypeToLabelsMap[entry.docType]}
            facetName={entry.name}
            startShowingData={false}
            key={`summary-chart-${entry.field}-${index}`}
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
        );
      })}
    </div>
  );
};

export default SummaryFacets;
