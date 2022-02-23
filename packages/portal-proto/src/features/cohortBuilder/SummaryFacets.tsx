import { EnumFacet } from "../facets/EnumFacet";


interface SummaryFacetProps {
  fields:  string[];
}
export const SummaryFacets: React.FC<SummaryFacetProps> =  ({ fields } :  SummaryFacetProps) => {

  return (
    <div className="p-1.5">
      <div
        className="grid gr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {fields.map((name, index) => {
          const style = index == 4 ? "xl:grid hidden" : index == 5 ? "2xl:grid hidden" : "";
          console.log(style);
          return (
            <div key={`summary-chart-${name}-{${index}`} className={style}><EnumFacet
            field={name} type={"cases"}
            showSearch={false}
            startShowingData={false}
            key={`summary-chart-${index}`}
            /></div>)
        })
        }

      </div>
  </div>
  );
};

export default SummaryFacets;
