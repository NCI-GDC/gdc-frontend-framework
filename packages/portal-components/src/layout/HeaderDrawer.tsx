import React, { useContext } from "react";
import {
  Drawer,
  ActionIcon,
  Collapse,
  Badge,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  LeftArrowIcon,
  CartIcon,
  AppsIcon,
  PencilIcon,
  PlayIcon,
  DownArrowCollapseIcon,
  OptionsIcon,
  FeedbackIcon,
} from "src/commonIcons";
import HeaderLink, { HeaderLinkProps } from "./HeaderLink";
import { AppContext } from "src/context";

interface HeaderDrawerProps {
  readonly drawerOpened: boolean;
  readonly closeDrawer: () => void;
  readonly setOpenFeedbackModal: (open: boolean) => void;
  readonly externalAppLinks: ReadonlyArray<HeaderLinkProps>;
  readonly cartSize: number;
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
  externalAppLinks,
  drawerOpened,
  closeDrawer,
  setOpenFeedbackModal,
  cartSize,
}: HeaderDrawerProps) => {
  const [gdcAppsOpened, { toggle: toggleGdcApps }] = useDisclosure(false);
  const { path } = useContext(AppContext);

  return (
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
          variant="default"
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
          <HeaderLink
            href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/"
            image={<PlayIcon size={24} />}
            text="Video Guides"
            customDataTestID="button-header-video-guides"
            isExternal
            variant="drawer"
          />
        </li>
        <li>
          <UnstyledButton
            className={`rounded-md hover:bg-primary-lightest text-primary-darkest text-sm font-heading w-full flex py-4 px-1 gap-1`}
            onClick={() => {
              setOpenFeedbackModal(true);
              closeDrawer();
            }}
            data-testid="button-header-send-feedback"
          >
            <div className="flex items center">
              <FeedbackIcon aria-hidden="true" size={24} />
            </div>
            Send Feedback
          </UnstyledButton>
        </li>
        <li>
          <HeaderLink
            href="/annotations"
            image={<PencilIcon size={24} />}
            text="Browse Annotations"
            customDataTestID="button-header-browse-annotations"
            variant="drawer"
          />
        </li>

        <li>
          <HeaderLink
            href="/manage_sets"
            image={<OptionsIcon size={24} className="rotate-90" />}
            text="Manage Sets"
            customDataTestID="button-header-manage-sets"
            variant="drawer"
          />
        </li>
        <li>
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
            variant="drawer"
          />
        </li>
        <li>
          <UnstyledButton
            onClick={toggleGdcApps}
            className="flex gap-1 px-1 py-4 hover:bg-primary-lightest w-full hover:rounded-md text-primary-darkest"
            aria-expanded={gdcAppsOpened ? "true" : "false"}
          >
            <AppsIcon
              size={24}
              className="text-primary-darkest"
              aria-hidden="true"
            />
            <div className="text-sm">GDC Apps</div>
            <DownArrowCollapseIcon size={24} aria-hidden="true" />
          </UnstyledButton>
        </li>
      </ul>
      <Collapse in={gdcAppsOpened}>
        <ul>
          {externalAppLinks.map((linkProps) => (
            <li key={linkProps.customDataTestID}>
              <HeaderLink {...linkProps} variant="menu" />
            </li>
          ))}
        </ul>
      </Collapse>
    </Drawer>
  );
};

export default HeaderDrawer;
