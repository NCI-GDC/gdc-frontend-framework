import React from "react";
import TableRowsProvider from "./TableRowsProvider";

type Props = {
  mappings: any[];
  expandedCases: Set<string>;
  toggleExpanded: (caseId: string) => void;
  buildSlimStudyURL: (uid: string) => string;
};

const TableView: React.FC<Props> = ({
  mappings,
  expandedCases,
  toggleExpanded,
  buildSlimStudyURL,
}) => {
  return (
    <>
      <style>
        {`
          .idc-mapping-table {
            border-collapse: collapse;
          }
          .idc-mapping-table tbody tr:hover {
            background: #fff9e6 !important;
          }
          .idc-mapping-table thead th {
            position: sticky;
            top: 0;
            background: #fafafa;
            z-index: 4;
            padding: 6px 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
        `}
      </style>

      <table
        className="idc-mapping-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          background: "#fafafa",
          borderRadius: 6,
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: "6px 8px" }}>GDC caseId</th>
            <th style={{ padding: "6px 8px" }}>IDC StudyInstanceUUID</th>
            <th style={{ padding: "6px 8px" }}>StudyDate</th>
            <th style={{ padding: "6px 8px" }}>StudyDescription</th>
            <th style={{ padding: "6px 8px" }}>WSI link</th>
            <th style={{ padding: "6px 8px" }}>Radiology Link</th>
          </tr>
        </thead>
        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 12 }}>
                Loading GDC - IDC mappings
              </td>
            </tr>
          ) : (
            mappings.map((m, idx) =>
              // TableRowsProvider returns an array of rows (ReactNodes) for this mapping
              TableRowsProvider({
                mapping: m,
                idx,
                expandedCases,
                toggleExpanded,
                buildSlimStudyURL,
              }),
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default TableView;
