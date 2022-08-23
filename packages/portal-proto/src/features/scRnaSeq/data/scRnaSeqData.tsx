import { ScRnaSeqDeg } from "../DegTable";
import { CellData } from "../scRnaSeqViz";
import analysis from "./e227166a-ed1f-47d7-9fcf-6f6a9344640e.seurat.analysis.json";
import deg from "./e227166a-ed1f-47d7-9fcf-6f6a9344640e.seurat.deg.json";
import ge_ENSG00000245532 from "./ge-ENSG00000245532.json";
import ge_ENSG00000163638 from "./ge-ENSG00000163638.json";
import ge_ENSG00000183715 from "./ge-ENSG00000183715.json";
import ge_ENSG00000141510 from "./ge-ENSG00000141510.json";
import ge_ENSG00000198938 from "./ge-ENSG00000198938.json";
import ge_ENSG00000138413 from "./ge-ENSG00000138413.json";

export const seuratAnalysis: ReadonlyArray<CellData> =
  analysis as ReadonlyArray<CellData>;

export const differentiallyExpressedGenes: ReadonlyArray<ScRnaSeqDeg> =
  deg as ReadonlyArray<ScRnaSeqDeg>;

export const geENSG00000183715: Record<string, number> =
  ge_ENSG00000183715 as Record<string, number>;

export const geENSG00000163638: Record<string, number> =
  ge_ENSG00000163638 as Record<string, number>;

export const geENSG00000245532: Record<string, number> =
  ge_ENSG00000245532 as Record<string, number>;

export const geENSG00000141510: Record<string, number> =
  ge_ENSG00000141510 as Record<string, number>;

export const geENSG00000198938: Record<string, number> =
  ge_ENSG00000198938 as Record<string, number>;

export const geENSG00000138413: Record<string, number> =
  ge_ENSG00000138413 as Record<string, number>;
