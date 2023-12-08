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
import { ReactNode, useContext, useEffect } from "react";
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

export const Header: React.FC<HeaderProps> = ({
  headerElements,
  indexPath,
  Options = () => <div />,
}: HeaderProps) => {
  const dispatch = useCoreDispatch();
  const router = useRouter();

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
        <div className="flex-none w-64 h-nci-logo mr-2 relative">
          <Link href={indexPath} data-testid="NIHLogoButton" passHref>
            <a className="block w-full h-full mt-2">
              <NIHLogo
                layout="fill"
                style={{ objectFit: "contain" }}
                data-testid="button-header-home"
                aria-label="NIH GDC Data Portal logo"
                role="img"
              />
            </a>
          </Link>
        </div>

        <div className="flex justify-end gap-2 items-center text-primary-darkest font-heading text-sm font-medium">
          <a
            href="https://portal.gdc.cancer.gov/annotations"
            className="flex items-center gap-1 p-1 pr-2 rounded-md hover:bg-primary-lightest"
            target="_blank"
            rel="noreferrer"
          >
            <PencilIcon size="24px" />
            Browse Annotations
          </a>
          <Link href="/manage_sets" passHref>
            <Button
              unstyled
              data-testid="button-header-manage-sets"
              className={`p-1 pr-2 rounded-md ${
                router.pathname === "/manage_sets"
                  ? "bg-secondary text-white"
                  : "hover:bg-primary-lightest"
              }`}
            >
              <div className="flex items-center gap-1 font-heading">
                <OptionsIcon size="22px" className="rotate-90" />
                Manage Sets
              </div>
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button
              unstyled
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
            </Button>
          </Link>
          {userInfo?.data?.username ? (
            <Menu width={200} data-testid="userdropdown" zIndex={9} offset={-5}>
              <Menu.Target>
                <Button
                  rightIcon={<ArrowDropDownIcon size="2em" />}
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
          <Menu
            withArrow
            arrowSize={16}
            position="bottom-end"
            arrowPosition="center"
          >
            <Menu.Target>
              <button
                data-testid="extraButton"
                aria-label="GDC apps button"
                className="flex items-center gap-1 p-1 pr-2 rounded-md hover:bg-primary-lightest"
              >
                <AppsIcon size="24px" className="text-primary-darkest" />
                <p className="font-heading">GDC Apps</p>
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
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row flex-wrap items-center divide-x divide-gray-300">
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
        <div className="w-1/3">
          <QuickSearch />
        </div>
      </div>
      <div className="flex flex-grow">
        <Options />
      </div>
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
    </div>
  );
};
