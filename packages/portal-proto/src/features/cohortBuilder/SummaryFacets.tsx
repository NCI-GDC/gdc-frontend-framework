import { EnumFacet } from "@gff/portal-components";
import { GQLDocType, GQLIndexType } from "@gff/core";
import {
  useClearFilters,
  useTotalCounts,
  useUpdateFacetFilter,
  FacetDocTypeToLabelsMap,
  useEnumFacets,
  useEnumFacetValues,
  useSelectFieldFilter,
} from "@/features/facets/hooks";
import tw from "tailwind-styled-components";
import { useFieldNameToTitle } from "./queryExpressionHooks";
import { EnumFacetChart } from "../charts/EnumFacetChart";
import { useSearchEnumTerms } from "./hooks";

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
flex items-start justify-between flex-nowrap px-1.5 border-base- border-b-1`;

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
  const queryOptions = {
    docType: fields[0].docType,
    indexType: fields[0].indexType,
  };
  useEnumFacets(
    fields.map((entry) => entry.field),
    queryOptions,
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {fields.map((entry, index) => {
        return (
          <EnumFacet
            field={entry.field}
            valueLabel={FacetDocTypeToLabelsMap[entry.docType]}
            facetName={entry.name}
            startShowingData={false}
            key={`summary-chart-${entry.field}-${index}`}
            hideIfEmpty={false}
            hooks={{
              useUpdateFacetFilters: useUpdateFacetFilter,
              useTotalCounts,
              useClearFilter: useClearFilters,
              useGetEnumFacetData: useEnumFacetValues,
              useFieldNameToTitle,
              useSearchEnumTerms,
              useGetFacetFilters: useSelectFieldFilter,
            }}
            queryOptions={queryOptions}
            Chart={EnumFacetChart}
            variant="summary"
          />
        );
      })}
    </div>
  );
};

export default SummaryFacets;
