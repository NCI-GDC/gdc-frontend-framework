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
}: {
  fromSession?: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  return (
    <Button
      className={`flex flex-row ${
        fromSession
          ? "opacity-80 text-primary-dark ml-0 hover:text-primary-darkest"
          : "opacity-60 text-inherit font-normal ml-1"
      } hover:opacity-100 hover:bg-transparent transition-opacity mx-2 cursor-pointer pl-0`}
      onClick={async () => {
        fromSession && dispatch(hideModal());
        await openAuthWindow();
        await dispatch(fetchUserDetails());
        await dispatch(fetchNotifications());
      }}
      leftIcon={
        <LoginIcon
          className="mr-1"
          size="24px"
          color={fromSession && theme.extend.colors["nci-blue"].darkest}
        />
      }
      variant="subtle"
      compact
      size="md"
      classNames={{
        leftIcon: `mr-0 ml-1 ${fromSession && "opacity-90"}`,
      }}
      data-testid="loginButton"
    >
      Login
    </Button>
  );
};
