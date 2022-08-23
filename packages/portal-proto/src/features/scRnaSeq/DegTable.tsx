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

export const DegTable: React.VFC<DegTableProps> = (props: DegTableProps) => {
  const subset = props.data.slice(0, 20);

  return (
    <>
      <div className="text-lg">Differential Gene Expression</div>
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
