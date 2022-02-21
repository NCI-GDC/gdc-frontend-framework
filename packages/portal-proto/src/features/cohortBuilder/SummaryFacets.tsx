import { EnumFacet } from "../facets/EnumFacet";


interface SummaryFacetProps {
  fields:  string[];
}
export const SummaryFacets: React.FC<SummaryFacetProps> =  ({ fields } :  SummaryFacetProps) => {

  return (
    <div className="p-1.5">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {fields.map((name, index) => {
          return (<EnumFacet
            field={name} type={"cases"}
            showSearch={false}
            startShowingData={false}
            key={`summary-chart-${index}`}
          />)
        })
        }

      </div>
  </div>
  );
};

export default SummaryFacets;
