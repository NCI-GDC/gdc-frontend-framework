import React from "react";
import { ActionIcon, Collapse, Drawer, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  AppsIcon,
  DownArrowCollapseIcon,
  LeftArrowIcon,
} from "src/commonIcons";
import HeaderLink from "./HeaderLink";
import { HeaderItem, HeaderLinkItem } from "./types";
import { createHeaderItem, isHeaderButtonItem } from "./HeaderItem";

interface HeaderDrawerProps {
  readonly headerLinks: ReadonlyArray<HeaderItem>;
  readonly drawerOpened: boolean;
  readonly closeDrawer: () => void;
  readonly externalAppLinks: ReadonlyArray<HeaderLinkItem>;
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
  headerLinks,
  externalAppLinks,
  drawerOpened,
  closeDrawer,
}: HeaderDrawerProps) => {
  const [gdcAppsOpened, { toggle: toggleGdcApps }] = useDisclosure(false);

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
        {headerLinks.map((item) => {
          if (isHeaderButtonItem(item)) {
            const handleClick = () => {
              if (item.onClick) {
                item.onClick();
              }
              closeDrawer();
            };
            return (
              <li key={item.customDataTestID}>
                {createHeaderItem({
                  ...item,
                  onClick: handleClick,
                  variant: "drawer",
                })}
              </li>
            );
          }

          return (
            <li key={item.customDataTestID}>
              {createHeaderItem({ ...item, variant: "drawer" })}
            </li>
          );
        })}

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
