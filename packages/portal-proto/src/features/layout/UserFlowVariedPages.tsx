import { PropsWithChildren, ReactNode } from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  selectBanners,
  useGetBannerNotificationsQuery,
  selectCurrentModal,
  Modals,
  hideModal,
  useGetVersionInfoQuery,
} from "@gff/core";
import Banner from "@/components/Banner";
import { Modal, LoadingOverlay } from "@mantine/core";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useElementSize } from "@mantine/hooks";
import ClearStoreErrorBoundary from "@/components/ClearStoreErrorBoundary";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface UserFlowVariedPagesProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath?: string;
  readonly ContextBar?: ReactNode;
  readonly isContextBarSticky?: boolean;
}

export const UserFlowVariedPages = ({
  headerElements,
  indexPath = "/",
  children,
  ContextBar = undefined,
  isContextBarSticky = false,
}: PropsWithChildren<UserFlowVariedPagesProps>) => {
  const dispatch = useCoreDispatch();
  const modal = useCoreSelector((state) => selectCurrentModal(state));

  useGetBannerNotificationsQuery();
  const banners = useCoreSelector((state) => selectBanners(state));
  const { isFetching: isFetchingDataVersion } = useGetVersionInfoQuery();

  const { ref: headerRef, height: headerHeight } = useElementSize();

  return (
    <div className="flex flex-col min-h-screen min-w-full bg-base-max">
      <header
        className="flex-none bg-base-max sticky top-0 shadow-lg z-header"
        ref={headerRef}
        id="global-header"
      >
        {banners.map((banner) => (
          <Banner {...banner} key={banner.id} />
        ))}
        <Header {...{ headerElements, indexPath }} />
      </header>
      <ClearStoreErrorBoundary>
        <>
          <aside
            className={`${isContextBarSticky ? `sticky z-sticky-header shadow-lg` : ""}`}
            style={{
              top: `${isContextBarSticky && `${Math.round(headerHeight)}px`}`, // switching this to tailwind does not work
            }}
            id="context-bar"
          >
            {ContextBar ? ContextBar : null}
          </aside>
          <main
            className="flex grow flex-col overflow-x-clip overflow-y-clip"
            id="main"
          >
            {isFetchingDataVersion ? (
              <LoadingOverlay data-testid="loading-spinner" visible />
            ) : (
              children
            )}
          </main>
          <Modal
            opened={modal === Modals.SaveSetErrorModal}
            onClose={() => dispatch(hideModal())}
            title="Save Set Error"
          >
            <p className="py-2 px-4">There was a problem saving the set.</p>
            <ModalButtonContainer data-testid="modal-button-container">
              <DarkFunctionButton onClick={() => dispatch(hideModal())}>
                OK
              </DarkFunctionButton>
            </ModalButtonContainer>
          </Modal>

          <Modal
            opened={modal === Modals.SaveCohortErrorModal}
            onClose={() => dispatch(hideModal())}
            title="Save Cohort Error"
          >
            <p className="py-2 px-4">There was a problem saving the cohort.</p>
            <ModalButtonContainer data-testid="modal-button-container">
              <DarkFunctionButton onClick={() => dispatch(hideModal())}>
                OK
              </DarkFunctionButton>
            </ModalButtonContainer>
          </Modal>
        </>
      </ClearStoreErrorBoundary>
      <Footer />
    </div>
  );
};
