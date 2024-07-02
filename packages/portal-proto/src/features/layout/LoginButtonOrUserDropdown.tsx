import React, { useRef } from "react";
import { Button, Menu } from "@mantine/core";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import {
  MdLogout as LogoutIcon,
  MdArrowDropDown as ArrowDropDownIcon,
} from "react-icons/md";
import { FaDownload, FaUserCheck } from "react-icons/fa";
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
} from "@gff/core";
import { LoginButton } from "@/components/LoginButton";
import { theme } from "tailwind.config";
import { useDeepCompareEffect } from "use-deep-compare";

const LoginButtonOrUserDropdown = () => {
  const dispatch = useCoreDispatch();
  const { data: userInfo } = useFetchUserDetailsQuery();
  const userDropdownRef = useRef<HTMLButtonElement>();
  const [fetchToken] = useLazyFetchTokenQuery({ refetchOnFocus: false });
  const cohortIsLoggedIn = useCoreSelector((state) =>
    selectCohortIsLoggedIn(state),
  );

  useDeepCompareEffect(() => {
    if (userInfo?.data?.username) {
      cohortIsLoggedIn !== true && dispatch(setIsLoggedIn(true));
    } else {
      (cohortIsLoggedIn !== false || cohortIsLoggedIn !== undefined) &&
        dispatch(setIsLoggedIn(false));
    }
  }, [cohortIsLoggedIn, userInfo?.data?.username, dispatch]);

  return (
    <>
      {userInfo?.data?.username ? (
        <Menu
          width={200}
          data-testid="userdropdown"
          offset={-5}
          position="bottom-end"
          classNames={{
            dropdown: "border-primary-darker shadow-xl",
            item: "text-base-darker data-hovered:bg-accent-lightest data-hovered:text-accent-contrast-lightest",
          }}
        >
          <Menu.Target>
            <Button
              rightSection={<ArrowDropDownIcon size="2em" aria-hidden="true" />}
              variant="subtle"
              className="text-primary-darkest font-header text-sm font-medium font-heading"
              classNames={{ section: "ml-0" }}
              data-testid="usernameButton"
              ref={userDropdownRef}
            >
              {userInfo?.data?.username || "TEST"}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<FaUserCheck size="1.25em" />}
              onClick={async () => {
                dispatch(showModal({ modal: Modals.UserProfileModal }));
                // This is done inorder to set the last focused element as the menu target element
                // This is done to return focus to the target element if the modal is closed with ESC
                userDropdownRef?.current && userDropdownRef?.current?.focus();
              }}
              data-testid="userprofilemenu"
            >
              User Profile
            </Menu.Item>
            <Menu.Item
              leftSection={<FaDownload size="1.25em" />}
              data-testid="downloadTokenMenuItem"
              onClick={async () => {
                if (Object.keys(userInfo?.data?.projects.gdc_ids).length > 0) {
                  await fetchToken()
                    .unwrap()
                    .then((token) => {
                      if (token.status === 401) {
                        dispatch(
                          showModal({ modal: Modals.SessionExpireModal }),
                        );
                        return;
                      }
                      saveAs(
                        new Blob([token.data], {
                          type: "text/plain;charset=us-ascii",
                        }),
                        `gdc-user-token.${new Date().toISOString()}.txt`,
                      );
                    });
                } else {
                  cleanNotifications();
                  showNotification({
                    message: (
                      <p>
                        {userInfo?.data.username} does not have access to any
                        protected data within the GDC. Click{" "}
                        <a
                          href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: "underline",
                            color: theme.extend.colors["nci-blue"].darkest,
                          }}
                        >
                          here
                        </a>{" "}
                        to learn more about obtaining access to protected data.
                      </p>
                    ),
                    styles: () => ({
                      root: {
                        textAlign: "center",
                      },
                      closeButton: {
                        color: "black",
                        "&:hover": {
                          backgroundColor:
                            theme.extend.colors["gdc-grey"].lighter,
                        },
                      },
                    }),
                    closeButtonProps: {
                      "aria-label": "Close notification",
                    },
                  });
                }
              }}
            >
              Download Token
            </Menu.Item>
            <Menu.Item
              leftSection={<LogoutIcon size="1.25em" />}
              onClick={() => {
                window.location.assign(
                  urlJoin(GDC_AUTH, `logout?next=${window.location.href}`),
                );
              }}
              data-testid="logoutMenuItem"
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
