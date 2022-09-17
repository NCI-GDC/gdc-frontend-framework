import { ScRnaSeqDeg } from "../DegTable";
import { CellData } from "../scRnaSeqViz";
import { CasesData } from "../scRnaSeqViz";
import { ScRnaSeqCellData } from "../scRnaSeqViz";

import analysis from "./e227166a-ed1f-47d7-9fcf-6f6a9344640e.seurat.analysis.json";
import deg from "./e227166a-ed1f-47d7-9fcf-6f6a9344640e.seurat.deg.json";
import ge_ENSG00000245532 from "./ge-ENSG00000245532.json";
import ge_ENSG00000163638 from "./ge-ENSG00000163638.json";
import ge_ENSG00000183715 from "./ge-ENSG00000183715.json";
import ge_ENSG00000141510 from "./ge-ENSG00000141510.json";
import ge_ENSG00000198938 from "./ge-ENSG00000198938.json";
import ge_ENSG00000138413 from "./ge-ENSG00000138413.json";
import sample_case from "./sample_case.json";
import sample_case_case_error from "./sample_case_case_error.json";
import sample_case_gene_error from "./sample_case_gene_error.json";
import sample_flat_case from "./sample_flat_case.json";

/**
 * NOTES: This code exists for testing purposes. The json files that are imported
 * are NOT and SHOULD NOT be commit to the code repository.
 *
 * To use this, you will need to copy the json data files to this directory.
 *
 * For reference, the analysis file was generated from a seurat analysis tsv file.
 * The deg file was generated from a seurat deg tsv file.
 * The ge files were generated from the loom hdf5 files. (all the cell ids and
 * expression values for a given gene from the norm data)
 */

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

export const sampleCases: CasesData = sample_case as CasesData;
export const sampleCasesCaseError: CasesData =
  sample_case_case_error as CasesData;
export const sampleCasesGeneError: CasesData =
  sample_case_gene_error as CasesData;
export const sampleFlatCases: ReadonlyArray<ScRnaSeqCellData> =
  sample_flat_case as ReadonlyArray<ScRnaSeqCellData>;

export const sampleCasesCurrent: CasesData = sampleCases;
export const sampleFlatCasesCurrent: ReadonlyArray<ScRnaSeqCellData> =
  sampleFlatCases;
