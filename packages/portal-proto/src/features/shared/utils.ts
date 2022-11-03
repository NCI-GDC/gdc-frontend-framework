import { DataStatus } from "@gff/core";
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
