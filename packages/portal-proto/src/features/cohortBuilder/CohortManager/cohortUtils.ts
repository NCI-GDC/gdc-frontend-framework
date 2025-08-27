import { getFormattedTimestamp } from "src/utils/date";
import saveAs from "file-saver";
import { NextRouter } from "next/router";

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

export const removeQueryParamsFromRouter = (
  router: NextRouter,
  removeList: string[] = [],
): void => {
  if (removeList.length > 0) {
    removeList.forEach((param) => delete router.query[param]);
  } else {
    // Remove all
    Object.keys(router.query).forEach((param) => delete router.query[param]);
  }
  router.replace(
    {
      pathname: router.pathname,
      query: router.query,
    },
    undefined,
    { shallow: true },
  );
};
