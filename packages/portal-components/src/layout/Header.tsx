import React, { useEffect, useState, ReactNode, useContext } from "react";
import { Badge, Burger, MantineProvider, UnstyledButton } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { AppContext } from "src/context";
import {
  CartIcon,
  PencilIcon,
  PlayIcon,
  OptionsIcon,
  FeedbackIcon,
} from "src/commonIcons";
import HeaderLink, { HeaderLinkProps } from "./HeaderLink";
import HeaderDrawer from "./HeaderDrawer";
import ExternalAppMenu from "./ExternalAppMenu";
import SendFeedbackModal from "src/modals/SendFeedbackModal";

const MAX_WIDTH_FOR_HAMBURGER = 1280;

interface HeaderProps {
  readonly AppLogo: React.ReactNode;
  readonly externalAppLinks: ReadonlyArray<HeaderLinkProps>;
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath: string;
  readonly LoginButton?: React.ReactNode;
  readonly cartSize?: number;
}

const Header: React.FC<HeaderProps> = ({
  AppLogo,
  externalAppLinks,
  headerElements,
  indexPath,
  LoginButton = undefined,
  cartSize = 0,
}: HeaderProps) => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const label = drawerOpened ? "Close navigation" : "Open navigation";
  const { width } = useViewportSize();

  // Need to close the drawer when the screen width is > 1280 px (XL)
  // Just using hidden or block will show the panel without manually trigerring it.
  useEffect(() => {
    if (width >= MAX_WIDTH_FOR_HAMBURGER && drawerOpened) {
      closeDrawer();
    }
  }, [width, drawerOpened, closeDrawer]);

  const { LinkComponent, path, theme } = useContext(AppContext);

  return (
    <MantineProvider theme={theme}>
      <div className="px-4 py-3 border-b border-gdc-grey-lightest flex flex-col">
        <a
          href="#main"
          className="absolute left-[-1000px] focus:left-0 z-10 -mt-4"
        >
          Skip Navigation
        </a>
        <div className="flex flex-row justify-between">
          {/* Left Side Header logos */}
          <div className="flex-none w-64 h-nci-logo relative">
            <LinkComponent
              href={indexPath}
              data-testid="NIHLogoButton"
              className="block w-full h-full mt-2"
            >
              {AppLogo}
            </LinkComponent>
          </div>

          <div className="flex xl:hidden justify-center align-center gap-4 ">
            {LoginButton && LoginButton}
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              aria-label={label}
              classNames={{
                root: "pt-0",
                burger: "bg-nci-blue-darkest",
              }}
              className="pt-0"
            />
          </div>

          <HeaderDrawer
            drawerOpened={drawerOpened}
            closeDrawer={closeDrawer}
            externalAppLinks={externalAppLinks}
            cartSize={cartSize}
            setOpenFeedbackModal={setOpenFeedbackModal}
          />

          {/* Right Side Nav Bar */}
          <div
            className="hidden xl:flex justify-end md:flex-wrap lg:flex-nowrap md:mb-3 lg:mb-0 md:gap-0 lg:gap-3 items-center text-primary-darkest font-heading text-sm font-medium"
            role="navigation"
            aria-label=""
          >
            <HeaderLink
              customDataTestID="button-header-video-guides"
              href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/"
              image={<PlayIcon size={24} />}
              text="Video Guides"
              isExternal
            />
            <UnstyledButton
              className={`rounded-md hover:bg-primary-lightest text-primary-darkest text-sm font-heading flex py-1 px-1 `}
              onClick={() => {
                setOpenFeedbackModal(true);
                closeDrawer();
              }}
              data-testid="button-header-send-feedback"
            >
              <div className="flex items-center gap-1">
                <FeedbackIcon aria-hidden="true" size={24} />
                Send Feedback
              </div>
            </UnstyledButton>

            <HeaderLink
              href="/annotations"
              image={<PencilIcon size={24} />}
              text="Browse Annotations"
              customDataTestID="button-header-browse-annotations"
            />
            <HeaderLink
              href="/manage_sets"
              image={<OptionsIcon size={24} className="rotate-90" />}
              text="Manage Sets"
              customDataTestID="button-header-manage-sets"
            />
            <HeaderLink
              href="/cart"
              image={<CartIcon size={24} />}
              text={
                <>
                  {"Cart"}
                  <Badge
                    variant="filled"
                    className={`px-1 ml-1 ${
                      path === "/cart"
                        ? "bg-white text-secondary"
                        : "bg-accent-vivid"
                    }`}
                    radius="xs"
                  >
                    {cartSize}
                  </Badge>
                </>
              }
              customDataTestID="button-header-cart"
              isExternal={false}
            />
            {LoginButton && LoginButton}
            <ExternalAppMenu externalAppLinks={externalAppLinks} />
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
          <div className="xl:w-1/3">{/* <QuickSearch /> */}</div>
        </div>
        {
          <SendFeedbackModal
            opened={openFeedbackModal}
            onClose={() => setOpenFeedbackModal(false)}
          />
        }
      </div>
    </MantineProvider>
  );
};

export default Header;
