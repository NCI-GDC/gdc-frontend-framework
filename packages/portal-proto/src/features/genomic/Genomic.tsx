import GeneData from "./genes.json";
import MutationData from "./mutations.json";
import { MdSearch, MdSort as SortIcon } from "react-icons/md";

interface GeneFacetProps {
  readonly data?: Array<Record<string, any>>;
  readonly width?: string;
  readonly
}


export const GeneFacet: React.FC<GeneFacetProps> = ({ data = GeneData["MostFrequentGenes"], width="64" }: GeneFacetProps) => {
  return (
    <div className={`border-2 border-nci-gray-lighter pt-2 mx-${width}`}>
    <div className="overflow-y-auto h-96">
      <table
        className="table-fixed border-collapse border-nci-gray w-full"
        style={{ borderSpacing: "4em" }}
      >
        <thead>
        <tr className="bg-nci-blue text-white">
          <th align="left" className="w-1/2 px-2">Gene</th>
          <th align="right" className="w-1/4 px-2"><div className="flex flex-row items-center justify-end"><SortIcon scale="1.5em"/><p className={"px-2"}>Cases</p></div></th>
          <th align="right" className="w-1/4 px-2"><div className="flex flex-row items-center justify-end"><SortIcon scale="1.5em"/><p className={"px-2"}>Frequency</p></div></th>

        </tr>
        </thead>
        <tbody>
        {data &&
        data.map((x, i) => (
          <tr key={x.gene_label} className={i % 2 == 0 ? "bg-gray-200" : ""}>
            <td className="px-2 break-all"><input type="checkbox" value={x.gene_label} /><span
              className={"px-2"}>{x.gene_label}</span></td>
            <td align="right" className="px-2">{x.count}</td>
            <td align="right" className="px-2">{x.percent}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};


export const MutationFacet: React.FC<GeneFacetProps> = ({ data = MutationData["MostFrequentMutation"], width = "64" }: GeneFacetProps) => {
  return (
    <div className={`border-2 border-nci-gray-lighter pt-2 mx-${width}`}>
    <div className="overflow-y-auto h-96">
      <table
        className="table-fixed border-collapse border-nci-gray w-full"
        style={{ borderSpacing: "4em" }}
      >
        <thead>
        <tr className="bg-nci-blue text-white">
          <th align="left" className="w-1/4 px-2">Mutation</th>
          <th align="left" className="w-1/4 px-2">DNA Change</th>
          <th align="right" className="w-1/4 px-2"><div className="flex flex-row items-center justify-end"><SortIcon scale="1.5em"/><p className={"px-2"}>Cases</p></div></th>
          <th align="right" className="w-1/4 px-2"><div className="flex flex-row items-center justify-end"><SortIcon scale="1.5em"/><p className={"px-2"}>Frequency</p></div></th>
        </tr>
        </thead>
        <tbody>
        {data &&
        data.map((x, i) => (
          <tr key={x.gene_label} className={i % 2 == 0 ? "bg-gray-200" : ""}>
            <td align="left" className="px-2 break-all">
              <input type="checkbox" value={x.gene_label} /><span className={"px-2"}>{x.gene_label}</span></td>
            <td  align="left" className="px-2">{x.dna_change}</td>
            <td  align="right" className="px-2">{x.count}</td>
            <td  align="right" className="px-2">{x.percent}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};
