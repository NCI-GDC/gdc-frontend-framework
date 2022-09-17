import dynamic from "next/dynamic";
import { useState } from "react";
import {
  differentiallyExpressedGenes,
  geENSG00000163638,
  geENSG00000183715,
  geENSG00000245532,
  geENSG00000141510,
  geENSG00000198938,
  geENSG00000138413,
  seuratAnalysis,
  sampleCasesCurrent,
  sampleFlatCasesCurrent,
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

const colors = [
  "#0076d6", // blue
  "#cf4900", // orange warm
  "#be32d0", // violet warm
  "#008817", // green cool
  "#656bd7", // indigo
  "#947100", // yellow
  "#d83933", // red
  "#0081a1", // cyan
  "#4866ff", // indigo cool
  "#936f38", // gold
  "#fd4496", // magenta
  "#008480", // mint
  "#9355dc", // violet
  "#538200", // green
  "#d54309", // red warm
  "#0d7ea2", // blue cool
  "#2672de", // blue warm
  "#c05600", // orange
  "#745fe9", // indigo warm
  "#6a7d00", // green warm
  "#e41d3d", // red cool
  "#008480", // mint cool
];
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
  const [caseId, setCaseId] = useState<string>("None");

  const plotData = (() => {
    switch (dimensions) {
      case 2:
        return generateScatterPlot2dData(
          clusterType,
          geneId === "None" ? undefined : geneId,
          caseId === "None" ? undefined : caseId,
        );
      case 3:
        return generateScatterPlot3dData(
          clusterType,
          geneId === "None" ? undefined : geneId,
          caseId === "None" ? undefined : caseId,
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
          <br />
          <input
            type="radio"
            name="geneId"
            onClick={() => {
              setGeneId("ENSG00000198727");
              setCaseId("37d2352d-e15e-4eb7-b3dc-c7c3801d5433");
            }}
            id="geneId--ENSG00000198727"
            checked={geneId === "ENSG00000198727"}
          />
          <label className="px-1" htmlFor="geneId--ENSG00000198727">
            ENSG00000198727
          </label>
          <br />
          <input
            type="radio"
            name="geneId"
            onClick={() => {
              setGeneId("ENSG00000230092");
              setCaseId("37d2352d-e15e-4eb7-b3dc-c7c3801d5433");
            }}
            id="geneId--ENSG00000230092"
            checked={geneId === "ENSG00000230092"}
          />
          <label className="px-1" htmlFor="geneId--ENSG00000230092">
            ENSG00000230092
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>{createPlot(plotData)}</div>
        <div></div>
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
  caseId?: string,
): ScatterPlot2dProps => {
  const caseExpData: CaseExpData = { cases: {} };
  for (let cell of sampleFlatCasesCurrent) {
    if ("error" in cell) {
      console.log("error: %o", cell["error"]);
      continue;
    }
    let case_id = cell["case_id"];
    let gene_id = cell["gene_id"];
    let cell_id = cell["cell_id"];
    let expression = cell["expression"];
    if (case_id in caseExpData.cases === false) {
      caseExpData["cases"][case_id] = { genes: {} };
    }
    if (gene_id in caseExpData["cases"][case_id]["genes"] === false) {
      caseExpData["cases"][case_id]["genes"][gene_id] = { cells: {} };
    }
    caseExpData["cases"][case_id]["genes"][gene_id]["cells"][cell_id] =
      expression;
  }

  const trace = seuratAnalysis.reduce<Trace2d>(
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
          return colors[cell.seuratCluster % colors.length];
        } else if (geneId === "ENSG00000183715") {
          if (cell.cellId in geENSG00000183715) {
            return geENSG00000183715[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000163638") {
          if (cell.cellId in geENSG00000163638) {
            return geENSG00000163638[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000245532") {
          if (cell.cellId in geENSG00000245532) {
            return geENSG00000245532[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000141510") {
          if (cell.cellId in geENSG00000141510) {
            return geENSG00000141510[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000198938") {
          if (cell.cellId in geENSG00000198938) {
            return geENSG00000198938[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000138413") {
          if (cell.cellId in geENSG00000138413) {
            return geENSG00000138413[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000198727") {
          for (let c of sampleCasesCurrent["cases"]) {
            if (caseId === c["case_id"]) {
              if ("error" in c) {
                console.log("case error: %o", c["error"]);
                return undefined;
              }
              for (let g of c["genes"]) {
                if (geneId === g["gene_id"]) {
                  if ("error" in g) {
                    console.log("gene error: %o", g["error"]);
                    return undefined;
                  }
                  for (let ce of g["cells"]) {
                    if (cell.cellId === ce["cell_id"]) {
                      return ce["expression"] || "rgba(200,200,200,0.2)";
                    }
                  }
                  return undefined;
                }
              }
              return undefined;
            }
          }
          return undefined;
        } else if (geneId === "ENSG00000230092") {
          if (
            caseId in caseExpData["cases"] &&
            geneId in caseExpData["cases"][caseId]["genes"] &&
            cell.cellId in
              caseExpData["cases"][caseId]["genes"][geneId]["cells"]
          ) {
            return (
              caseExpData["cases"][caseId]["genes"][geneId]["cells"][
                cell.cellId
              ] || "rgba(200,200,200,0.2)"
            );
          } else {
            console.log("cellId %s not found", cell.cellId);
            return undefined;
          }
        }

        return undefined;
      })();

      return {
        x: [...trace.x, coordinates.x],
        y: [...trace.y, coordinates.y],
        color: [...trace.color, color],
      };
    },
    { x: [], y: [], color: [] },
  );

  return {
    dimensions: 2,
    data: [trace],
  };
};

const generateScatterPlot3dData = (
  clusterType: "tSNE" | "UMAP" | "PCA" = "tSNE",
  geneId?: string,
  caseId?: string,
): ScatterPlot3dProps => {
  const caseExpData: CaseExpData = { cases: {} };
  for (let cell of sampleFlatCasesCurrent) {
    if ("error" in cell) {
      console.log("error: %o", cell["error"]);
      continue;
    }
    let case_id = cell["case_id"];
    let gene_id = cell["gene_id"];
    let cell_id = cell["cell_id"];
    let expression = cell["expression"];
    if (case_id in caseExpData.cases === false) {
      caseExpData["cases"][case_id] = { genes: {} };
    }
    if (gene_id in caseExpData["cases"][case_id]["genes"] === false) {
      caseExpData["cases"][case_id]["genes"][gene_id] = { cells: {} };
    }
    caseExpData["cases"][case_id]["genes"][gene_id]["cells"][cell_id] =
      expression;
  }

  const trace = seuratAnalysis.reduce<Trace3d>(
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
          return colors[cell.seuratCluster % colors.length];
        } else if (geneId === "ENSG00000183715") {
          if (cell.cellId in geENSG00000183715) {
            return geENSG00000183715[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000163638") {
          if (cell.cellId in geENSG00000163638) {
            return geENSG00000163638[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000245532") {
          if (cell.cellId in geENSG00000245532) {
            return geENSG00000245532[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000141510") {
          if (cell.cellId in geENSG00000141510) {
            return geENSG00000141510[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000198938") {
          if (cell.cellId in geENSG00000198938) {
            return geENSG00000198938[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000138413") {
          if (cell.cellId in geENSG00000138413) {
            return geENSG00000138413[cell.cellId] || "rgba(200,200,200,0.2)";
          }
        } else if (geneId === "ENSG00000198727") {
          for (let c of sampleCasesCurrent["cases"]) {
            if (caseId === c["case_id"]) {
              if ("error" in c) {
                console.log("case error: %o", c["error"]);
                return undefined;
              }
              for (let g of c["genes"]) {
                if (geneId === g["gene_id"]) {
                  if ("error" in g) {
                    console.log("gene error: %o", g["error"]);
                    return undefined;
                  }
                  for (let ce of g["cells"]) {
                    if (cell.cellId === ce["cell_id"]) {
                      return ce["expression"] || "rgba(200,200,200,0.2)";
                    }
                  }
                  return undefined;
                }
              }
              return undefined;
            }
          }
          return undefined;
        } else if (geneId === "ENSG00000230092") {
          if (
            caseId in caseExpData["cases"] &&
            geneId in caseExpData["cases"][caseId]["genes"] &&
            cell.cellId in
              caseExpData["cases"][caseId]["genes"][geneId]["cells"]
          ) {
            return (
              caseExpData["cases"][caseId]["genes"][geneId]["cells"][
                cell.cellId
              ] || "rgba(200,200,200,0.2)"
            );
          } else {
            console.log("cellId %s not found", cell.cellId);
            return undefined;
          }
        }

        return undefined;
      })();

      return {
        x: [...trace.x, coordinates.x],
        y: [...trace.y, coordinates.y],
        z: [...trace.z, coordinates.z],
        color: [...trace.color, color],
      };
    },
    { x: [], y: [], z: [], color: [] },
  );

  return {
    dimensions: 3,
    data: [trace],
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

export interface Error {
  readonly message: string;
}

export interface Cell {
  readonly cell_id: string;
  readonly expression: number;
}

export interface Gene {
  readonly cells?: ReadonlyArray<Cell>;
  readonly gene_id: string;
  readonly error?: Error;
}

export interface Case {
  readonly case_id: string;
  readonly file_id?: string;
  readonly genes?: ReadonlyArray<Gene>;
  readonly error?: Error;
}

export interface CasesData {
  readonly cases: ReadonlyArray<Case>;
}

export interface ScRnaSeqCellData {
  readonly case_id: string;
  readonly gene_id: string;
  readonly file_id: string;
  readonly cell_id: string;
  readonly expression: number;
}

export interface CellExpData {
  readonly cells: Record<string, number>;
}
export interface GeneExpData {
  readonly genes: Record<string, CellExpData>;
}
export interface CaseExpData {
  readonly cases: Record<string, GeneExpData>;
}
