import { getFormattedTimestamp } from "src/utils/date";
import saveAs from "file-saver";

export const exportCohort = (
  caseIds: readonly Record<string, any>[],
  cohortName: string,
) => {
  const tsv = `id\n${caseIds.map((c) => c.case_id).join("\n")}`;
  const blob = new Blob([tsv], { type: "text/tsv" });
  saveAs(
    blob,
    `cohort_${cohortName.replace(
      /[^A-Za-z0-9_.]/g,
      "_",
    )}.${getFormattedTimestamp()}.tsv`,
  );
};
