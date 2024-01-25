import openAuthWindow from "@/features/layout/auth/openAuthWindow";
import {
  fetchCohortCaseCounts,
  fetchNotifications,
  fetchUserDetails,
  hideModal,
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortId,
} from "@gff/core";
import { Button } from "@mantine/core";
import { MdOutlineLogin as LoginIcon } from "react-icons/md";
import { theme } from "tailwind.config";
export const LoginButton = ({
  fromSession,
  fromHeader,
}: {
  fromSession?: boolean;
  fromHeader?: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const currentCohortId = useCoreSelector((state) =>
    selectCurrentCohortId(state),
  );
  return (
    <Button
      className={`${
        fromHeader
          ? "font-medium text-primary-darkest p-1 pr-2 hover:bg-primary-lightest"
          : "hover:bg-primary-darker"
      }`}
      onClick={async () => {
        fromSession && dispatch(hideModal());
        await openAuthWindow();
        await dispatch(fetchUserDetails());
        await dispatch(fetchNotifications());
        await dispatch(fetchCohortCaseCounts(currentCohortId));
        // refresh the cohort here
      }}
      leftIcon={
        fromHeader ? (
          <LoginIcon
            className="m-0"
            size="24px"
            color={theme.extend.colors["nci-blue"].darkest}
            aria-hidden="true"
          />
        ) : undefined
      }
      variant={fromHeader ? "subtle" : "filled"}
      compact={fromHeader}
      data-testid="loginButton"
    >
      Login
    </Button>
  );
};
