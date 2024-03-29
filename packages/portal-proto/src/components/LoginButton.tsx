import openAuthWindow from "@/features/layout/auth/openAuthWindow";
import {
  fetchNotifications,
  hideModal,
  useCoreDispatch,
  useLazyFetchUserDetailsQuery,
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
  const [fetchUserDetails] = useLazyFetchUserDetailsQuery();
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
        await fetchUserDetails();
        await dispatch(fetchNotifications());
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
