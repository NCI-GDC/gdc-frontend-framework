import dynamic from "next/dynamic";
import { useState } from "react";
import { lookupColor } from "./colors";
import {
  differentiallyExpressedGenes,
  geENSG00000138413,
  geENSG00000141510,
  geENSG00000163638,
  geENSG00000183715,
  geENSG00000198938,
  geENSG00000245532,
  seuratAnalysis,
} from "./data/scRnaSeqData";
import { DegTable } from "./DegTable";
import { ScatterPlot2dProps, Trace2d } from "./ScatterPlot2dProps";
import { ScatterPlot3dProps, Trace3d } from "./ScatterPlot3dProps";

const ScatterPlot2d = dynamic(() => import("./ScatterPlot2d"), {
  ssr: false,
});

const ScatterPlot3d = dynamic(() => import("./ScatterPlot3d"), {
  ssr: false,
});

const ViolinPlot = dynamic(() => import("./ViolinPlot"), {
  ssr: false,
});

const ViolinMultiPlot = dynamic(() => import("./ViolinMultiPlot"), {
  ssr: false,
});

export interface ScRnaSeqVizProps {
  readonly caseId?: string;
}

const createPlot = (props: ScatterPlot2dProps | ScatterPlot3dProps) => {
  switch (props.dimensions) {
    case 2:
      return <ScatterPlot2d {...props} />;
    case 3:
      return <ScatterPlot3d {...props} />;
    default: {
      return assertNever(props);
    }
  }
};

export const ScRnaSeqViz: React.VFC<ScRnaSeqVizProps> = () => {
  const [clusterType, setClusterType] = useState<"tSNE" | "UMAP" | "PCA">(
    "tSNE",
  );
  const [dimensions, setDimensions] = useState<2 | 3>(2);
  const [geneId, setGeneId] = useState<string>("None");

  const plotData = (() => {
    switch (dimensions) {
      case 2:
        return generateScatterPlot2dData(
          clusterType,
          geneId === "None" ? undefined : geneId,
        );
      case 3:
        return generateScatterPlot3dData(
          clusterType,
          geneId === "None" ? undefined : geneId,
        );
      default:
        return assertNever(dimensions);
    }
  })();

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-row gap-x-8">
        <div>
          <input
            type="radio"
            name="clusterType"
            onClick={() => setClusterType("tSNE")}
            id="clusterType--tSNE"
            checked={clusterType === "tSNE"}
          />
          <label className="px-1" htmlFor="clusterType--tSNE">
            tSNE
          </label>
          <br></br>
          <input
            type="radio"
            name="clusterType"
            onClick={() => setClusterType("UMAP")}
            id="clusterType--UMAP"
            checked={clusterType === "UMAP"}
          />
          <label className="px-1" htmlFor="clusterType--UMAP">
            UMAP
          </label>
          <br></br>
          <input
            type="radio"
            name="clusterType"
            onClick={() => setClusterType("PCA")}
            id="clusterType--PCA"
            checked={clusterType === "PCA"}
          />
          <label className="px-1" htmlFor="clusterType--PCA">
            PCA
          </label>
        </div>
        <div>
          <input
            type="radio"
            name="dimensions"
            onClick={() => setDimensions(2)}
            id="dimensions--2"
            checked={dimensions === 2}
          />
          <label className="px-1" htmlFor="dimensions--2">
            2D
          </label>
          <br></br>
          <input
            type="radio"
            name="dimensions"
            onClick={() => setDimensions(3)}
            id="dimensions--3"
            checked={dimensions === 3}
          />
          <label className="px-1" htmlFor="dimensions--3">
            3D
          </label>
        </div>
        <div>
          <input
            type="radio"
            name="geneId"
            onClick={() => setGeneId("None")}
            id="geneId--None"
            checked={geneId === "None"}
          />
          <label className="px-1" htmlFor="geneId--None">
            Clusters
          </label>
          <br></br>
          <input
            type="radio"
            name="geneId"
            onClick={() => setGeneId("ENSG00000163638")}
            id="geneId--ENSG00000163638"
            checked={geneId === "ENSG00000163638"}
          />
          <label className="px-1" htmlFor="geneId--ENSG00000163638">
            ADAMTS9
          </label>
          <br />
          <input
            type="radio"
            name="geneId"
            onClick={() => setGeneId("ENSG00000245532")}
            id="geneId--ENSG00000245532"
            checked={geneId === "ENSG00000245532"}
          />
          <label className="px-1" htmlFor="geneId--ENSG00000245532">
            NEAT1
          </label>
          <br />
          <input
            type="radio"
            name="geneId"
            onClick={() => setGeneId("ENSG00000183715")}
            id="geneId--ENSG00000183715"
            checked={geneId === "ENSG00000183715"}
          />
          <label className="px-1" htmlFor="geneId--ENSG00000183715">
            OPCML
          </label>
          <br />
          <input
            type="radio"
            name="geneId"
            onClick={() => setGeneId("ENSG00000141510")}
            id="geneId--ENSG00000141510"
            checked={geneId === "ENSG00000141510"}
          />
          <label className="px-1" htmlFor="geneId--ENSG00000141510">
            TP53
          </label>
          <br />
          <input
            type="radio"
            name="geneId"
            onClick={() => setGeneId("ENSG00000138413")}
            id="geneId--ENSG00000138413"
            checked={geneId === "ENSG00000138413"}
          />
          <label className="px-1" htmlFor="geneId--ENSG00000138413">
            IDH1
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>{createPlot(plotData)}</div>
        <div>
          <ViolinPlot
            y={seuratAnalysis.map((s) => s.geneCount)}
            label="Gene Count"
          />
        </div>
      </div>
      <div>
        <ViolinMultiPlot
          y={seuratAnalysis.map((s) => s.geneCount)}
          x={seuratAnalysis.map((s) => `Cluster ${s.seuratCluster}`)}
          colors={seuratAnalysis.reduce((clusters, s) => {
            return {
              ...clusters,
              [`Cluster ${s.seuratCluster}`]: lookupColor(s.seuratCluster),
            };
          }, {})}
        />
      </div>
      <div>
        <DegTable data={differentiallyExpressedGenes} />
      </div>
    </div>
  );
};

const assertNever = (x: never): never => {
  throw Error(`Exhaustive comparison did not handle: ${x}`);
};

const generateScatterPlot2dData = (
  clusterType: "tSNE" | "UMAP" | "PCA" = "tSNE",
  geneId?: string,
): ScatterPlot2dProps => {
  const dataByCluster = seuratAnalysis.reduce<
    Record<string, ReadonlyArray<CellData>>
  >((byCluster, cell) => {
    const cluster = cell.seuratCluster;
    return {
      ...byCluster,
      [cluster]: [...(byCluster[cluster] || []), cell],
    };
  }, {});

  const traces = Object.entries(dataByCluster).map<Trace2d>(
    ([cluster, cells]) => {
      return cells.reduce<Trace2d>(
        (trace, cell) => {
          const coordinates: Coordinates2d = (() => {
            switch (clusterType) {
              case "tSNE":
                return cell.tSneCoordinates2d;
              case "UMAP":
                return cell.umapCoordinates2d;
              case "PCA":
                return cell.pcaCoordinates2d;
              default:
                return assertNever(clusterType);
            }
          })();

          const color = (() => {
            if (geneId === "None" || geneId === undefined) {
              return lookupColor(cell.seuratCluster);
            } else if (geneId === "ENSG00000183715") {
              if (cell.cellId in geENSG00000183715) {
                return (
                  geENSG00000183715[cell.cellId] || "rgba(200,200,200,0.2)"
                );
              }
            } else if (geneId === "ENSG00000163638") {
              if (cell.cellId in geENSG00000163638) {
                return (
                  geENSG00000163638[cell.cellId] || "rgba(200,200,200,0.2)"
                );
              }
            } else if (geneId === "ENSG00000245532") {
              if (cell.cellId in geENSG00000245532) {
                return (
                  geENSG00000245532[cell.cellId] || "rgba(200,200,200,0.2)"
                );
              }
            } else if (geneId === "ENSG00000141510") {
              if (cell.cellId in geENSG00000141510) {
                return (
                  geENSG00000141510[cell.cellId] || "rgba(200,200,200,0.2)"
                );
              }
            } else if (geneId === "ENSG00000198938") {
              if (cell.cellId in geENSG00000198938) {
                return (
                  geENSG00000198938[cell.cellId] || "rgba(200,200,200,0.2)"
                );
              }
            } else if (geneId === "ENSG00000138413") {
              if (cell.cellId in geENSG00000138413) {
                return (
                  geENSG00000138413[cell.cellId] || "rgba(200,200,200,0.2)"
                );
              }
            }
            return undefined;
          })();

          return {
            ...trace,
            x: [...trace.x, coordinates.x],
            y: [...trace.y, coordinates.y],
            color: [...trace.color, color],
          };
        },
        { x: [], y: [], color: [], name: `Cluster ${cluster}` },
      );
    },
  );

  return {
    dimensions: 2,
    data: traces,
  };
};

const generateScatterPlot3dData = (
  clusterType: "tSNE" | "UMAP" | "PCA" = "tSNE",
  geneId?: string,
): ScatterPlot3dProps => {
  const dataByCluster = seuratAnalysis.reduce<
    Record<string, ReadonlyArray<CellData>>
  >((byCluster, cell) => {
    const cluster = cell.seuratCluster;
    return {
      ...byCluster,
      [cluster]: [...(byCluster[cluster] || []), cell],
    };
  }, {});

  const traces = Object.entries(dataByCluster).map<Trace3d>(
    ([cluster, cells]) => {
      return cells.reduce<Trace3d>(
        (trace, cell) => {
          const coordinates: Coordinates3d = (() => {
            switch (clusterType) {
              case "tSNE":
                return cell.tSneCoordinates3d;
              case "UMAP":
                return cell.umapCoordinates3d;
              case "PCA":
                return cell.pcaCoordinates3d;
              default:
                return assertNever(clusterType);
            }
          })();

          const color = (() => {
            if (geneId === "None" || geneId === undefined) {
              return lookupColor(cell.seuratCluster);
            } else if (geneId === "ENSG00000183715") {
              if (cell.cellId in geENSG00000183715) {
                return (
                  geENSG00000183715[cell.cellId] || "rgba(200,200,200,0.9)"
                );
              }
            } else if (geneId === "ENSG00000163638") {
              if (cell.cellId in geENSG00000163638) {
                return (
                  geENSG00000163638[cell.cellId] || "rgba(200,200,200,0.9)"
                );
              }
            } else if (geneId === "ENSG00000245532") {
              if (cell.cellId in geENSG00000245532) {
                return (
                  geENSG00000245532[cell.cellId] || "rgba(200,200,200,0.9)"
                );
              }
            } else if (geneId === "ENSG00000141510") {
              if (cell.cellId in geENSG00000141510) {
                return (
                  geENSG00000141510[cell.cellId] || "rgba(200,200,200,0.9)"
                );
              }
            } else if (geneId === "ENSG00000198938") {
              if (cell.cellId in geENSG00000198938) {
                return (
                  geENSG00000198938[cell.cellId] || "rgba(200,200,200,0.9)"
                );
              }
            } else if (geneId === "ENSG00000138413") {
              if (cell.cellId in geENSG00000138413) {
                return (
                  geENSG00000138413[cell.cellId] || "rgba(200,200,200,0.9)"
                );
              }
            }
            return undefined;
          })();

          return {
            ...trace,
            x: [...trace.x, coordinates.x],
            y: [...trace.y, coordinates.y],
            z: [...trace.z, coordinates.z],
            color: [...trace.color, color],
          };
        },
        { x: [], y: [], z: [], color: [], name: `Cluster ${cluster}` },
      );
    },
  );

  return {
    dimensions: 3,
    data: traces,
  };
};

export interface Coordinates2d {
  readonly x: number;
  readonly y: number;
}

export interface Coordinates3d {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface CellData {
  readonly cellId: string;
  readonly readCount: number;
  readonly geneCount: number;
  readonly seuratCluster: number;
  readonly umapCoordinates2d: Coordinates2d;
  readonly umapCoordinates3d: Coordinates3d;
  readonly tSneCoordinates2d: Coordinates2d;
  readonly tSneCoordinates3d: Coordinates3d;
  readonly pcaCoordinates2d: Coordinates2d;
  readonly pcaCoordinates3d: Coordinates3d;
}

export interface ScRnaSeqAnalysis {
  readonly cellData: Record<string, CellData>;
}
