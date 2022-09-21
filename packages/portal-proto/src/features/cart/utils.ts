import { groupBy, intersection } from "lodash";
import { CartFile, UserInfo } from "@gff/core";

export const groupByAccess = (
  cart: CartFile[],
  user: UserInfo,
): Record<string, CartFile[]> => {
  const mappedData = cart.map((file) => {
    if (file.access === "open") {
      return { ...file, canAccess: true };
    } else if (!user && file.access === "controlled") {
      return { ...file, canAccess: false };
    } else if (
      Object.keys(user?.projects?.gdc_ids || {}).includes(file.project_id) ||
      intersection(
        Object.keys(user?.projects?.phs_ids || {}).filter(
          (p) => user.projects.phs_ids[p].indexOf("_member_") !== -1,
        ),
        file.acl,
      ).length !== 0
    ) {
      return { ...file, canAccess: true };
    } else {
      return { ...file, canAccess: false };
    }
  });

  return groupBy(mappedData, "canAccess");
};
