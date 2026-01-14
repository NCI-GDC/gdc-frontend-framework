// typescript
import React, { FC } from "react";
import { useAllCases, useCurrentCohortCounts } from "@gff/core";

const PAGE_SIZE = 500;

const IDCViewerSimpleWrapper: FC = () => {
  const cohortCounts = useCurrentCohortCounts();
  const gdcCount = cohortCounts?.data?.caseCount ?? null;

  const { data: casesPageData, isFetching } = useAllCases({
    // minimal fields to show basic case info
    fields: [
      "submitter_id",
      "case_id",
      "disease_type",
      "primary_site",
      // TODO add expand?
      //expand: ["samples.portions.slides"],
    ],
    size: PAGE_SIZE,
    from: 0,
  });

  const cases = casesPageData || [];

  return (
    <div style={{ padding: 12 }}>
      <h2>IDCViewer — first {PAGE_SIZE} GDC cases</h2>

      <div style={{ fontSize: 13, marginBottom: 8 }}>
        <strong>Total GDC cases:</strong> {gdcCount ?? "n/a"}
      </div>

      <div style={{ fontSize: 13, marginBottom: 8 }}>
        <strong>Loaded cases:</strong>{" "}
        {isFetching ? "Loading..." : cases.length}
      </div>

      <div>
        <ul style={{ paddingLeft: 16 }}>
          {cases.length === 0 ? (
            <li>No cases returned</li>
          ) : (
            cases.map((c: any, i: number) => {
              const key = c.case_id ?? c.submitter_id ?? `idx-${i}`;
              return (
                <li key={key} style={{ marginBottom: 6 }}>
                  <strong>{c.submitter_id ?? "(no submitter_id)"}</strong>
                  {c.case_id ? ` — ${c.case_id}` : ""}
                  {c.disease_type ? ` — ${c.disease_type}` : ""}
                  {c.primary_site ? ` — ${c.primary_site}` : ""}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default IDCViewerSimpleWrapper;
