import dynamic from "next/dynamic";
import { ScatterPlot2dProps } from "./ScatterPlot2dProps";
const ScatterPlot2d = dynamic(() => import("./ScatterPlot2d"), {
  ssr: false,
});

export interface ScRnaSeqDeg {
  readonly seuratCluster: number;
  readonly geneId: string;
  readonly avgLog2Fc: number;
  readonly pVal: number;
  readonly pValAdj: number;
  readonly propInCluster: number;
  readonly propOutCluster: number;
}

export interface DegTableProps {
  readonly data: ReadonlyArray<ScRnaSeqDeg>;
}

const generateVolcanoData = (
  deg: ReadonlyArray<ScRnaSeqDeg>,
): ScatterPlot2dProps => {
  return {
    dimensions: 2,
    data: [
      {
        x: deg.map((d) => d.avgLog2Fc),
        y: deg.map((d) => -Math.log10(d.pValAdj)),
        color: deg.map((d) => {
          if (d.pValAdj > 0.000001) {
            return "#000000";
          }

          if (d.avgLog2Fc > 2) {
            return "#ff0000";
          }

          if (d.avgLog2Fc < -2) {
            return "#00EEFF";
          }

          return "#cccccc";
        }),
      },
    ],
  };
};

export const DegTable: React.VFC<DegTableProps> = (props: DegTableProps) => {
  const subset = props.data.slice(0, 20);

  return (
    <>
      <div className="text-lg">Differential Gene Expression</div>
      <div>
        <ScatterPlot2d {...generateVolcanoData(props.data)} />
      </div>
      <div className="grid grid-cols-7 gap-x-4">
        <div key="Cluster" className="font-bold">
          Cluster
        </div>
        <div key="Gene" className="font-bold">
          Gene
        </div>
        <div key="Avg Log2FC" className="font-bold">
          Avg Log2FC
        </div>
        <div key="p-value" className="font-bold">
          p-value
        </div>
        <div key="p-value Adj" className="font-bold">
          p-value Adj
        </div>
        <div key="Prop In Cluster" className="font-bold">
          Prop In Cluster
        </div>
        <div key="Prop Out Cluster" className="font-bold">
          Prop Out Cluster
        </div>
        {subset.map((deg) => {
          return (
            <>
              <div key={`${deg.seuratCluster}-${deg.geneId}-seuratCluster`}>
                {deg.seuratCluster}
              </div>
              <div key={`${deg.seuratCluster}-${deg.geneId}-geneId`}>
                {deg.geneId}
              </div>
              <div key={`${deg.seuratCluster}-${deg.geneId}-avgLog2Fc`}>
                {deg.avgLog2Fc.toFixed(3)}
              </div>
              <div key={`${deg.seuratCluster}-${deg.geneId}-pVal`}>
                {deg.pVal.toFixed(3)}
              </div>
              <div key={`${deg.seuratCluster}-${deg.geneId}-pValAdj`}>
                {deg.pValAdj.toFixed(3)}
              </div>
              <div key={`${deg.seuratCluster}-${deg.geneId}-propInCluster`}>
                {deg.propInCluster.toFixed(3)}
              </div>
              <div key={`${deg.seuratCluster}-${deg.geneId}-propOutCluster`}>
                {deg.propOutCluster.toFixed(3)}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};
