// typescript
// File: `packages/portal-proto/src/features/proteinpaint/IDCViewerWrapper.tsx`
import React, { FC, useCallback, useState, useEffect, useRef } from "react";
import { PROTEINPAINT_API } from "@gff/core";

/**
 * Cleaned IDCViewerWrapper:
 *  - Hardcoded GDC cases: ["TCGA-FW-A3I3"]
 *  - Automatically runs mapping on mount (no button click required)
 *  - Caches parsed parquet results in Cache Storage (`idc_data.json`)
 */

const SLIM_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/slim/studies/";

const IDCViewerWrapper: FC = () => {
  const [progress, setProgress] = useState<string>("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [gdcCount, setGdcCount] = useState<number | null>(null);
  const [idcCount, setIdcCount] = useState<number | null>(null);
  const [studiesForPatient, setStudiesForPatient] = useState<any[] | null>(
    null,
  );
  const [resolvedPatient, setResolvedPatient] = useState<string | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  const addLog = (s: string) => setLogs((l) => [...l, s]);

  const buildSlimStudyURL = (studyInstanceUID: string) =>
    SLIM_VIEWER_BASE + encodeURIComponent(studyInstanceUID);

  // Helper: resolve case_id -> PatientID using parquet rows
  function resolvePatientIdFromCaseId(
    idc_rows: any[],
    caseIdRaw?: string | null,
  ) {
    const caseId = (caseIdRaw || "").replace(/^['"]|['"]$/g, "");
    if (!caseId) return null;

    // 1) Direct PatientID match
    const direct = idc_rows.find((r) => r.PatientID === caseId);
    if (direct) return direct.PatientID;

    // 2) Try common case-id-like columns
    const probe = idc_rows[0] || {};
    const keys = ["gdc_case_id", "case_id", "CaseID"];
    const presentKey = keys.find((k) => k in probe);
    if (presentKey) {
      const via = idc_rows.find((r) => r[presentKey] === caseId);
      if (via) return via.PatientID;
    }
    return null;
  }

  // getDicomStudiesJS: group filtered rows by StudyInstanceUID and return sorted studies similar to sample
  function getDicomStudiesJS(
    idc_data: any[],
    patientId: string,
    outputFormat = "dict",
  ) {
    const patientList = Array.isArray(patientId)
      ? (patientId as string[])
      : [patientId];
    if (!patientList.every((p) => typeof p === "string")) {
      throw new TypeError("patientId must be a string or list of strings");
    }
    if (!["dict", "df", "list"].includes(outputFormat)) {
      throw new Error("outputFormat must be either 'dict' or 'df' or 'list'");
    }

    const filteredRows = idc_data.filter((row) =>
      patientList.includes(row.PatientID),
    );
    if (filteredRows.length === 0) {
      throw new Error("No matching patientId in index");
    }

    if (outputFormat === "list") {
      const setUIDs = new Set(filteredRows.map((r) => r.StudyInstanceUID));
      return Array.from(setUIDs);
    }

    const studyMap = new Map<
      string,
      {
        StudyInstanceUID: string;
        StudyDateSet: Set<string>;
        StudyDescriptionSet: Set<string>;
        SeriesSet: Set<string>;
      }
    >();
    for (const row of filteredRows) {
      const studyUID = row.StudyInstanceUID;
      if (!studyMap.has(studyUID)) {
        studyMap.set(studyUID, {
          StudyInstanceUID: studyUID,
          StudyDateSet: new Set(),
          StudyDescriptionSet: new Set(),
          SeriesSet: new Set(),
        });
      }
      const agg = studyMap.get(studyUID)!;
      if (row.StudyDate) agg.StudyDateSet.add(row.StudyDate);
      if (row.StudyDescription)
        agg.StudyDescriptionSet.add(row.StudyDescription);
      if (row.SeriesInstanceUID) agg.SeriesSet.add(row.SeriesInstanceUID);
    }

    const studiesArr = Array.from(studyMap.values()).map((study) => ({
      StudyInstanceUID: study.StudyInstanceUID,
      StudyDate: Array.from(study.StudyDateSet).join(", "),
      StudyDescription: Array.from(study.StudyDescriptionSet).join(", "),
      SeriesCount: study.SeriesSet.size,
      SeriesInstanceUIDs: Array.from(study.SeriesSet),
    }));

    studiesArr.sort((a, b) => {
      if (a.StudyDate < b.StudyDate) return -1;
      if (a.StudyDate > b.StudyDate) return 1;
      if (a.StudyDescription < b.StudyDescription) return -1;
      if (a.StudyDescription > b.StudyDescription) return 1;
      if (a.SeriesCount < b.SeriesCount) return -1;
      if (a.SeriesCount > b.SeriesCount) return 1;
      return 0;
    });

    return studiesArr;
  }

  const runMapping = useCallback(async () => {
    // Move the function declaration to the function body root (avoid inner declaration)
    async function fetchGdcCases(limit = 5) {
      try {
        const base = "https://api.gdc.cancer.gov/cases";
        const urlParams = new URLSearchParams(window.location.search);
        const primarySite = urlParams.get("primary_site");

        // Build filter object: op: "and" with optional primary_site constraint
        const filterObj: any = { op: "and", content: [] };
        if (primarySite) {
          filterObj.content.push({
            op: "=",
            content: { field: "cases.primary_site", value: primarySite },
          });
          addLog(`Filtering GDC cases by primary_site=${primarySite}`);
        }

        const filtersEncoded = encodeURIComponent(JSON.stringify(filterObj));
        const url =
          base +
          "?" +
          "size=" +
          encodeURIComponent(String(limit)) +
          "&" +
          "filters=" +
          filtersEncoded +
          "&pretty=true" +
          "&expand=samples.portions.slides" +
          "&fields=submitter_id,disease_type,primary_site";

        addLog(`GDC GET URL: ${url}`);
        const resp = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!resp.ok) throw new Error(`GDC API error ${resp.status}`);
        const json = await resp.json();
        const hits = json?.data?.hits || [];

        // optional local filtering to ensure slides exist
        const filteredHits = hits.filter(
          (hit: any) =>
            hit.samples &&
            hit.samples.some(
              (s: any) =>
                s.portions &&
                s.portions.some((p: any) => p.slides && p.slides.length > 0),
            ),
        );

        addLog(
          `Fetched ${hits.length} hits; ${filteredHits.length} have slides`,
        );

        const submitterIds = filteredHits
          .map((h: any) => h.submitter_id)
          .filter((s: any) => typeof s === "string");

        return submitterIds;
      } catch (e) {
        addLog(`Failed to fetch GDC cases: ${String(e)}`);
        return [];
      }
    }

    try {
      setProgress("Resolving GDC cases (fetching from GDC API)...");
      addLog("Fetching GDC cases from https://api.gdc.cancer.gov/cases");

      // fetch up to N cases to avoid overloading browser parsing
      const fetchedSubmitterIds = await fetchGdcCases(450);
      const cases = fetchedSubmitterIds.slice(0, 450);
      const gdcCases = cases.map((c) => ({ submitter_id: c, case_id: c }));
      setGdcCount(gdcCases.length);
      addLog(`Retrieved ${gdcCases.length} GDC submitter_id(s) from GDC API`);

      setProgress("Loading IDC parquet index (cached or /parquet)...");
      addLog("Preparing to load cached metadata or fetch /parquet");

      // Attempt to load parsed parquet JSON from Cache Storage first
      let idc_data: any[] = [];
      let collection_ids: string[] = [];

      try {
        const cache = await caches.open("idc-download");
        const cacheRequest = new Request("idc_data.json");
        const cachedResponse = await cache.match(cacheRequest);

        if (cachedResponse) {
          addLog("Loaded IDC metadata from cache");
          const cachedBlob = await cachedResponse.blob();
          const cachedJSON = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsText(cachedBlob);
          });
          const parsed = JSON.parse(cachedJSON);
          collection_ids = parsed.collection_ids;
          idc_data = parsed.idc_data;
        } else {
          addLog("Cache miss — fetching parquet via proxy /parquet");
          const hyparquet = (await import("hyparquet")) as any;

          const idc_index_url = `${PROTEINPAINT_API.replace(
            /\/$/,
            "",
          )}/parquet`;
          addLog(`Downloading parquet from ${idc_index_url}...`);
          const idc_index_file = await hyparquet.asyncBufferFromUrl({
            url: idc_index_url,
          });

          // report buffer size when available
          try {
            let sizeDesc = "unknown";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const f: any = idc_index_file;
            if (typeof f?.byteLength === "number")
              sizeDesc = `${f.byteLength} bytes`;
            else if (typeof f?.length === "number")
              sizeDesc = `${f.length} bytes`;
            else if (typeof f?.size === "number") sizeDesc = `${f.size} bytes`;
            addLog(
              `Downloaded parquet buffer from ${idc_index_url} — success${
                sizeDesc !== "unknown" ? `, size: ${sizeDesc}` : ""
              }`,
            );
          } catch {
            addLog(
              `Downloaded parquet buffer from ${idc_index_url} — success (size unavailable)`,
            );
          }

          idc_data = await hyparquet.parquetReadObjects({
            file: idc_index_file,
            columns: [
              "collection_id",
              "PatientID",
              "StudyInstanceUID",
              "SeriesInstanceUID",
              "series_aws_url",
              "StudyDate",
              "StudyDescription",
              "gdc_case_id",
              "case_id",
            ],
          });

          // Build list of all collection_ids
          const collectionQuery = await hyparquet.parquetReadObjects({
            file: idc_index_file,
            columns: ["collection_id"],
          });
          const colSet = new Set<string>();
          collectionQuery.forEach((o: any) => colSet.add(o.collection_id));
          collection_ids = Array.from(colSet);

          // Cache result for next time
          try {
            const jsonString = JSON.stringify({ collection_ids, idc_data });
            const jsonBlob = new Blob([jsonString], {
              type: "application/json",
            });
            await cache.put(cacheRequest, new Response(jsonBlob));
            addLog("Downloaded IDC metadata and cached it");
          } catch (cacheErr) {
            addLog(`Failed to cache IDC metadata: ${String(cacheErr)}`);
          }
        }
      } catch (cacheErr) {
        addLog(
          `Cache handling failed: ${String(
            cacheErr,
          )} — falling back to direct fetch`,
        );
        // Fallback: attempt direct fetch/parse once
        const hyparquet = (await import("hyparquet")) as any;
        const idc_index_url = `${PROTEINPAINT_API}/parquet`;
        const idc_index_file = await hyparquet.asyncBufferFromUrl({
          url: idc_index_url,
        });
        idc_data = await hyparquet.parquetReadObjects({
          file: idc_index_file,
          columns: [
            "collection_id",
            "PatientID",
            "StudyInstanceUID",
            "SeriesInstanceUID",
            "series_aws_url",
            "StudyDate",
            "StudyDescription",
            "gdc_case_id",
            "case_id",
          ],
        });
        const collectionQuery = await hyparquet.parquetReadObjects({
          file: idc_index_file,
          columns: ["collection_id"],
        });
        const colSet = new Set<string>();
        collectionQuery.forEach((o: any) => colSet.add(o.collection_id));
        collection_ids = Array.from(colSet);
      }

      setIdcCount(idc_data.length);
      addLog(`Parsed ${idc_data.length} IDC rows from parquet`);

      setProgress("Mapping GDC cases → IDC rows...");
      const results: any[] = [];
      for (const gc of gdcCases) {
        const submitter = gc.submitter_id ?? gc.case_id ?? null;
        const found: any[] = [];

        if (submitter) {
          // match by PatientID
          found.push(...idc_data.filter((r: any) => r.PatientID === submitter));
        }

        if (gc.case_id) {
          // match columns that may store case ids
          found.push(
            ...idc_data.filter(
              (r: any) =>
                r.gdc_case_id === gc.case_id || r.case_id === gc.case_id,
            ),
          );
        }

        // unique
        const uniq = Array.from(new Set(found));
        results.push({ gdcCase: gc, matches: uniq });
      }

      const matchedCount = results.filter((r) => r.matches.length > 0).length;
      addLog(`Mapping complete: ${matchedCount} GDC cases with >=1 IDC match`);

      // Filter mappings: only keep GDC cases that have at least one match with a viewer link (series_aws_url)
      const resultsWithViewer = results.filter(
        (r) =>
          Array.isArray(r.matches) &&
          r.matches.length > 0 &&
          r.matches.some((m: any) => !!m.series_aws_url),
      );
      addLog(
        `Filtered to ${resultsWithViewer.length} GDC case(s) with at least one IDC match that has a viewer link`,
      );

      setMappings(resultsWithViewer);

      // For the first (and only) hardcoded case, resolve a PatientID and compute studies
      const firstResult =
        resultsWithViewer.length > 0 ? resultsWithViewer[0] : results[0];
      let patientIdForStudies: string | null = null;
      if (
        firstResult &&
        firstResult.matches &&
        firstResult.matches.length > 0
      ) {
        const anyRow =
          firstResult.matches.find((r: any) => !!r.PatientID) ||
          firstResult.matches[0];
        patientIdForStudies =
          anyRow?.PatientID ??
          resolvePatientIdFromCaseId(idc_data, firstResult.gdcCase.case_id);
      } else {
        patientIdForStudies = resolvePatientIdFromCaseId(idc_data, cases[0]);
      }

      if (patientIdForStudies) {
        setResolvedPatient(patientIdForStudies);
        try {
          const studies = getDicomStudiesJS(
            idc_data,
            patientIdForStudies,
            "dict",
          );
          setStudiesForPatient(studies);
          addLog(
            `Resolved patient ${patientIdForStudies} → ${studies.length} studies`,
          );
        } catch (err: any) {
          setStudiesForPatient([]);
          addLog(
            `No studies for resolved patient ${patientIdForStudies}: ${
              err?.message ?? String(err)
            }`,
          );
        }
      } else {
        setResolvedPatient(null);
        setStudiesForPatient(null);
        addLog("Could not resolve PatientID for the hardcoded case");
      }

      setProgress("Ready");
    } catch (err: any) {
      addLog(`Error: ${err?.message ?? String(err)}`);
      setProgress("Error");
    }
  }, []);

  // Auto-run mapping on mount
  useEffect(() => {
    runMapping();
  }, [runMapping]);

  useEffect(() => {
    const root = divRef.current;
    if (!root) return;
    root.style.background = "#fff";
    return () => {
      if (root) root.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={divRef}
      className="idc-viewer-wrapper-root"
      style={{ padding: 12 }}
    >
      <h2>IDCViewer — GDC ↔ IDC mapping</h2>
      <div style={{ fontSize: 13, marginBottom: 8 }}>
        <strong>Progress:</strong> {progress}
      </div>

      <div style={{ fontSize: 13, marginBottom: 8 }}>
        <strong>Counts:</strong> GDC cases: {gdcCount ?? "n/a"} — IDC rows:{" "}
        {idcCount ?? "n/a"}
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Mapping preview</h3>
        <div
          style={{
            maxHeight: 360,
            overflow: "auto",
            background: "#fafafa",
            padding: 8,
            borderRadius: 6,
          }}
        >
          {mappings.length === 0 && <div>No mapping results yet.</div>}
          {mappings.map((m, idx) => {
            const caseId =
              m.gdcCase.submitter_id ??
              m.gdcCase.case_id ??
              m.gdcCase.case_uuid ??
              "(no id)";
            const isTargetCase = caseId === "TCGA-FW-A3I3";
            const firstMatch =
              m.matches && m.matches.length > 0 ? m.matches[0] : null;
            return (
              <div
                key={idx}
                style={{
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{caseId}</div>

                {isTargetCase && firstMatch && firstMatch.series_aws_url && (
                  <div style={{ marginTop: 8 }}>
                    <div
                      style={{ fontSize: 12, color: "#666", marginBottom: 6 }}
                    >
                      WSI preview:
                    </div>
                    <a
                      href={firstMatch.series_aws_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={firstMatch.series_aws_url}
                        alt={`WSI for ${caseId}`}
                        style={{
                          maxWidth: 320,
                          maxHeight: 240,
                          border: "1px solid #ddd",
                          borderRadius: 4,
                        }}
                      />
                    </a>
                  </div>
                )}

                {m.matches.length > 0 && (
                  <div style={{ marginTop: 6, marginBottom: 4 }}>
                    <div style={{ fontSize: 13 }}>
                      Matches: {m.matches.length}
                    </div>
                    {/* Render a single StudyInstanceUID link (first available) */}
                    {(() => {
                      const firstUID = m.matches.find(
                        (x: any) => x && x.StudyInstanceUID,
                      )?.StudyInstanceUID;
                      return firstUID ? (
                        <div style={{ marginTop: 6 }}>
                          <a
                            href={buildSlimStudyURL(firstUID)}
                            target="_blank"
                            rel="noreferrer"
                            style={{ wordBreak: "break-all" }}
                          >
                            StudyInstanceUID: {firstUID}
                          </a>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Studies for resolved patient</h3>
        <div
          style={{
            maxHeight: 420,
            overflow: "auto",
            background: "#fafafa",
            padding: 8,
            borderRadius: 6,
          }}
        >
          {!resolvedPatient && <div>No patient resolved yet.</div>}
          {resolvedPatient && studiesForPatient === null && (
            <div>Loading studies...</div>
          )}
          {resolvedPatient &&
            Array.isArray(studiesForPatient) &&
            studiesForPatient.length === 0 && (
              <div>No studies found for {resolvedPatient}</div>
            )}
          {resolvedPatient &&
            Array.isArray(studiesForPatient) &&
            studiesForPatient.map((study: any) => (
              <div
                key={study.StudyInstanceUID}
                style={{
                  background: "#fff",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 8,
                  border: "1px solid #ddd",
                }}
              >
                <div style={{ fontWeight: 600, wordBreak: "break-all" }}>
                  Study: {study.StudyInstanceUID}
                </div>
                <div style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
                  StudyDate: {study.StudyDate || "(none)"} — SeriesCount:{" "}
                  {study.SeriesCount}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() =>
                      window.open(
                        buildSlimStudyURL(study.StudyInstanceUID),
                        "_blank",
                      )
                    }
                  >
                    Open in Slim Viewer (Study)
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Debug log</h3>
        <div
          style={{
            maxHeight: 220,
            overflow: "auto",
            background: "#111",
            color: "#fff",
            padding: 8,
            borderRadius: 6,
          }}
        >
          {logs.map((l, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IDCViewerWrapper;
