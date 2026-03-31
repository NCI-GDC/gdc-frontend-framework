import React, { FC } from "react";
import { AnchorLink } from "@/components/AnchorLink";
import type { IDCStudy, IDCViewerRenderSubProps } from "./types";

const SLIM_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/slim/studies/";

const buildSlimStudyURL = (studyInstanceUID: string) =>
  SLIM_VIEWER_BASE + encodeURIComponent(studyInstanceUID);

const CT_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/v3/viewer/";

// Accept the `row` object passed by VerticalTable's renderSubComponent
interface IDCStudyRowsComponentProps {
  row: IDCViewerRenderSubProps["row"];
}

const IDCStudyRowsComponent: FC<IDCStudyRowsComponentProps> = ({ row }) => {
  const studies: IDCStudy[] = (row.original?.studiesList as IDCStudy[]) ?? [];
  if (!studies || studies.length === 0) return null;
  return (
    <div className="p-2 bg-base-max">
      <table
        style={{
          width: "100%",
          fontSize: 13,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr className="text-left border-b border-gdc-grey-lighter">
            <th style={{ padding: 6 }}>IDC StudyInstanceUID</th>
            <th style={{ padding: 6 }}>StudyDate</th>
            <th style={{ padding: 6 }}>StudyDescription</th>
            <th style={{ padding: 6 }}>IDC WSI viewer</th>
            <th style={{ padding: 6 }}>IDC Radiology viewer</th>
          </tr>
        </thead>
        <tbody>
          {studies.map((s, i) => {
            const wsiLink =
              s.hasWSI && s.StudyInstanceUID
                ? buildSlimStudyURL(s.StudyInstanceUID)
                : null;
            const radioLink =
              s.hasRadiology && s.StudyInstanceUID
                ? CT_VIEWER_BASE +
                  "?StudyInstanceUIDs=" +
                  encodeURIComponent(s.StudyInstanceUID)
                : null;
            return (
              <tr
                key={s.StudyInstanceUID || i}
                className={i % 2 === 0 ? "bg-base-max" : "bg-gdc-grey-lightest"}
              >
                <td
                  style={{
                    padding: 6,
                    wordBreak: "break-all",
                  }}
                >
                  {s.StudyInstanceUID ?? "(/)"}
                </td>
                <td style={{ padding: 6 }}>{s.StudyDate ?? "-"}</td>
                <td style={{ padding: 6 }}>{s.StudyDescription ?? "-"}</td>
                <td style={{ padding: 6 }}>
                  {wsiLink ? (
                    <AnchorLink href={wsiLink} title="Open study" />
                  ) : (
                    <span className="text-gdc-grey">-</span>
                  )}
                </td>
                <td style={{ padding: 6 }}>
                  {radioLink ? (
                    <AnchorLink href={radioLink} title="Open study" />
                  ) : (
                    <span className="text-gdc-grey">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IDCStudyRowsComponent;
