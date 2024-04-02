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
import {
  Button,
  LoadingOverlay,
  Menu,
  Badge,
  Burger,
  Drawer,
  Divider,
  ActionIcon,
  UnstyledButton,
  Center,
  Box,
  Collapse,
} from "@mantine/core";
import { ReactNode, useContext, useEffect, useState } from "react";
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
const AppMenuItem = tw(Menu.Item)`
cursor-pointer
hover:bg-base-lightest
py-2
px-1
m-0
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

interface GDCAppLinkProps {
  href: string;
  icon: string;
  text: string;
  isexternal?: boolean;
}

const GDCAppLink = ({
  href,
  icon,
  text,
  isexternal = true,
}: GDCAppLinkProps) => {
  const linkProps = isexternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <Link
      {...linkProps}
      className="flex py-2 px-4 hover:bg-primary-lighter hover:rounded-md"
    >
      <Center className="gap-2">
        <Image src={`/user-flow/icons/${icon}`} width={30} height={30} alt="" />
        {text}
      </Center>
    </Link>
  );
};

export const Header: React.FC<HeaderProps> = ({
  headerElements,
  indexPath,
  Options = () => <div />,
}: HeaderProps) => {
  const dispatch = useCoreDispatch();
  const router = useRouter();
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
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

  const { entityMetadata, setEntityMetadata } = useContext(SummaryModalContext);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [gdcAppsOpened, { toggle: toggleGdcApps }] = useDisclosure(false);
  const label = drawerOpened ? "Close navigation" : "Open navigation";
  const { width } = useViewportSize();

  useEffect(() => {
    if (width > 1279 && drawerOpened) {
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
                rightIcon={<ArrowDropDownIcon size="2em" aria-hidden="true" />}
                variant="subtle"
                className="text-primary-darkest font-header text-sm font-medium font-heading"
                classNames={{ rightIcon: "ml-0" }}
                data-testid="usernameButton"
              >
                {userInfo?.data?.username}
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
                  if (Object.keys(userInfo.data?.projects.gdc_ids).length > 0) {
                    const token = await fetchToken();
                    if (token.status === 401) {
                      dispatch(showModal({ modal: Modals.SessionExpireModal }));
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
          />
        </div>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          classNames={{
            title: "text-xl font-header",
            close: "[&_svg]:h-24 [&_svg]:w-24",
            header: "py-2 px-4",
            body: "px-3",
          }}
          position="right"
          title={
            <div
              data-testid="button-close-set-panel"
              className="flex gap-4 items-center w-full text-primary-darker font-bold p-2 px-0"
            >
              <ActionIcon
                onClick={closeDrawer}
                aria-label="Close navigation panel"
              >
                <LeftArrowIcon size={30} className="text-primary-darker" />
              </ActionIcon>
              <>Navigation</>
            </div>
          }
          padding="md"
          withCloseButton={false}
        >
          <Divider my="xs" className="mt-0" />
          <a
            href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/"
            className="flex items-center py-4 px-1 gap-2 hover:rounded-md hover:bg-primary-lightest"
            target="_blank"
            rel="noreferrer"
          >
            <PlayIcon size="24px" />
            Video Guides
          </a>
          <UnstyledButton
            variant="subtle"
            data-testid="button-header-send-feeback"
            className="rounded-md hover:bg-primary-lightest font-medium font-heading w-full flex py-4 px-1"
            onClick={() => setOpenFeedbackModal(true)}
          >
            <Center className="gap-2">
              <FeebackIcon size="24px" aria-hidden="true" />
              Send Feedback
            </Center>
          </UnstyledButton>

          <a
            href="https://portal.gdc.cancer.gov/v1/annotations"
            className="flex items-center gap-2 rounded-md py-4 px-1 hover:bg-primary-lightest"
            target="_blank"
            rel="noreferrer"
          >
            <PencilIcon size="24px" />
            Browse Annotations
          </a>

          <Link
            href="/manage_sets"
            data-testid="button-header-manage-sets"
            className={`flex items-center py-4 px-1 gap-2 font-heading rounded-md ${
              router.pathname === "/manage_sets"
                ? "bg-secondary text-white"
                : "hover:bg-primary-lightest"
            }`}
          >
            <OptionsIcon size="22px" className="rotate-90" />
            Manage Sets
          </Link>

          <Link
            href="/cart"
            data-testid="cartLink"
            className={`flex py-4 px-1 rounded-md ${
              router.pathname === "/cart"
                ? "bg-secondary text-white"
                : "hover:bg-primary-lightest"
            }`}
          >
            <Center className="gap-2">
              <CartIcon size="22px" />
              Cart
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
            </Center>
          </Link>

          <UnstyledButton
            onClick={toggleGdcApps}
            className="flex px-1 py-4 hover:bg-primary-lightest w-full hover:rounded-md"
          >
            <Center className="gap-2">
              <AppsIcon
                size="24px"
                className="text-primary-darkest"
                aria-hidden="true"
              />
              <Box component="span" mr={3}>
                GDC Apps
              </Box>
              <DownArrowCollapseIcon size="24px" />
            </Center>
          </UnstyledButton>
          <Collapse in={gdcAppsOpened} className="bg-base-lightest rounded-md">
            <GDCAppLink
              href={indexPath}
              icon="gdc-app-data-portal-blue.svg"
              text="Data Portal"
              isexternal={false}
            />
            <GDCAppLink
              href="https://gdc.cancer.gov"
              icon="gdc-app-website-blue.svg"
              text="Website"
            />
            <GDCAppLink
              href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
              icon="gdc-app-portal-api.svg"
              text="API"
            />
            <GDCAppLink
              href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
              icon="gdc-app-data-transfer-tool.svg"
              text="Data Transfer Tool"
            />
            <GDCAppLink
              href="https://docs.gdc.cancer.gov"
              icon="gdc-app-docs.svg"
              text="Documentation"
            />
            <GDCAppLink
              href="https://portal.gdc.cancer.gov/submission"
              icon="gdc-app-submission-portal.svg"
              text="Data Submission Portal"
            />
            <GDCAppLink
              href="https://gdc.cancer.gov/about-data/publications"
              icon="gdc-app-publications.svg"
              text="Publications"
            />
          </Collapse>
        </Drawer>

        {/* Right Side Nav Bar */}
        <div
          className="hidden xl:flex justify-end md:flex-wrap lg:flex-nowrap md:mb-3 lg:mb-0 md:gap-0 lg:gap-3 items-center text-primary-darkest font-heading text-sm font-medium"
          role="navigation"
          aria-label=""
        >
          <a
            href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/"
            className="flex items-center gap-1 p-1 hover:rounded-md hover:bg-primary-lightest"
            target="_blank"
            rel="noreferrer"
          >
            <PlayIcon size="24px" />
            Video Guides
          </a>
          <Button
            variant="subtle"
            data-testid="button-header-send-feeback"
            className="rounded-md hover:bg-primary-lightest font-medium text-primary-darkest font-heading p-1"
            leftIcon={<FeebackIcon size="24px" aria-hidden="true" />}
            onClick={() => setOpenFeedbackModal(true)}
          >
            Send Feedback
          </Button>
          <a
            href="https://portal.gdc.cancer.gov/v1/annotations"
            className="flex items-center gap-1 rounded-md p-1 hover:bg-primary-lightest"
            target="_blank"
            rel="noreferrer"
          >
            <PencilIcon size="24px" />
            Browse Annotations
          </a>
          <Link
            href="/manage_sets"
            data-testid="button-header-manage-sets"
            className={`p-1 rounded-md ${
              router.pathname === "/manage_sets"
                ? "bg-secondary text-white"
                : "hover:bg-primary-lightest"
            }`}
          >
            <div className="flex items-center gap-1 font-heading">
              <OptionsIcon size="22px" className="rotate-90" />
              Manage Sets
            </div>
          </Link>
          <Link
            href="/cart"
            data-testid="cartLink"
            className={`p-1 rounded-md ${
              router.pathname === "/cart"
                ? "bg-secondary text-white"
                : "hover:bg-primary-lightest"
            }`}
          >
            <div className="flex items-center gap-1 font-heading">
              <CartIcon size="22px" />
              Cart
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
            </div>
          </Link>
          <LoginButtonOrUserDropdown />
          <Menu
            withArrow
            arrowSize={16}
            position="bottom-end"
            arrowPosition="center"
          >
            <Menu.Target>
              <button
                data-testid="extraButton"
                className="flex items-center gap-1 p-1 pr-2 rounded-md hover:bg-primary-lightest"
              >
                <AppsIcon
                  size="24px"
                  className="text-primary-darkest"
                  aria-hidden="true"
                />
                <p className="font-heading">GDC Apps</p>
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <div className="grid grid-cols-2 py-4 gap-2">
                <AppMenuItem>
                  <Link href={indexPath} className="flex flex-col items-center">
                    <>
                      <Image
                        src="/user-flow/icons/gdc-app-data-portal-blue.svg"
                        width={30}
                        height={30}
                        alt=""
                      />
                      Data Portal
                    </>
                  </Link>
                </AppMenuItem>
                <AppMenuItem>
                  <AppLink href="https://gdc.cancer.gov" target="_blank">
                    <Image
                      src="/user-flow/icons/gdc-app-website-blue.svg"
                      width={30}
                      height={30}
                      alt=""
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
                      alt=""
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
                      alt=""
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
                      alt=""
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
                      alt=""
                    />
                    Data Submission Portal
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
                      alt=""
                    />
                    Publications
                  </AppLink>
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
      <div className="flex flex-grow">
        <Options />
      </div>

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
