import type { Row } from "@tanstack/react-table";

export type IDCStudy = {
  StudyInstanceUID: string;
  series: any[];
  hasWSI: boolean;
  hasRadiology: boolean;
  StudyDate?: string;
  StudyDescription?: string | null;
};

export type IDCViewerRow = {
  caseId: string;
  programName: string;
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
