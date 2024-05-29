import { LoggedInContext } from "@/utils/contexts";
import { useContext } from "react";

export type useIsLoggedInType = () => boolean;

/**
 * Returns true if the user is logged in
 * @category Hooks
 */
export const useIsLoggedIn: useIsLoggedInType = (): boolean => {
  const { isLoggedIn } = useContext(LoggedInContext);
  return isLoggedIn;
};
