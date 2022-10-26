import {
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  useTotalCounts,
  useFacetDictionary,
  GDC_AUTH,
  showModal,
  Modals,
  selectUserDetailsInfo,
  fetchToken,
  selectCurrentModal,
} from "@gff/core";
import { Button, LoadingOverlay, Menu } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useTour } from "@reactour/tour";
import { ReactNode, useEffect, useState } from "react";
import { Image } from "@/components/Image";
import { useCookies } from "react-cookie";
import {
  MdShoppingCart as CartIcon,
  MdOutlineApps as AppsIcon,
  MdSearch as SearchIcon,
  MdOutlineTour as TourIcon,
  MdLogout as LogoutIcon,
  MdArrowDropDown as ArrowDropDownIcon,
} from "react-icons/md";
import { FaDownload, FaUserCheck } from "react-icons/fa";
import saveAs from "file-saver";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import urlJoin from "url-join";
import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";
import { UserProfileModal } from "@/components/Modals/UserProfileModal";
import { SessionExpireModal } from "@/components/Modals/SessionExpireModal";
import { useLocalStorage } from "@mantine/hooks";
import { FirstTimeModal } from "@/components/Modals/FirstTimeModal";
import { NoAccessModal } from "@/components/Modals/NoAccessModal";
import { theme } from "tailwind.config";
import { QuickSearch } from "@/components/QuickSearch/QuickSearch";

interface HeaderProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath: string;
  readonly Options?: React.FC<unknown>;
}

const V2Themes = ["default", "invert-primary", "pastel"];

export const Header: React.FC<HeaderProps> = ({
  headerElements,
  indexPath,
  Options = () => <div />,
}: HeaderProps) => {
  const { setIsOpen } = useTour();
  const dispatch = useCoreDispatch();

  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));
  const currentCart = useCoreSelector((state) => selectCart(state));
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const { isSuccess: totalSuccess } = useTotalCounts(); // request total counts and facet dictionary
  const { isSuccess: dictSuccess } = useFacetDictionary();
  const [, setTheme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "default",
  });
  const [performSearch, setPerformSearch] = useState(false);
  const [cookie] = useCookies(["NCI-Warning"]);

  useEffect(() => {
    if (!cookie["NCI-Warning"]) {
      dispatch && dispatch(showModal({ modal: Modals.FirstTimeModal }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 py-3 border-b border-gdc-grey-lightest">
      <div className="flex flex-row flex-wrap divide-x divide-gray-300 items-center">
        <LoadingOverlay visible={!(totalSuccess || dictSuccess)} />
        <div className="flex-none w-64 h-nci-logo mr-2 relative">
          {/* There's some oddities going on here that need to be explained.  When a
            <Link> wraps an <Image>, react complains it's expecting a reference to be
            passed along. A popular fix is to wrap the child with an empty anchor tag.
            This causes an accessibility problem because empty anchors confuse screen
            readers. The button tag satisfies both react's requirements and a11y
            requirements.  */}
          <Button
            unstyled
            component={NextLink}
            href={indexPath}
            data-testid="NIHLogoButton"
          >
            <Image
              src="/NIH_GDC_DataPortal-logo.svg"
              layout="fill"
              objectFit="contain"
              data-testid="NIH_LOGO"
            />
          </Button>
        </div>
        {headerElements.map((element, i) => (
          <div key={i} className="px-2" data-testid={`headerElement${i}`}>
            {typeof element === "string" ? (
              <span className="font-semibold">{element}</span>
            ) : (
              element
            )}
          </div>
        ))}
        <div className="flex-grow"></div>
        <div>
          <Options />
        </div>

        <div
          className={`flex flex-row items-center align-middle flex-nowrap gap-4 ${
            performSearch && "!border-l-0"
          }`}
        >
          {performSearch ? (
            <QuickSearch
              performSearch={performSearch}
              setPerformSearch={setPerformSearch}
            />
          ) : (
            <>
              <Button
                className={
                  "pl-4 pr-0 opacity-60 cursor-pointer hover:opacity-100 transition-opacity items-center"
                }
                data-testid="headerSearchButton"
                onClick={() => setPerformSearch(true)}
                variant="subtle"
              >
                <SearchIcon size="24px" className="text-base-darkest" />{" "}
              </Button>
              {userInfo.data.username ? (
                <Menu width="target" data-testid="userdropdown">
                  <Menu.Target>
                    <Button
                      rightIcon={<ArrowDropDownIcon size="2em" />}
                      variant="subtle"
                      className="text-primary"
                      classNames={{ rightIcon: "ml-0" }}
                      data-testid="usernameButton"
                    >
                      {userInfo.data.username}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<FaUserCheck size="1.25em" />}
                      onClick={async () => {
                        // This is just done for the purpose of checking if the session is still active
                        const token = await fetchToken();
                        if (token.status === 401) {
                          dispatch(
                            showModal({ modal: Modals.SessionExpireModal }),
                          );
                          return;
                        }
                        dispatch(showModal({ modal: Modals.UserProfileModal }));
                      }}
                      data-testid="userprofilemenu"
                    >
                      User Profile
                    </Menu.Item>
                    <Menu.Item
                      icon={<FaDownload size="1.25em" />}
                      data-testid="downloadTokenMenuItem"
                      onClick={async () => {
                        if (
                          Object.keys(userInfo.data?.projects.gdc_ids).length >
                          0
                        ) {
                          const token = await fetchToken();
                          if (token.status === 401) {
                            dispatch(
                              showModal({ modal: Modals.SessionExpireModal }),
                            );
                            return;
                          }
                          saveAs(
                            new Blob([token.text], {
                              type: "text/plain;charset=us-ascii",
                            }),
                            `gdc-user-token.${new Date().toISOString()}.txt`,
                          );
                        } else {
                          cleanNotifications();
                          showNotification({
                            message: (
                              <p>
                                {userInfo.data.username} does not have access to
                                any protected data within the GDC. Click{" "}
                                <a
                                  href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    textDecoration: "underline",
                                    color:
                                      theme.extend.colors["nci-blue"].darkest,
                                  }}
                                >
                                  here
                                </a>{" "}
                                to learn more about obtaining access to
                                protected data.
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
                          });
                        }
                      }}
                    >
                      Download Token
                    </Menu.Item>
                    <Menu.Item
                      icon={<LogoutIcon size="1.25em" />}
                      onClick={() => {
                        window.location.assign(
                          urlJoin(
                            GDC_AUTH,
                            `logout?next=${window.location.href}`,
                          ),
                        );
                      }}
                      data-testid="logoutMenuItem"
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <LoginButton />
              )}
              <Link href="/cart" passHref>
                <Button
                  className={
                    "flex flex-row opacity-60 hover:opacity-100 transition-opacity  p-0 m-0 items-center cursor-pointer text-base-darkest"
                  }
                  variant="subtle"
                  data-testid="cartLink"
                >
                  <CartIcon size="24px" /> Cart ({currentCart.length || 0})
                </Button>
              </Link>
              <Menu withArrow>
                <Menu.Target>
                  <button data-testid="extraButton">
                    <AppsIcon size="24px" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => setIsOpen(true)}
                    data-testid="tourMenuItem"
                  >
                    <TourIcon size="2.5em" />
                    <div className="text-center text-sm pt-1">{"Tour"}</div>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Themes</Menu.Label>
                  {V2Themes.map((theme) => (
                    <Menu.Item
                      key={theme}
                      onClick={() => setTheme(theme)}
                      data-testid={`${theme}ThemeMenuItem`}
                    >
                      <div className="capitalize text-left text-sm pt-1">
                        {theme}
                      </div>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </>
          )}
        </div>
      </div>
      {modal === Modals.UserProfileModal && <UserProfileModal openModal />}
      {modal === Modals.SessionExpireModal && <SessionExpireModal openModal />}
      {modal === Modals.NoAccessModal && <NoAccessModal openModal />}
      {modal === Modals.FirstTimeModal && <FirstTimeModal openModal />}
    </div>
  );
};
