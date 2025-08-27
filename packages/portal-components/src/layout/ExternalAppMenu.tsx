import React from "react";
import {
  MdOutlineApps as AppsIcon,
  MdArrowDropDown as ArrowDropDownIcon,
} from "react-icons/md";
import { Menu, MenuItem } from "@mantine/core";
import HeaderLink from "./Header/HeaderLink";
import { HeaderLinkItem } from "./Header/types";

const appMenuClass = "data-hovered:bg-primary-lightest p-0 m-0";

interface ExternalAppMenuProps {
  readonly externalAppLinks: ReadonlyArray<HeaderLinkItem>;
}

const ExternalAppMenu: React.FC<ExternalAppMenuProps> = ({
  externalAppLinks,
}: ExternalAppMenuProps) => {
  return (
    <Menu
      width="450"
      position="bottom-end"
      zIndex={400}
      classNames={{
        dropdown: "border border-primary",
      }}
      withinPortal={false}
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
          <p className="font-heading">Apps</p>
          <ArrowDropDownIcon size="24px" className="-ml-1" aria-hidden="true" />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="grid grid-cols-2 p-1 gap-2 font-medium">
          {externalAppLinks.map((linkProps) => (
            <MenuItem className={appMenuClass} key={linkProps.customDataTestID}>
              <HeaderLink {...linkProps} variant="menu" />
            </MenuItem>
          ))}
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ExternalAppMenu;
