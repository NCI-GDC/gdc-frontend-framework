import {
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  useTotalCounts,
  useFacetDictionary,
  showModal,
  Modals,
  selectCurrentModal,
} from "@gff/core";
import {
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
import { ReactNode, useContext, useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { Image } from "@/components/Image";
import { useCookies } from "react-cookie";
import {
  MdShoppingCart as CartIcon,
  MdOutlineApps as AppsIcon,
  MdArrowDropDown as ArrowDropDownIcon,
  MdKeyboardBackspace as LeftArrowIcon,
} from "react-icons/md";
import {
  FiPlayCircle as PlayIcon,
  FiChevronDown as DownArrowCollapseIcon,
} from "react-icons/fi";
import { VscFeedback as FeebackIcon } from "react-icons/vsc";
import { HiOutlinePencilSquare as PencilIcon } from "react-icons/hi2";
import { IoOptions as OptionsIcon } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";
import { theme } from "tailwind.config";
import { QuickSearch } from "@/components/QuickSearch/QuickSearch";
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
import LoginButtonOrUserDropdown from "./LoginButtonOrUserDropdown";

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

  const currentCart = useCoreSelector((state) => selectCart(state));
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const { isSuccess: totalSuccess } = useTotalCounts(); // request total counts and facet dictionary
  const { isSuccess: dictSuccess } = useFacetDictionary();
  const [cookie] = useCookies(["NCI-Warning"]);

  useEffect(() => {
    if (!cookie["NCI-Warning"] && dispatch) {
      dispatch(showModal({ modal: Modals.FirstTimeModal }));
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
              className="border-0"
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
                customDataTestID="button-header-video-guides"
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
                customDataTestID="button-header-send-feedback"
              />
            </li>

            <li>
              <NavLinkWithIcon
                href="/annotations"
                icon={<PencilIcon />}
                activeStyle="bg-secondary text-base-max"
                text="Browse Annotations"
                customDataTestID="button-header-browse-annotations"
              />
            </li>

            <li>
              <NavLinkWithIcon
                href="/manage_sets"
                icon={<OptionsIcon />}
                iconStyle="rotate-90"
                text="Manage Sets"
                activeStyle="bg-secondary text-base-max"
                customDataTestID="button-header-manage-sets"
              />
            </li>

            <li>
              <NavLinkWithIcon
                href="/cart"
                icon={<CartIcon />}
                text="Cart"
                activeStyle="bg-secondary text-base-max"
                customDataTestID="button-header-cart"
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
                  {currentCart?.length?.toLocaleString() || 0}
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
                  customDataTestID="button-header-data-portal"
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
                  customDataTestID="button-header-website"
                  href="https://gdc.cancer.gov"
                  icon="gdc-app-website-blue.svg"
                  text="Website"
                />
              </li>
              <li>
                <GDCAppLink
                  customDataTestID="button-header-api"
                  href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
                  icon="gdc-app-portal-api.svg"
                  text="API"
                />
              </li>
              <li>
                <GDCAppLink
                  customDataTestID="button-header-data-transfer-tool"
                  href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
                  icon="gdc-app-data-transfer-tool.svg"
                  text="Data Transfer Tool"
                />
              </li>
              <li>
                <GDCAppLink
                  customDataTestID="button-header-documentation"
                  href="https://docs.gdc.cancer.gov"
                  icon="gdc-app-docs.svg"
                  text="Documentation"
                />
              </li>
              <li>
                <GDCAppLink
                  customDataTestID="button-header-data-submission-portal"
                  href="https://portal.gdc.cancer.gov/submission"
                  icon="gdc-app-submission-portal.svg"
                  text="Data Submission Portal"
                />
              </li>
              <li>
                <GDCAppLink
                  customDataTestID="button-header-publications"
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
            customDataTestID="button-header-video-guides"
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
            customDataTestID="button-header-send-feedback"
          />
          <NavLinkWithIcon
            href="/annotations"
            icon={<PencilIcon />}
            text="Browse Annotations"
            activeStyle="bg-secondary text-base-max"
            overwriteClassName="!p-1"
            customDataTestID="button-header-browse-annotations"
          />
          <NavLinkWithIcon
            href="/manage_sets"
            icon={<OptionsIcon />}
            iconStyle="rotate-90"
            text="Manage Sets"
            customDataTestID="button-header-manage-sets"
            activeStyle="bg-secondary text-base-max"
            overwriteClassName="!p-1"
          />
          <NavLinkWithIcon
            href="/cart"
            icon={<CartIcon />}
            text="Cart"
            customDataTestID="button-header-cart"
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
                data-testid="button-header-gdc-apps"
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
                    customDataTestID="button-header-data-portal"
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
                    customDataTestID="button-header-website"
                    href="https://gdc.cancer.gov"
                    icon="gdc-app-website-blue.svg"
                    text="Website"
                  />
                </AppMenuItem>

                <AppMenuItem>
                  <GDCAppLink
                    customDataTestID="button-header-api"
                    href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
                    icon="gdc-app-portal-api.svg"
                    text="API"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    customDataTestID="button-header-data-transfer-tool"
                    href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
                    icon="gdc-app-data-transfer-tool.svg"
                    text="Data Transfer Tool"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    customDataTestID="button-header-documentation"
                    href="https://docs.gdc.cancer.gov"
                    icon="gdc-app-docs.svg"
                    text="Documentation"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    customDataTestID="button-header-data-submission-portal"
                    href="https://portal.gdc.cancer.gov/submission"
                    icon="gdc-app-submission-portal.svg"
                    text="Data Submission Portal"
                  />
                </AppMenuItem>
                <AppMenuItem>
                  <GDCAppLink
                    customDataTestID="button-header-publications"
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
      {<GeneralErrorModal openModal={modal === Modals.GeneralErrorModal} />}
      {<UserProfileModal openModal={modal === Modals.UserProfileModal} />}
      {<SessionExpireModal openModal={modal === Modals.SessionExpireModal} />}
      {<NoAccessModal openModal={modal === Modals.NoAccessModal} />}
      {<FirstTimeModal openModal={modal === Modals.FirstTimeModal} />}
      {
        <SummaryModal
          opened={entityMetadata.entity_type !== null}
          onClose={() =>
            setEntityMetadata({
              entity_type: null,
              entity_id: null,
            })
          }
          entityMetadata={entityMetadata}
        />
      }
      {/* Modals End */}
    </div>
  );
};
