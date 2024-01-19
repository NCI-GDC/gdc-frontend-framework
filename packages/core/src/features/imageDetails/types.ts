import { DataStatus } from "../../dataAccess";

export interface edgeDetails {
  readonly file_id: string;
  readonly submitter_id: string;
}

export interface edges {
  [caseSubmitterId: string]: Array<edgeDetails>;
}

export interface ImageViewerInfo {
  edges: edges;
  total: number;
}

export interface imageViewerInitialState {
  readonly status: DataStatus;
  readonly total: number;
  readonly edges: any;
  readonly requestId?: string;
}

export interface files {
  hits: {
    edges: Array<{
      node: {
        file_id: string;
        submitter_id: string;
      };
    }>;
  };
}

export interface node {
  node: {
    slides: {
      hits: {
        edges: Array<{
          node: {
            number_proliferating_cells: number | null;
            percent_eosinophil_infiltration: number | null;
            percent_granulocyte_infiltration: number | null;
            percent_inflam_infiltration: number | null;
            percent_lymphocyte_infiltration: number | null;
            percent_monocyte_infiltration: number | null;
            percent_neutrophil_infiltration: number | null;
            percent_necrosis: number | null;
            percent_normal_cells: number | null;
            percent_stromal_cells: number | null;
            percent_tumor_cells: number | null;
            percent_tumor_nuclei: number | null;
            section_location: string | null;
            slide_id: string | null;
            submitter_id: string | null;
          };
        }>;
      };
    };
  };
}

export interface samples {
  hits: {
    edges: Array<{
      node: {
        portions: {
          hits: {
            edges: Array<{
              node: node;
            }>;
          };
        };
      };
    }>;
  };
}

export interface caseNodeType {
  readonly case_id: string;
  readonly files: files;
  readonly id: string;
  readonly projects: {
    project_id: string;
  };
  readonly samples: samples;
  readonly submitter_id: string;
}
