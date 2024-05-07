import {
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  useTotalCounts,
  useFacetDictionary,
  GDC_AUTH,
  showModal,
  Modals,
  selectCurrentModal,
  useFetchUserDetailsQuery,
  useLazyFetchTokenQuery,
} from "@gff/core";
import {
  Button,
  LoadingOverlay,
  Menu,
  Badge,
  Burger,
  Drawer,
  UnstyledButton,
  Center,
  Box,
  Collapse,
  ActionIcon,
} from "@mantine/core";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import tw from "tailwind-styled-components";
import { Image } from "@/components/Image";
import { useCookies } from "react-cookie";
import {
  MdShoppingCart as CartIcon,
  MdOutlineApps as AppsIcon,
  MdLogout as LogoutIcon,
  MdArrowDropDown as ArrowDropDownIcon,
  MdKeyboardBackspace as LeftArrowIcon,
} from "react-icons/md";
import { FaDownload, FaUserCheck } from "react-icons/fa";
import {
  FiPlayCircle as PlayIcon,
  FiChevronDown as DownArrowCollapseIcon,
} from "react-icons/fi";
import { VscFeedback as FeebackIcon } from "react-icons/vsc";
import { HiOutlinePencilSquare as PencilIcon } from "react-icons/hi2";
import { IoOptions as OptionsIcon } from "react-icons/io5";
import saveAs from "file-saver";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import urlJoin from "url-join";
import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { theme } from "tailwind.config";
import { QuickSearch } from "@/components/QuickSearch/QuickSearch";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/StyledComponents/DropdownMenu";
import { UserProfileModal } from "@/components/Modals/UserProfileModal";
import { SessionExpireModal } from "@/components/Modals/SessionExpireModal";
import { NoAccessModal } from "@/components/Modals/NoAccessModal";
import { FirstTimeModal } from "@/components/Modals/FirstTimeModal";
import { GeneralErrorModal } from "@/components/Modals/GeneraErrorModal";
import { SummaryModal } from "@/components/Modals/SummaryModal/SummaryModal";
import { SummaryModalContext } from "src/utils/contexts";
import NIHLogo from "public/NIH_GDC_DataPortal-logo.svg";
import SendFeedbackModal from "@/components/Modals/SendFeedbackModal";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import React from "react";
import { GDCAppLink, NavButton, NavLinkWithIcon } from "@/components/Nav";

const MAX_WIDTH_FOR_HAMBURGER = 1280;

const AppMenuItem = tw(Menu.Item)`
data-hovered:bg-primary-lightest
p-0
m-0
`;

interface HeaderProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath: string;
  readonly Options?: React.FC<unknown>;
}

export const Header: React.FC<HeaderProps> = ({
  headerElements,
  indexPath,
  Options,
}: HeaderProps) => {
  const dispatch = useCoreDispatch();
  const router = useRouter();
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const { data: userInfo } = useFetchUserDetailsQuery();

  const currentCart = useCoreSelector((state) => selectCart(state));
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const { isSuccess: totalSuccess } = useTotalCounts(); // request total counts and facet dictionary
  const { isSuccess: dictSuccess } = useFacetDictionary();
  const userDropdownRef = useRef<HTMLButtonElement>();
  const [cookie] = useCookies(["NCI-Warning"]);

  useEffect(() => {
    if (!cookie["NCI-Warning"]) {
      dispatch && dispatch(showModal({ modal: Modals.FirstTimeModal }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { entityMetadata, setEntityMetadata } = useContext(SummaryModalContext);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [gdcAppsOpened, { toggle: toggleGdcApps }] = useDisclosure(false);
  const label = drawerOpened ? "Close navigation" : "Open navigation";
  const { width } = useViewportSize();

  // Need to close the drawer when the screen width is > 1280 px (XL)
  // Just using hidden or block will show the panel without manually trigerring it.
  useEffect(() => {
    if (width >= MAX_WIDTH_FOR_HAMBURGER && drawerOpened) {
      closeDrawer();
    }
  }, [width, drawerOpened, closeDrawer]);

  const LoginButtonOrUserDropdown = () => {
    return (
      <>
        {userInfo?.data?.username ? (
          <Menu width={200} data-testid="userdropdown" zIndex={9} offset={-5}>
            <Menu.Target>
              <Button
                rightSection={
                  <ArrowDropDownIcon size="2em" aria-hidden="true" />
                }
                variant="subtle"
                className="text-primary-darkest font-header text-sm font-medium font-heading"
                classNames={{ section: "ml-0" }}
                data-testid="usernameButton"
                ref={userDropdownRef}
              >
                {userInfo?.data?.username}
              </Button>
            </Menu.Target>
            <DropdownMenu>
              <DropdownMenuItem
                icon={<FaUserCheck size="1.25em" />}
                onClick={async () => {
                  dispatch(showModal({ modal: Modals.UserProfileModal }));
                  // This is done inorder to set the last focused element as the menu target element
                  // This is done to return focus to the target element if the modal is closed with ESC
                  userDropdownRef?.current && userDropdownRef?.current?.focus();
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
                    Object.keys(userInfo?.data?.projects.gdc_ids).length > 0
                  ) {
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
                      closeButtonProps: {
                        "aria-label": "Close notification",
                      },
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
      </>
    );
  };

  const [fetchToken] = useLazyFetchTokenQuery({ refetchOnFocus: false });

  return (
    <div className="px-4 py-3 border-b border-gdc-grey-lightest flex flex-col">
      <a
        href="#main"
        className="absolute left-[-1000px] focus:left-0 z-10 -mt-4"
      >
        Skip Navigation
      </a>
      <div className="flex flex-row justify-between">
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={!(totalSuccess || dictSuccess)}
        />
        {/* Left Side Header logos */}
        <div className="flex-none w-64 h-nci-logo relative">
          <Link
            href={indexPath}
            data-testid="NIHLogoButton"
            className="block w-full h-full mt-2"
          >
            <NIHLogo
              layout="fill"
              style={{ objectFit: "contain" }}
              data-testid="button-header-home"
              aria-label="NIH GDC Data Portal Home"
              role="img"
            />
          </Link>
        </div>

        <div className="flex xl:hidden justify-center align-center gap-4 ">
          <LoginButtonOrUserDropdown />
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            aria-label={label}
            color={theme.extend.colors["nci-blue"].darkest}
            className="pt-0"
          />
        </div>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          classNames={{
            header: "py-2 px-4",
            body: "px-3 py-0",
            close: "hover:bg-base-lightest",
            title: "w-full",
          }}
          position="right"
          padding="md"
          size="xs"
          withCloseButton={false}
        >
          <div className="flex items-center gap-2 bg-base-max sticky top-0 z-[1000] text-primary-darker border-b border-base-lighter font-bold py-4">
            <ActionIcon
              onClick={closeDrawer}
              aria-label="Close navigation panel"
              data-testid="button-close-navigation-panel"
            >
              <LeftArrowIcon
                size={30}
                className="text-primary-darker"
                aria-hidden="true"
              />
            </ActionIcon>
            Navigation
          </div>
          <ul>
            <li>
              <NavLinkWithIcon
                href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/"
                icon={<PlayIcon />}
                text="Video Guides"
                isExternal
              />
            </li>

            <li>
              <NavButton
                icon={<FeebackIcon aria-hidden="true" />}
                text="Send Feedback"
                needFullWidth
                onClick={() => {
                  setOpenFeedbackModal(true);
                  closeDrawer();
                }}
              />
            </li>

            <li>
              <NavLinkWithIcon
                href="/annotations"
                icon={<PencilIcon />}
                activeStyle="bg-secondary text-base-max"
                text="Browse Annotations"
              />
            </li>

            <li>
              <NavLinkWithIcon
                href="/manage_sets"
                icon={<OptionsIcon />}
                iconStyle="rotate-90"
                text="Manage Sets"
                activeStyle="bg-secondary text-base-max"
                data-testid="button-header-manage-sets"
              />
            </li>

            <li>
              <NavLinkWithIcon
                href="/cart"
                icon={<CartIcon />}
                text="Cart"
                activeStyle="bg-secondary text-base-max"
                data-testid="cartLink"
              >
                <Badge
                  variant="filled"
                  className={`px-1 ml-1 ${
                    router.pathname === "/cart"
                      ? "bg-white text-secondary"
                      : "bg-accent-vivid"
                  }`}
                  radius="xs"
                >
                  {currentCart?.length || 0}
                </Badge>
              </NavLinkWithIcon>
            </li>

            <li>
              <UnstyledButton
                onClick={toggleGdcApps}
                className="flex px-1 py-4 hover:bg-primary-lightest w-full hover:rounded-md text-primary-darkest"
                aria-expanded={gdcAppsOpened ? "true" : "false"}
              >
                <Center className="gap-1">
                  <AppsIcon
                    size="24px"
                    className="text-primary-darkest"
                    aria-hidden="true"
                  />
                  <Box component="span" mr={3} className="text-sm">
                    GDC Apps
                  </Box>
                  <DownArrowCollapseIcon size="24px" aria-hidden="true" />
                </Center>
              </UnstyledButton>
            </li>
          </ul>
          <Collapse in={gdcAppsOpened}>
            <ul>
              <li>
                <NavLinkWithIcon
                  href={indexPath}
                  icon={
                    <Image
                      src="/user-flow/icons/gdc-app-data-portal-blue.svg"
                      width={30}
                      height={30}
                      alt=""
                    />
                  }
                  text="Data Portal"
                  overwriteClassName="!px-4 !py-2 !my-0"
                />
              </li>

              <li>
                <GDCAppLink
                  href="https://gdc.cancer.gov"
                  icon="gdc-app-website-blue.svg"
                  text="Website"
                />
              </li>
              <li>
                <GDCAppLink
                  href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
                  icon="gdc-app-portal-api.svg"
                  text="API"
                />
              </li>
              <li>
                <GDCAppLink
                  href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
                  icon="gdc-app-data-transfer-tool.svg"
                  text="Data Transfer Tool"
                />
              </li>
              <li>
                <GDCAppLink
                  href="https://docs.gdc.cancer.gov"
                  icon="gdc-app-docs.svg"
                  text="Documentation"
                />
              </li>
              <li>
                <GDCAppLink
                  href="https://portal.gdc.cancer.gov/submission"
                  icon="gdc-app-submission-portal.svg"
                  text="Data Submission Portal"
                />
              </li>
              <li>
                <GDCAppLink
                  href="https://gdc.cancer.gov/about-data/publications"
                  icon="gdc-app-publications.svg"
                  text="Publications"
                />
              </li>
            </ul>
          </Collapse>
        </Drawer>

        {/* Right Side Nav Bar */}
        <div
          className="hidden xl:flex justify-end md:flex-wrap lg:flex-nowrap md:mb-3 lg:mb-0 md:gap-0 lg:gap-3 items-center text-primary-darkest font-heading text-sm font-medium"
          role="navigation"
          aria-label=""
        >
          <NavLinkWithIcon
            href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/"
            icon={<PlayIcon />}
            text="Video Guides"
            isExternal
            overwriteClassName="!p-1"
          />
          <NavButton
            icon={<FeebackIcon aria-hidden="true" />}
            text="Send Feedback"
            onClick={() => setOpenFeedbackModal(true)}
            className="!p-1"
          />
          <NavLinkWithIcon
            href="/annotations"
            icon={<PencilIcon />}
            text="Browse Annotations"
            activeStyle="bg-secondary text-base-max"
            overwriteClassName="!p-1"
          />
          <NavLinkWithIcon
            href="/manage_sets"
            icon={<OptionsIcon />}
            iconStyle="rotate-90"
            text="Manage Sets"
            data-testid="button-header-manage-sets"
            activeStyle="bg-secondary text-base-max"
            overwriteClassName="!p-1"
          />
          <NavLinkWithIcon
            href="/cart"
            icon={<CartIcon />}
            text="Cart"
            data-testid="cartLink"
            activeStyle="bg-secondary text-base-max"
            overwriteClassName="!p-1"
          >
            <Badge
              variant="filled"
              className={`px-1 ml-1 ${
                router.pathname === "/cart"
                  ? "bg-white text-secondary"
                  : "bg-accent-vivid"
              }`}
              radius="xs"
            >
              {currentCart?.length || 0}
            </Badge>
          </NavLinkWithIcon>
          <LoginButtonOrUserDropdown />
          <Menu
            width="450"
            position="bottom-end"
            zIndex={400}
            classNames={{
              dropdown: "border border-primary",
            }}
          >
            <Menu.Target>
              <button
                data-testid="extraButton"
                className="flex items-center gap-1 p-1 rounded-md hover:bg-primary-lightest"
              >
                <AppsIcon
                  size="24px"
                  className="text-primary-darkest"
                  aria-hidden="true"
                />
                <p className="font-heading">GDC Apps</p>
                <ArrowDropDownIcon
                  size="24px"
                  className="-ml-1"
                  aria-hidden="true"
                />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <div className="grid grid-cols-2 p-1 gap-2 font-medium">
                <AppMenuItem>
                  <NavLinkWithIcon
                    href={indexPath}
                    icon={
                      <Image
                        src="/user-flow/icons/gdc-app-data-portal-blue.svg"
                        width={30}
                        height={30}
                        alt=""
                      />
                    }
                    text="Data Portal"
                    overwriteClassName="!px-4 !py-2"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    href="https://gdc.cancer.gov"
                    icon="gdc-app-website-blue.svg"
                    text="Website"
                  />
                </AppMenuItem>

                <AppMenuItem>
                  <GDCAppLink
                    href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
                    icon="gdc-app-portal-api.svg"
                    text="API"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
                    icon="gdc-app-data-transfer-tool.svg"
                    text="Data Transfer Tool"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    href="https://docs.gdc.cancer.gov"
                    icon="gdc-app-docs.svg"
                    text="Documentation"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    href="https://portal.gdc.cancer.gov/submission"
                    icon="gdc-app-submission-portal.svg"
                    text="Data Submission Portal"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    href="https://gdc.cancer.gov/about-data/publications"
                    icon="gdc-app-publications.svg"
                    text="Publications"
                  />
                </AppMenuItem>
              </div>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      {/* Apps + Search Bar */}
      <div className="flex flex-col gap-2 xl:flex-row xl:justify-between">
        <div
          className="flex flex-row flex-wrap items-center divide-x divide-gray-300 mx-auto xl:m-0"
          role="navigation"
          aria-label=""
        >
          {headerElements.map((element, i) => (
            <div key={i} className={`${i === 0 ? "pr-2" : "pl-4"}`}>
              {typeof element === "string" ? (
                <span className="font-semibold">{element}</span>
              ) : (
                element
              )}
            </div>
          ))}
        </div>
        <div className="xl:w-1/3">
          <QuickSearch />
        </div>
      </div>
      <div className="flex flex-grow">{Options && <Options />}</div>

      {/* Modals Start */}
      <SendFeedbackModal
        opened={openFeedbackModal}
        onClose={() => setOpenFeedbackModal(false)}
      />
      {modal === Modals.GeneralErrorModal && <GeneralErrorModal openModal />}
      {modal === Modals.UserProfileModal && <UserProfileModal openModal />}
      {modal === Modals.SessionExpireModal && <SessionExpireModal openModal />}
      {modal === Modals.NoAccessModal && <NoAccessModal openModal />}
      {modal === Modals.FirstTimeModal && <FirstTimeModal openModal />}
      {entityMetadata.entity_type !== null && (
        <SummaryModal
          opened
          onClose={() =>
            setEntityMetadata({
              entity_type: null,
              entity_id: null,
            })
          }
          entityMetadata={entityMetadata}
        />
      )}
      {/* Modals End */}
    </div>
  );
};
