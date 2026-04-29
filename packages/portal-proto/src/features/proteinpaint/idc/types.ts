import type { Row } from "@tanstack/react-table";

export type IDCStudy = {
  StudyInstanceUID: string;
  collectionId: string;
  series: any[];
  hasWSI: boolean;
  hasRadiology: boolean;
  StudyDate?: string;
  StudyDescription?: string | null;
};

export type IDCViewerRow = {
  caseId: string;
  programName: string;
  project: string;
  studiesList: IDCStudy[];
  studiesCount: number;
  wsiCount: number;
  radiologyCount: number;
};

// Props for VerticalTable.renderSubComponent: row resembles a TanStack Row
// wrapping the IDCViewerRow data. Exported so subcomponents can reuse the type.
export type IDCViewerRenderSubProps = {
  row: Row<IDCViewerRow>;
  clickedColumnId?: string | null;
};

// Type for a single row read from the IDC parquet index.
export type IDCParquetData = {
  PatientID: string;
  collection_id: string;
  StudyInstanceUID: string;
  StudyDate: string;
  StudyDescription: string;
  study_type: string;
  gdc_case_id: string;
};
