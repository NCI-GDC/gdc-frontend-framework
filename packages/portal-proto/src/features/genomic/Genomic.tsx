/**
 * This component will be moved to Demo
 */

import GeneData from "./genes.json";
import MutationData from "./mutations.json";
import { MdSort as SortIcon } from "react-icons/md";

interface GeneFacetProps {
  readonly data?: Array<Record<string, any>>;
  readonly width?: string;
  readonly;
}

export const GeneFacet: React.FC<GeneFacetProps> = ({
  data = GeneData["MostFrequentGenes"],
  width = "64",
}: GeneFacetProps) => {
  return (
    <div className={`border-2 border-base-lighter pt-2 mx-${width}`}>
      <div className="overflow-y-auto h-96">
        <table
          className="table-fixed border-collapse border-base w-full"
          style={{ borderSpacing: "4em" }}
        >
          <thead>
            <tr className="bg-primary text-primary-contrast">
              <th className="w-1/2 px-2 text-left">Gene</th>
              <th className="w-1/4 px-2 text-right">
                <div className="flex flex-row items-center justify-end">
                  <SortIcon scale="1.5em" />
                  <p className={"px-2"}>Cases</p>
                </div>
              </th>
              <th className="w-1/4 px-2 text-right">
                <div className="flex flex-row items-center justify-end">
                  <SortIcon scale="1.5em" />
                  <p className={"px-2"}>Frequency</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((x, i) => (
                <tr
                  key={x.gene_label}
                  className={i % 2 == 0 ? "bg-base-lighter" : ""}
                >
                  <td className="px-2 break-all">
                    <input type="checkbox" value={x.gene_label} />
                    <span className={"px-2"}>{x.gene_label}</span>
                  </td>
                  <td className="px-2 text-right">{x.count}</td>
                  <td className="px-2 text-right">{x.percent}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const MutationFacet: React.FC<GeneFacetProps> = ({
  data = MutationData["MostFrequentMutation"],
  width = "64",
}: GeneFacetProps) => {
  return (
    <div className={`border-2 border-base-lighter pt-2 mx-${width}`}>
      <div className="overflow-y-auto h-96">
        <table
          className="table-fixed border-collapse border-base w-full"
          style={{ borderSpacing: "4em" }}
        >
          <thead>
            <tr className="bg-primary text-primary-contrast">
              <th className="w-1/4 px-2 text-left">Mutation</th>
              <th className="w-1/4 px-2 text-left">DNA Change</th>
              <th className="w-1/4 px-2 text-right">
                <div className="flex flex-row items-center justify-end">
                  <SortIcon scale="1.5em" />
                  <p className={"px-2"}>Cases</p>
                </div>
              </th>
              <th className="w-1/4 px-2 text-right">
                <div className="flex flex-row items-center justify-end">
                  <SortIcon scale="1.5em" />
                  <p className={"px-2"}>Frequency</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((x, i) => (
                <tr
                  key={x.gene_label}
                  className={i % 2 == 0 ? "bg-base-lighter" : ""}
                >
                  <td className="px-2 break-all">
                    <input type="checkbox" value={x.gene_label} />
                    <span className={"px-2"}>{x.gene_label}</span>
                  </td>
                  <td className="px-2 text-left">{x.dna_change}</td>
                  <td className="px-2 text-right">{x.count}</td>
                  <td className="px-2 text-right">{x.percent}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
