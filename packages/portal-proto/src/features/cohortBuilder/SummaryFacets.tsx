import { EnumFacet } from "../facets/EnumFacet";

interface SummaryFacetInfo {
  readonly field: string;
  readonly name: string;
}

interface SummaryFacetProps {
  readonly fields: ReadonlyArray<SummaryFacetInfo>;
}
export const SummaryFacets: React.FC<SummaryFacetProps> = ({
  fields,
}: SummaryFacetProps) => {
  return (
    <div className="p-1.5">
      <div className="grid grid-cols-1 col-span-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
        {fields.map((entry, index) => {
          const style =
            index == 4
              ? "xl:grid hidden h-fit"
              : index == 5
              ? "2xl:grid hidden h-fit"
              : "grid h-fit";
          return (
            <div
              key={`summary-chart-${entry.field}-{${index}`}
              className={style}
            >
              <EnumFacet
                field={entry.field}
                docType="cases"
                facetName={entry.name}
                showSearch={false}
                startShowingData={false}
                key={`summary-chart-${index}`}
                width="w-[300px]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryFacets;
