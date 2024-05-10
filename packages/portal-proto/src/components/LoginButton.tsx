import openAuthWindow from "@/features/layout/auth/openAuthWindow";
import {
  useGetBannerNotificationsQuery,
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
  const { refetch: fetchNotifications } = useGetBannerNotificationsQuery();
  return (
    <Button
      className={`p-1 ${
        fromHeader
          ? "font-medium text-primary-darkest hover:bg-primary-lightest"
          : "hover:bg-primary-darker"
      }`}
      onClick={async () => {
        fromSession && dispatch(hideModal());
        await openAuthWindow();
        await fetchUserDetails();
        await fetchNotifications();
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
