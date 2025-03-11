import React, { ReactNode, useContext, useEffect } from "react";
import { Burger, MantineProvider } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { AppContext } from "src/context";
import ExternalAppMenu from "../ExternalAppMenu";
import HeaderDrawer from "./HeaderDrawer";
import { type HeaderItem, type HeaderLinkItem } from "./types";
import { createHeaderItem } from "./HeaderItem";

const MAX_WIDTH_FOR_HAMBURGER = 1280;

interface HeaderProps {
  readonly AppLogo: React.ReactNode;
  readonly headerApps: ReadonlyArray<ReactNode>;
  readonly headerLinks: ReadonlyArray<HeaderItem>;
  readonly externalAppLinks: ReadonlyArray<HeaderLinkItem>;
  readonly indexPath: string;
  readonly LoginButton?: React.ComponentType;
  readonly QuickSearch?: React.ComponentType;
}

const Header: React.FC<HeaderProps> = ({
  AppLogo,
  headerApps,
  headerLinks,
  externalAppLinks,
  indexPath,
  LoginButton = undefined,
  QuickSearch = undefined,
}: HeaderProps) => {
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

  const { Link, theme } = useContext(AppContext);

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
            <Link
              href={indexPath}
              data-testid="NIHLogoButton"
              className="block w-full h-full mt-2"
            >
              {AppLogo}
            </Link>
          </div>

          <div className="flex xl:hidden justify-center align-center gap-4 ">
            {LoginButton && <LoginButton />}
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
            headerLinks={headerLinks}
            drawerOpened={drawerOpened}
            closeDrawer={closeDrawer}
            externalAppLinks={externalAppLinks}
          />

          {/* Right Side Nav Bar */}
          <div
            className="hidden xl:flex justify-end md:flex-wrap lg:flex-nowrap md:mb-3 lg:mb-0 md:gap-0 lg:gap-3 items-center text-primary-darkest font-heading text-sm font-medium"
            role="navigation"
            aria-label=""
          >
            {headerLinks.map((item) => createHeaderItem(item))}
            {LoginButton && <LoginButton />}
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
            {headerApps.map((element, i) => (
              <div key={i} className={`${i === 0 ? "pr-2" : "pl-4"}`}>
                {typeof element === "string" ? (
                  <span className="font-semibold">{element}</span>
                ) : (
                  element
                )}
              </div>
            ))}
          </div>
          {QuickSearch && (
            <div className="xl:w-1/3">
              <QuickSearch />
            </div>
          )}
        </div>
      </div>
    </MantineProvider>
  );
};

export default Header;
