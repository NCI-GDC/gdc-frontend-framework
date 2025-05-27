import React, { useCallback, useEffect, useRef } from "react";
import { Button, Menu } from "@mantine/core";
import saveAs from "file-saver";
import urlJoin from "url-join";
import {
  GDC_AUTH,
  showModal,
  Modals,
  useCoreDispatch,
  useFetchUserDetailsQuery,
  useLazyFetchTokenQuery,
  setIsLoggedIn,
  selectCohortIsLoggedIn,
  useCoreSelector,
  usePrevious,
} from "@gff/core";
import { LoginButton } from "@/components/LoginButton";
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import {
  ArrowDropDownIcon,
  DownloadIcon,
  LogoutIcon,
  PersonIcon,
} from "@/utils/icons";

const LoginButtonOrUserDropdown = () => {
  const dispatch = useCoreDispatch();
  const { data: userInfo } = useFetchUserDetailsQuery();
  const prevUserStatus = usePrevious(userInfo?.status);
  const userDropdownRef = useRef<HTMLButtonElement>();
  const [fetchToken] = useLazyFetchTokenQuery({ refetchOnFocus: false });
  const cohortIsLoggedIn = useCoreSelector((state) =>
    selectCohortIsLoggedIn(state),
  );

  useEffect(() => {
    // User's session has expired
    if (userInfo?.status === 401 && prevUserStatus === 200) {
      dispatch(showModal({ modal: Modals.SessionExpireModal }));
    }
  }, [prevUserStatus, userInfo?.status, dispatch]);

  useDeepCompareEffect(() => {
    if (userInfo?.data?.username) {
      if (cohortIsLoggedIn !== true) {
        dispatch(setIsLoggedIn(true));
      }
    } else {
      if (cohortIsLoggedIn !== false || cohortIsLoggedIn !== undefined) {
        dispatch(setIsLoggedIn(false));
      }
    }
  }, [cohortIsLoggedIn, userInfo?.data?.username, dispatch]);

  const handleUserProfileClick = useDeepCompareCallback(() => {
    dispatch(showModal({ modal: Modals.UserProfileModal }));
    // This is done inorder to set the last focused element as the menu target element
    // This is done to return focus to the target element if the modal is closed with ESC
    userDropdownRef?.current?.focus();
  }, [dispatch]);

  const handleDownloadTokenClick = useDeepCompareCallback(async () => {
    if (Object.keys(userInfo?.data?.projects.gdc_ids ?? {}).length > 0) {
      try {
        const token = await fetchToken().unwrap();
        if (token.status === 401) {
          dispatch(showModal({ modal: Modals.SessionExpireModal }));
        } else {
          saveAs(
            new Blob([token.data], {
              type: "text/plain;charset=us-ascii",
            }),
            `gdc-user-token.${new Date().toISOString()}.txt`,
          );
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    } else {
      handleUserProfileClick();
    }
  }, [fetchToken, userInfo, dispatch, handleUserProfileClick]);

  const handleLogoutClick = useCallback(() => {
    window.location.assign(
      urlJoin(GDC_AUTH, `logout?next=${window.location.href}`),
    );
  }, []);

  return (
    <>
      {userInfo?.data?.username ? (
        <Menu
          width={200}
          offset={-5}
          position="bottom-end"
          classNames={{
            dropdown: "border-primary-darker shadow-xl",
            item: "text-base-darker data-hovered:bg-accent-lightest data-hovered:text-accent-contrast-lightest",
          }}
        >
          <Menu.Target data-testid="button-header-username">
            <Button
              rightSection={<ArrowDropDownIcon size="2em" aria-hidden="true" />}
              variant="subtle"
              className="text-primary-darkest font-header text-sm font-medium font-heading"
              classNames={{ section: "ml-0" }}
              ref={userDropdownRef}
            >
              {userInfo?.data?.username}
            </Button>
          </Menu.Target>
          <Menu.Dropdown data-testid="dropdown-menu-options">
            <Menu.Item
              leftSection={<PersonIcon size="1.25em" />}
              onClick={handleUserProfileClick}
              data-testid="button-header-user-profile"
            >
              User Profile
            </Menu.Item>
            <Menu.Item
              leftSection={<DownloadIcon size="1.25em" />}
              data-testid="button-header-download-token"
              onClick={handleDownloadTokenClick}
            >
              Download Token
            </Menu.Item>
            <Menu.Item
              leftSection={<LogoutIcon size="1.25em" />}
              onClick={handleLogoutClick}
              data-testid="button-header-logout"
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <LoginButton fromHeader />
      )}
    </>
  );
};

export default LoginButtonOrUserDropdown;
