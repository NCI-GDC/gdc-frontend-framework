import { groupBy } from "lodash";
import { CartFile, UserInfo } from "@gff/core";
import { userCanDownloadFile } from "src/utils/userProjectUtils";

export const groupByAccess = (
  cart: CartFile[],
  user: UserInfo,
): Record<string, CartFile[]> => {
  const mappedData = cart.map((file) => ({
    ...file,
    canAccess: userCanDownloadFile({ user, file }),
  }));

  return groupBy(mappedData, "canAccess");
};
