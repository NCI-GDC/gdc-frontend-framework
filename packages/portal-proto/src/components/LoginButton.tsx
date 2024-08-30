import openAuthWindow from "@/features/layout/auth/openAuthWindow";
import {
  hideModal,
  useCoreDispatch,
  useLazyFetchUserDetailsQuery,
  useLazyGetBannerNotificationsQuery,
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
  const [fetchNotifications] = useLazyGetBannerNotificationsQuery();
  return (
    <Button
      className={`p-1 ${
        fromHeader
          ? "font-medium text-primary-darkest hover:bg-primary-lightest"
          : "hover:bg-primary-darker"
      }`}
      onClick={async () => {
        if (fromSession) {
          dispatch(hideModal());
        }
        await openAuthWindow();
        await fetchUserDetails();
        await fetchNotifications();
      }}
      leftSection={
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
      size={fromHeader ? "compact-sm" : undefined}
      data-testid="loginButton"
    >
      Login
    </Button>
  );
};
