import GeneData from "./genes.json";
import MutationData from "./mutations.json";

interface GeneProps {
  readonly data?: Array<Record<string, any>>;
}


export const GeneTable: React.FC<GeneProps> = ({ data = GeneData["MostFrequentGenes"] }: GeneProps) => {
  return (
    <div className="overflow-y-auto h-96 px-64">
      <table
        className="table-fixed border-collapse border-nci-gray w-full"
        style={{ borderSpacing: "4em" }}
      >
        <thead>
        <tr className="bg-nci-blue text-white">
          <th align="left" className="w-1/2 px-2">Gene</th>
          <th align="right" className="w-1/4 px-2">Cases</th>
          <th align="right" className="w-1/4 px-2">Frequency</th>
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
  );
};

export const MutationTable: React.FC<GeneProps> = ({ data = MutationData["MostFrequentMutation"] }: GeneProps) => {
  return (
    <div className="overflow-y-auto h-96 px-64">
      <table
        className="table-fixed border-collapse border-nci-gray w-full"
        style={{ borderSpacing: "4em" }}
      >
        <thead>
        <tr className="bg-nci-blue text-white">
          <th align="left" className="w-1/4 px-2">Mutation</th>
          <th align="left" className="w-1/4 px-2">DNA Change</th>
          <th align="right" className="w-1/4 px-2">Cases</th>
          <th align="right" className="w-1/4 px-2">Frequency</th>
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
  );
};
