import React from "react";

/**
 * TableRowsProvider: build table rows for a single mapping result
 *
 * Props (as input object because this function returns rows directly):
 * - mapping: the mapping object { gdcCase, matches }
 * - idx: index in list (for zebra/background)
 * - expandedCases: Set<string>
 * - toggleExpanded: (caseId) => void
 * - buildSlimStudyURL: (uid) => string
 *
 * Returns: React.ReactNode[] (rows)
 */
export default function TableRowsProvider({
  mapping,
  idx,
  expandedCases,
  toggleExpanded,
  buildSlimStudyURL,
}: {
  mapping: any;
  idx: number;
  expandedCases: Set<string>;
  toggleExpanded: (caseId: string) => void;
  buildSlimStudyURL: (uid: string) => string;
}) {
  const m = mapping;
  const caseId =
    m.gdcCase.submitter_id ??
    m.gdcCase.case_id ??
    m.gdcCase.case_uuid ??
    "(no id)";

  const studiesMap = new Map<
    string,
    {
      StudyInstanceUID: string | null;
      series: { SeriesInstanceUID?: string | null; Modality?: string | null }[];
      hasRadiology: boolean;
      hasWSI: boolean;
      StudyDate?: string | null;
      StudyDescription?: string | null;
    }
  >();

  if (Array.isArray(m.matches)) {
    for (const row of m.matches) {
      const studyId = row?.StudyInstanceUID ?? null;
      const key = studyId ?? "__NO_STUDY__";
      let existing = studiesMap.get(key);
      if (!existing) {
        existing = {
          StudyInstanceUID: studyId,
          series: [],
          hasRadiology: false,
          hasWSI: false,
          StudyDate: row?.StudyDate ?? null,
          StudyDescription: row?.StudyDescription ?? null,
        };
        studiesMap.set(key, existing);
      }
      existing.series.push({
        SeriesInstanceUID: row?.SeriesInstanceUID ?? null,
        Modality: row?.Modality ?? null,
      });
      if (!existing.StudyDate && row?.StudyDate)
        existing.StudyDate = row.StudyDate;
      if (!existing.StudyDescription && row?.StudyDescription)
        existing.StudyDescription = row.StudyDescription;
      const mod = (row?.Modality ?? "").toString().trim().toUpperCase();
      if (mod === "SM") {
        existing.hasWSI = true;
      } else if (mod === "CT" || mod === "MRI" || mod === "PET") {
        existing.hasRadiology = true;
      } else if (mod) {
        existing.hasRadiology = true;
      }
    }
  }

  const studiesList = Array.from(studiesMap.values());
  const isExpanded = expandedCases.has(caseId);
  const rows: React.ReactNode[] = [];

  const isEvenStudy = idx % 2 === 0;
  const studyBg = isEvenStudy ? "#f5f6f7" : "#eef0f2";

  rows.push(
    <tr
      key={`${idx}-case`}
      style={{
        borderTop: "1px solid #eee",
        cursor: "pointer",
        background: studyBg,
      }}
      onClick={() => toggleExpanded(caseId)}
    >
      <td style={{ padding: "6px 8px" }}>{caseId}</td>
      <td
        style={{
          padding: "6px 8px",
          wordBreak: "break-all",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>
          {studiesList.length > 0 ? `${studiesList.length} study(s)` : "(/)"}
        </span>
        <span style={{ fontSize: 14 }}>{isExpanded ? "↓" : "↑"}</span>
      </td>
      <td style={{ padding: "6px 8px" }}>
        {!isExpanded ? "" : <span>-</span>}
      </td>
      <td style={{ padding: "6px 8px" }}>
        {!isExpanded ? "" : <span>-</span>}
      </td>
      <td style={{ padding: "6px 8px" }}>
        <span style={{ color: "#666" }}>-</span>
      </td>
      <td style={{ padding: "6px 8px" }}>
        <span style={{ color: "#666" }}>-</span>
      </td>
    </tr>,
  );

  if (isExpanded) {
    studiesList.forEach((study, si) => {
      const studyUID = study.StudyInstanceUID;
      const studyIdcLink =
        studyUID && study.hasWSI ? buildSlimStudyURL(studyUID) : null;
      const studyRadiologyLink =
        studyUID && study.hasRadiology
          ? "https://viewer.imaging.datacommons.cancer.gov/v3/viewer/?StudyInstanceUIDs=" +
            encodeURIComponent(studyUID)
          : null;

      const seriesBg = si % 2 === 0 ? "#fbfbfd" : "#f2f2f2";

      rows.push(
        <tr key={`${idx}-study-${si}`} style={{ background: seriesBg }}>
          <td style={{ padding: "6px 8px" }}>{caseId}</td>
          <td style={{ padding: "6px 8px", wordBreak: "break-all" }}>
            {studyUID ?? "(/)"}
          </td>
          <td style={{ padding: "6px 8px" }}>{study.StudyDate ?? "(/)"}</td>
          <td style={{ padding: "6px 8px", wordBreak: "break-all" }}>
            {study.StudyDescription ?? "(/)"}
          </td>
          <td style={{ padding: "6px 8px" }}>
            {studyIdcLink ? (
              <a
                href={studyIdcLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Open study
              </a>
            ) : (
              <span style={{ color: "#666" }}>-</span>
            )}
          </td>
          <td style={{ padding: "6px 8px" }}>
            {studyRadiologyLink ? (
              <a
                href={studyRadiologyLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Open study
              </a>
            ) : (
              <span style={{ color: "#666" }}>-</span>
            )}
          </td>
        </tr>,
      );
    });
  }

  return rows;
}
