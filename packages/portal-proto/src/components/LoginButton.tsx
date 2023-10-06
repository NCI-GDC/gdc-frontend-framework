import openAuthWindow from "@/features/layout/auth/openAuthWindow";
import {
  fetchNotifications,
  fetchUserDetails,
  hideModal,
  useCoreDispatch,
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
  return (
    <Button
      className="flex items-center text-primary-darkest text-sm font-medium gap-1 font-heading p-1 hover:rounded-md hover:bg-primary-lightest"
      onClick={async () => {
        fromSession && dispatch(hideModal());
        await openAuthWindow();
        await dispatch(fetchUserDetails());
        await dispatch(fetchNotifications());
      }}
      leftIcon={
        fromHeader ? (
          <LoginIcon
            className="m-0"
            size="24px"
            color={theme.extend.colors["nci-blue"].darkest}
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
