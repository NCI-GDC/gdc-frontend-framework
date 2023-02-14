import { DataStatus, GdcFile } from "@gff/core";
/**
 * convert hooks 3 boolean status to DataStatus
 * @param isFetching
 * @param isSuccess
 * @param isError
 */

export const statusBooleansToDataStatus = (
  isFetching: boolean,
  isSuccess: boolean,
  isError: boolean,
): DataStatus => {
  return isFetching
    ? "pending"
    : isSuccess
    ? "fulfilled"
    : isError
    ? "rejected"
    : "uninitialized";
};

export const getAnnotationsLinkParamsFromFiles = (
  file: GdcFile,
): string | null => {
  // Due to limitation in the length of URI, we decided to cap a link to be created for files which has < 150 annotations for now
  // 150 annotations was a safe number. It was tested in Chrome, Firefox, Safari and Edge.
  // TODO: Follow Up Ticket - https://jira.opensciencedatacloud.org/browse/PEAR-758
  const MAX_ANNOATATION_COUNT = 150;
  if (!file?.annotations || file.annotations.length > MAX_ANNOATATION_COUNT)
    return null;

  if (file?.annotations?.length === 1) {
    return `https://portal.gdc.cancer.gov/annotations/${file.annotations[0].annotation_id}`;
  }
  return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.annotation_id","value":[${[
    file.annotations.map((annotation) => `"${annotation.annotation_id}"`),
  ]}]},"op":"in"}],"op":"and"}`;
};
