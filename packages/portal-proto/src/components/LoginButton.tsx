import React, { JSX } from "react";
import openAuthWindow from "@/features/layout/auth/openAuthWindow";
import { LoginIcon } from "@/utils/icons";
import {
  hideModal,
  useCoreDispatch,
  useLazyFetchUserDetailsQuery,
} from "@gff/core";
import { Button } from "@mantine/core";
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
      data-testid="button-header-login"
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
    >
      Login
    </Button>
  );
};
