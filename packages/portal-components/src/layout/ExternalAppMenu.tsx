import React from "react";
import { Menu, MenuItem } from "@mantine/core";
import {
  MdOutlineApps as AppsIcon,
  MdArrowDropDown as ArrowDropDownIcon,
} from "react-icons/md";

const appMenuClass = "data-hovered:bg-primary-lightest p-0 m-0";

interface ExternalAppMenuProps {
  readonly indexPath: string;
  readonly ImageComponent: React.ComponentType<{
    src: string;
    width: number;
    height: number;
    alt: string;
  }>;
  readonly LinkComponent: React.ComponentType<{
    children: string;
    href: string;
  }>;
}

const ExternalAppMenu: React.FC<ExternalAppMenuProps> = ({
  indexPath,
  ImageComponent,
  LinkComponent,
}: ExternalAppMenuProps) => {
  return (
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
          <ArrowDropDownIcon size="24px" className="-ml-1" aria-hidden="true" />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="grid grid-cols-2 p-1 gap-2 font-medium">
          <MenuItem className={appMenuClass}>
            <NavLinkWithIcon
              customDataTestID="button-header-data-portal"
              href={indexPath}
              icon={
                <ImageComponent
                  src="/user-flow/icons/gdc-app-data-portal-blue.svg"
                  width={30}
                  height={30}
                  alt=""
                />
              }
              text="Data Portal"
              overwriteClassName="!px-4 !py-2"
            />
          </MenuItem>
          <MenuItem className={appMenuClass}>
            <LinkComponent
              customDataTestID="button-header-website"
              href="https://gdc.cancer.gov"
              icon="gdc-app-website-blue.svg"
              text="Website"
            />
          </MenuItem>

          <MenuItem className={appMenuClass}>
            <LinkComponent
              data-testid="button-header-api"
              href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
              icon="gdc-app-portal-api.svg"
              text="API"
            />
          </MenuItem>
          <MenuItem className={appMenuClass}>
            <LinkComponent
              data-testid="button-header-data-transfer-tool"
              href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
              icon="gdc-app-data-transfer-tool.svg"
              text="Data Transfer Tool"
            />
          </MenuItem>
          <MenuItem className={appMenuClass}>
            <LinkComponent
              data-testid="button-header-documentation"
              href="https://docs.gdc.cancer.gov"
              icon="gdc-app-docs.svg"
              text="Documentation"
            />
          </MenuItem>
          <MenuItem className={appMenuClass}>
            <LinkComponent
              data-testid="button-header-data-submission-portal"
              href="https://portal.gdc.cancer.gov/submission"
              icon="gdc-app-submission-portal.svg"
              text="Data Submission Portal"
            />
          </MenuItem>
          <MenuItem className={appMenuClass}>
            <LinkComponent
              data-testid="button-header-publications"
              href="https://gdc.cancer.gov/about-data/publications"
              icon="gdc-app-publications.svg"
              text="Publications"
            />
          </MenuItem>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ExternalAppMenu;
