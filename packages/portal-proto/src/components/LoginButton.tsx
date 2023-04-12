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
      classNames={{
        root: !fromHeader ? "hover:bg-primary-darker" : "",
        label: fromHeader ? "text-primary-darkest text-sm font-medium" : "",
      }}
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
