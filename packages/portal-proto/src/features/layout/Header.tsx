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
import { Button, LoadingOverlay, Menu, Badge } from "@mantine/core";
import { ReactNode, useEffect } from "react";
import tw from "tailwind-styled-components";
import { Image } from "@/components/Image";
import { useCookies } from "react-cookie";
import {
  MdShoppingCart as CartIcon,
  MdOutlineApps as AppsIcon,
  MdLogout as LogoutIcon,
  MdArrowDropDown as ArrowDropDownIcon,
} from "react-icons/md";
import { FaDownload, FaUserCheck } from "react-icons/fa";
import { HiOutlinePencilSquare as PencilIcon } from "react-icons/hi2";
import saveAs from "file-saver";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import urlJoin from "url-join";
import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";
import { UserProfileModal } from "@/components/Modals/UserProfileModal";
import { SessionExpireModal } from "@/components/Modals/SessionExpireModal";
import { FirstTimeModal } from "@/components/Modals/FirstTimeModal";
import { NoAccessModal } from "@/components/Modals/NoAccessModal";
import { theme } from "tailwind.config";
import { QuickSearch } from "@/components/QuickSearch/QuickSearch";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/StyledComponents/DropdownMenu";

const AppMenuItem = tw(Menu.Item)`
cursor-pointer
hover:bg-base-lightest
`;

const AppLink = tw.a`
flex
flex-col
items-center
`;

interface HeaderProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath: string;
  readonly Options?: React.FC<unknown>;
}

export const Header: React.FC<HeaderProps> = ({
  headerElements,
  indexPath,
  Options = () => <div />,
}: HeaderProps) => {
  const dispatch = useCoreDispatch();

  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));
  const currentCart = useCoreSelector((state) => selectCart(state));
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const { isSuccess: totalSuccess } = useTotalCounts(); // request total counts and facet dictionary
  const { isSuccess: dictSuccess } = useFacetDictionary();

  const [cookie] = useCookies(["NCI-Warning"]);

  useEffect(() => {
    if (!cookie["NCI-Warning"]) {
      dispatch && dispatch(showModal({ modal: Modals.FirstTimeModal }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 py-3 border-b border-gdc-grey-lightest flex flex-row">
      <a
        href="#main"
        className="absolute left-[-1000px] focus:left-0 z-10 -mt-4"
      >
        Skip Navigation
      </a>
      <div className="flex flex-col w-3/5">
        <LoadingOverlay visible={!(totalSuccess || dictSuccess)} />
        <div className="flex-none w-64 h-nci-logo mr-2 relative">
          <Link href={indexPath} data-testid="NIHLogoButton" passHref>
            <a className="block w-full h-full">
              <Image
                src="/NIH_GDC_DataPortal-logo.svg"
                layout="fill"
                objectFit="contain"
                data-testid="NIH_LOGO"
                alt="NIH GDC Data Portal logo"
              />
            </a>
          </Link>
        </div>
        <div className="flex flex-row flex-wrap items-center divide-x divide-gray-300 mt-2 ">
          {headerElements.map((element, i) => (
            <div
              key={i}
              className={`${i === 0 ? "pr-2" : "px-2"}`}
              data-testid={`headerElement${i}`}
            >
              {typeof element === "string" ? (
                <span className="font-semibold">{element}</span>
              ) : (
                element
              )}
            </div>
          ))}
        </div>
        <div className="flex-grow"></div>
        <div>
          <Options />
        </div>
      </div>
      <div className="flex flex-col justify-around w-2/5">
        <div className="flex flex-row justify-between items-center text-primary-darkest font-heading text-sm font-medium">
          <a
            href="https://portal.gdc.cancer.gov/annotations"
            className="flex items-center gap-1"
          >
            <PencilIcon size="24px" />
            Browse Annotations
          </a>
          <Link href="/cart" passHref>
            <Button unstyled data-testid="cartLink">
              <div className="flex items-center gap-1">
                <CartIcon size="22px" className="text-primary-darkest" />
                Cart
                <Badge
                  variant="filled"
                  className="px-1 ml-1 bg-primary-darkest"
                  radius="xs"
                >
                  {currentCart.length || 0}
                </Badge>
              </div>
            </Button>
          </Link>
          {userInfo.data.username ? (
            <Menu width={200} data-testid="userdropdown">
              <Menu.Target>
                <Button
                  rightIcon={<ArrowDropDownIcon size="2em" />}
                  variant="subtle"
                  className="text-primary-darkest font-header text-sm font-medium"
                  classNames={{ rightIcon: "ml-0" }}
                  data-testid="usernameButton"
                >
                  {userInfo.data.username}
                </Button>
              </Menu.Target>
              <DropdownMenu>
                <DropdownMenuItem
                  icon={<FaUserCheck size="1.25em" />}
                  onClick={async () => {
                    // This is just done for the purpose of checking if the session is still active
                    const token = await fetchToken();
                    if (token.status === 401) {
                      dispatch(showModal({ modal: Modals.SessionExpireModal }));
                      return;
                    }
                    dispatch(showModal({ modal: Modals.UserProfileModal }));
                  }}
                  data-testid="userprofilemenu"
                >
                  User Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  icon={<FaDownload size="1.25em" />}
                  data-testid="downloadTokenMenuItem"
                  onClick={async () => {
                    if (
                      Object.keys(userInfo.data?.projects.gdc_ids).length > 0
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
                            {userInfo.data.username} does not have access to any
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
                            to learn more about obtaining access to protected
                            data.
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
                </DropdownMenuItem>
                <DropdownMenuItem
                  icon={<LogoutIcon size="1.25em" />}
                  onClick={() => {
                    window.location.assign(
                      urlJoin(GDC_AUTH, `logout?next=${window.location.href}`),
                    );
                  }}
                  data-testid="logoutMenuItem"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenu>
            </Menu>
          ) : (
            <LoginButton fromHeader />
          )}
          <Menu withArrow arrowSize={16}>
            <Menu.Target>
              <button
                data-testid="extraButton"
                aria-label="GDC apps button"
                className="flex items-center gap-1"
              >
                <AppsIcon size="24px" className="text-primary-darkest" />
                <p>GDC Apps</p>
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <div className="grid grid-cols-2 py-4 gap-2">
                <AppMenuItem>
                  <Link href={indexPath} passHref>
                    <AppLink>
                      <Image
                        src="/user-flow/icons/gdc-app-data-portal-blue.svg"
                        width={30}
                        height={30}
                        alt="portal"
                      />
                      Data Portal
                    </AppLink>
                  </Link>
                </AppMenuItem>
                <AppMenuItem>
                  <AppLink href="https://gdc.cancer.gov" target="_blank">
                    <Image
                      src="/user-flow/icons/gdc-app-website-blue.svg"
                      width={30}
                      height={30}
                      alt="website"
                    />
                    Website
                  </AppLink>
                </AppMenuItem>

                <AppMenuItem>
                  <AppLink
                    href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
                    target="_blank"
                  >
                    <Image
                      src="/user-flow/icons/gdc-app-portal-api.svg"
                      width={30}
                      height={30}
                      alt="API"
                    />
                    API
                  </AppLink>
                </AppMenuItem>
                <AppMenuItem>
                  <AppLink
                    href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
                    target="_blank"
                  >
                    <Image
                      src="/user-flow/icons/gdc-app-data-transfer-tool.svg"
                      width={30}
                      height={30}
                      alt="data transfer tool"
                    />
                    Data Transfer Tool
                  </AppLink>
                </AppMenuItem>
                <AppMenuItem>
                  <AppLink href="https://docs.gdc.cancer.gov" target="_blank">
                    <Image
                      src="/user-flow/icons/gdc-app-docs.svg"
                      width={30}
                      height={30}
                      alt="docs"
                    />
                    Documentation
                  </AppLink>
                </AppMenuItem>
                <AppMenuItem>
                  <AppLink
                    href="https://portal.gdc.cancer.gov/submission"
                    target="_blank"
                  >
                    <Image
                      src="/user-flow/icons/gdc-app-submission-portal.svg"
                      width={30}
                      height={30}
                      alt="submission portal"
                    />
                    Data Submission Portal
                  </AppLink>
                </AppMenuItem>
                <AppMenuItem>
                  <AppLink
                    href="https://portal.gdc.cancer.gov/legacy-archive"
                    target="_blank"
                  >
                    <Image
                      src="/user-flow/icons/gdc-app-legacy-archive.svg"
                      width={30}
                      height={30}
                      alt="legacy archive"
                    />
                    Legacy Archive
                  </AppLink>
                </AppMenuItem>
                <AppMenuItem>
                  <AppLink
                    href="https://gdc.cancer.gov/about-data/publications"
                    target="_blank"
                  >
                    <Image
                      src="/user-flow/icons/gdc-app-publications.svg"
                      width={30}
                      height={30}
                      alt="publications"
                    />
                    Publications
                  </AppLink>
                </AppMenuItem>
              </div>
            </Menu.Dropdown>
          </Menu>
        </div>
        <div className="mt-4">
          <QuickSearch />
        </div>
      </div>
      {modal === Modals.UserProfileModal && <UserProfileModal openModal />}
      {modal === Modals.SessionExpireModal && <SessionExpireModal openModal />}
      {modal === Modals.NoAccessModal && <NoAccessModal openModal />}
      {modal === Modals.FirstTimeModal && <FirstTimeModal openModal />}
    </div>
  );
};
