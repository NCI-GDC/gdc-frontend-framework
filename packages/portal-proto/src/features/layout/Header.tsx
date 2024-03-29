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
import { Button, LoadingOverlay, Menu, Badge } from "@mantine/core";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
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
import { FiPlayCircle as PlayIcon } from "react-icons/fi";
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
        <div className="flex-none w-64 h-nci-logo mr-2 relative">
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

        <div className="flex justify-end md:flex-wrap lg:flex-nowrap md:mb-3 lg:mb-0 md:gap-0 lg:gap-3 items-center text-primary-darkest font-heading text-sm font-medium">
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
          <Link
            href="/annotations"
            className={`p-1 rounded-md ${
              router.pathname === "/annotations"
                ? "bg-secondary text-white"
                : "hover:bg-primary-lightest"
            }`}
          >
            <div className="flex items-center gap-1 font-heading">
              <PencilIcon size="24px" />
              Browse Annotations
            </div>
          </Link>
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
          {userInfo?.data?.username ? (
            <Menu width={200} data-testid="userdropdown" zIndex={9} offset={-5}>
              <Menu.Target>
                <Button
                  rightIcon={
                    <ArrowDropDownIcon size="2em" aria-hidden="true" />
                  }
                  variant="subtle"
                  className="text-primary-darkest font-header text-sm font-medium font-heading"
                  classNames={{ rightIcon: "ml-0" }}
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
                    userDropdownRef?.current &&
                      userDropdownRef?.current?.focus();
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
                            {userInfo?.data.username} does not have access to
                            any protected data within the GDC. Click{" "}
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
      <div className="flex flex-grow">{Options && <Options />}</div>
      <SendFeedbackModal
        opened={openFeedbackModal}
        onClose={() => setOpenFeedbackModal(false)}
      />
      <GeneralErrorModal openModal={modal === Modals.GeneralErrorModal} />
      <UserProfileModal openModal={modal === Modals.UserProfileModal} />
      <SessionExpireModal openModal={modal === Modals.SessionExpireModal} />
      <NoAccessModal openModal={modal === Modals.NoAccessModal} />
      <FirstTimeModal openModal={modal === Modals.FirstTimeModal} />
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
    </div>
  );
};
