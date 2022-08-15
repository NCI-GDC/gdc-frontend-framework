import openAuthWindow from "@/features/layout/auth/openAuthWindow";
import {
  fetchNotifications,
  fetchUserDetails,
  hideModal,
  useCoreDispatch,
} from "@gff/core";
import { Button } from "@mantine/core";
import { MdOutlineLogin as LoginIcon } from "react-icons/md";
export const LoginButton = ({
  fromSession,
}: {
  fromSession?: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  return (
    <Button
      className="flex flex-row opacity-60 hover:opacity-100 hover:bg-transparent transition-opacity items-center mx-2 cursor-pointer text-inherit font-normal ml-1 pl-0"
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
          color={fromSession && "#0f4163"}
        />
      }
      variant="subtle"
      compact
      size="md"
      classNames={{
        label: `ml-0 ${fromSession && "text-nci-blue-darkest"}`,
        leftIcon: "mr-0",
      }}
      data-testid="loginButton"
    >
      Login
    </Button>
  );
};
