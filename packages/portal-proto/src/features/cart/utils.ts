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

// 5GB
const MAX_CART_SIZE = 5 * 10e8;
export const cartAboveLimit = (
  filesByCanAccess: Record<string, CartFile[]>,
) => {
  return (
    filesByCanAccess.true
      ?.map((file) => file.file_size)
      .reduce((a, b) => a + b) > MAX_CART_SIZE
  );
};
