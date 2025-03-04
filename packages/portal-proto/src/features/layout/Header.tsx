import React from "react";
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
import { LoadingOverlay, Badge } from "@mantine/core";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Image } from "@/components/Image";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
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
import LoginButtonOrUserDropdown from "./LoginButtonOrUserDropdown";
import {
  CartIcon,
  FeebackIcon,
  OptionsIcon,
  PencilSquareIcon,
  PlayVideoIcon,
} from "@/utils/icons";
import {
  Header as CommonHeader,
  type HeaderItem,
  type HeaderLinkItem,
} from "@gff/portal-components";
import { useDeepCompareMemo } from "use-deep-compare";

interface HeaderProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath: string;
}

const externalAppLinks: HeaderLinkItem[] = [
  {
    customDataTestID: "button-header-data-portal",
    href: "https://portal.gdc.cancer.gov?utm_source=dataportal&utm_medium=apps",
    image: (
      <Image
        src="/user-flow/icons/gdc-app-data-portal-blue.svg"
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Data Portal",
  },
  {
    customDataTestID: "button-header-website",
    href: "https://gdc.cancer.gov?utm_source=dataportal&utm_medium=apps",
    text: "Website",
    image: (
      <Image
        src={"/user-flow/icons/gdc-app-website-blue.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
  },
  {
    customDataTestID: "button-header-api",
    href: "https://gdc.cancer.gov/developers/gdc-application-programming-interface-api?utm_source=dataportal&utm_medium=apps",
    image: (
      <Image
        src={"/user-flow/icons/gdc-app-portal-api.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "API",
  },
  {
    customDataTestID: "button-header-data-transfer-tool",
    href: "https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/?utm_source=dataportal&utm_medium=apps",
    image: (
      <Image
        src={"/user-flow/icons/gdc-app-data-transfer-tool.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Data Transfer Tool",
  },
  {
    customDataTestID: "button-header-documentation",
    href: "https://docs.gdc.cancer.gov?utm_source=dataportal&utm_medium=apps",
    image: (
      <Image
        src={"/user-flow/icons/gdc-app-docs.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Documentation",
  },
  {
    customDataTestID: "button-header-data-submission-portal",
    href: "https://portal.gdc.cancer.gov/submission?utm_source=dataportal&utm_medium=apps",
    image: (
      <Image
        src={"/user-flow/icons/gdc-app-submission-portal.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Data Submission Portal",
  },
  {
    customDataTestID: "button-header-publications",
    href: "https://gdc.cancer.gov/about-data/publications?utm_source=dataportal&utm_medium=apps",
    image: (
      <Image
        src={"/user-flow/icons/gdc-app-publications.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Publications",
  },
];

const AppLogo = (
  <NIHLogo
    layout="fill"
    style={{ objectFit: "contain" }}
    data-testid="button-header-home"
    aria-label="NIH GDC Data Portal Home"
    role="img"
  />
);

export const Header: React.FC<HeaderProps> = ({
  headerElements,
  indexPath,
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

  const headerLinks: HeaderItem[] = useDeepCompareMemo(
    () => [
      {
        customDataTestID: "button-header-video-guides",
        href: "https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/",
        image: <PlayVideoIcon size={24} />,
        text: "Video Guides",
        isExternal: true,
      },
      {
        customDataTestID: "button-header-send-feedback",
        onClick: () => {
          setOpenFeedbackModal(true);
        },
        image: <FeebackIcon size={24} />,
        text: "Send Feedback",
        type: "button",
      },
      {
        customDataTestID: "button-header-browse-annotations",
        href: "/annotations",
        image: <PencilSquareIcon size={24} />,
        text: "Browse Annotations",
        isExternal: false,
      },
      {
        customDataTestID: "button-header-manage-sets",
        href: "/manage_sets",
        image: <OptionsIcon size={24} style={{ transform: "rotate(90deg)" }} />,
        text: "Manage Sets",
        isExternal: false,
      },
      {
        customDataTestID: "button-header-cart",
        href: "/cart",
        image: <CartIcon size={24} />,
        text: "Cart",
        isExternal: false,
        children: (
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
        ),
      },
    ],
    [currentCart, router.pathname],
  );

  return (
    <>
      <LoadingOverlay
        data-testid="loading-spinner"
        visible={!(totalSuccess || dictSuccess)}
      />
      <CommonHeader
        headerApps={headerElements}
        headerLinks={headerLinks}
        externalAppLinks={externalAppLinks}
        indexPath={indexPath}
        AppLogo={AppLogo}
        LoginButton={LoginButtonOrUserDropdown}
        QuickSearch={QuickSearch}
      />

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
    </>
  );
};
