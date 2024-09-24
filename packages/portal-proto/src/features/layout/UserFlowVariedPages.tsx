import { PropsWithChildren, ReactNode, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import {
  isString,
  useCoreSelector,
  useCoreDispatch,
  selectBanners,
  selectCurrentCohortName,
  selectCohortMessage,
  clearCohortMessage,
  useGetBannerNotificationsQuery,
  selectCurrentModal,
  Modals,
  hideModal,
} from "@gff/core";
import Banner from "@/components/Banner";
import { Button, Modal } from "@mantine/core";
import {
  DeleteCohortNotification,
  DiscardChangesCohortNotification,
  ErrorCohortNotification,
  NewCohortNotification,
  SavedCurrentCohortNotification,
  NewCohortNotificationWithSetAsCurrent,
  SavedCohortNotification,
  SavedCohortNotificationWithSetAsCurrent,
} from "@/features/cohortBuilder/CohortNotifications";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useElementSize } from "@mantine/hooks";
import ClearStoreErrorBoundary from "@/components/ClearStoreErrorBoundary";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface UserFlowVariedPagesProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath?: string;
  readonly Options?: React.FC<unknown>;
  readonly ContextBar?: ReactNode;
  readonly isContextBarSticky?: boolean;
}

export const UserFlowVariedPages = ({
  headerElements,
  indexPath = "/",
  Options,
  children,
  ContextBar = undefined,
  isContextBarSticky = false,
}: PropsWithChildren<UserFlowVariedPagesProps>) => {
  const dispatch = useCoreDispatch();
  const modal = useCoreSelector((state) => selectCurrentModal(state));

  useGetBannerNotificationsQuery();
  const banners = useCoreSelector((state) => selectBanners(state));

  const currentCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );
  const cohortMessage = useCoreSelector((state) => selectCohortMessage(state));

  useEffect(() => {
    if (cohortMessage) {
      for (const message of cohortMessage) {
        const cmdAndParam = message.split("|", 3);
        if (cmdAndParam.length == 3) {
          if (cmdAndParam[0] === "newCohort") {
            showNotification({
              message: <NewCohortNotification cohortName={cmdAndParam[1]} />,
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "deleteCohort") {
            showNotification({
              message: <DeleteCohortNotification cohortName={cmdAndParam[1]} />,
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "savedCohort") {
            showNotification({
              message: <SavedCohortNotification cohortName={cmdAndParam[1]} />,
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "savedCohortSetCurrent") {
            showNotification({
              message: (
                <SavedCohortNotificationWithSetAsCurrent
                  cohortName={cmdAndParam[1]}
                  cohortId={cmdAndParam[2]}
                />
              ),
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "savedCurrentCohort") {
            showNotification({
              message: <SavedCurrentCohortNotification />,
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "discardChanges") {
            showNotification({
              message: <DiscardChangesCohortNotification />,
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "error") {
            showNotification({
              message: <ErrorCohortNotification errorType={cmdAndParam[1]} />,
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "newCasesCohort") {
            showNotification({
              message: (
                <NewCohortNotificationWithSetAsCurrent
                  cohortName={cmdAndParam[1]}
                  cohortId={cmdAndParam[2]}
                />
              ),
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
          if (cmdAndParam[0] === "newProjectsCohort") {
            showNotification({
              message: (
                <NewCohortNotificationWithSetAsCurrent
                  cohortName={cmdAndParam[1]}
                  cohortId={cmdAndParam[2]}
                />
              ),
              classNames: {
                description: "flex flex-col content-center text-center",
              },
              autoClose: 5000,
              closeButtonProps: { "aria-label": "Close notification" },
            });
          }
        }
      }

      dispatch(clearCohortMessage());
    }
  }, [cohortMessage, dispatch, currentCohortName]);

  const { ref: headerRef, height: headerHeight } = useElementSize();

  return (
    <div className="flex flex-col min-h-screen min-w-full bg-base-max">
      <header
        className="flex-none bg-base-max sticky top-0 z-[300] shadow-lg"
        ref={headerRef}
        id="global-header"
      >
        {banners.map((banner) => (
          <Banner {...banner} key={banner.id} />
        ))}
        <Header {...{ headerElements, indexPath, Options }} />
      </header>
      <ClearStoreErrorBoundary>
        <>
          <aside
            className={`${
              isContextBarSticky ? `sticky z-[299] shadow-lg` : ""
            }`}
            style={{
              top: `${isContextBarSticky && `${Math.round(headerHeight)}px`}`, // switching this to tailwind does not work
            }}
          >
            {ContextBar ? ContextBar : null}
          </aside>
          <main
            data-tour="full_page_content"
            className="flex flex-grow flex-col overflow-x-clip overflow-y-clip"
            id="main"
          >
            {children}
          </main>
          <Modal
            opened={modal === Modals.SaveSetErrorModal}
            onClose={() => dispatch(hideModal())}
            title="Save Set Error"
            zIndex={500}
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

export interface CohortGraphs {
  readonly showSummary?: boolean;
  readonly showCase?: boolean;
  readonly showAnalysis?: boolean;
  readonly showFiles?: boolean;
}

export const CohortGraphs: React.FC<CohortGraphs> = ({
  showAnalysis = false,
  showCase = false,
  showFiles = false,
  showSummary = false,
}: CohortGraphs) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        {showSummary && <Button>Summary</Button>}
        {showCase && <Button>Case</Button>}
        {showAnalysis && <Button>Analysis</Button>}
        {showFiles && <Button>Files</Button>}
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <Graph />
        <Graph />
        <Graph />
        <Graph />
        <Graph />
        <Graph />
      </div>
    </div>
  );
};

export const Graph: React.FC<unknown> = () => {
  return (
    <div className="h-52 border pt-2 px-4 pb-4 bg-base-lightest">
      <div className="flex flex-col h-full gap-y-2">
        <span className="text-center">Graph</span>
        <div className="flex-grow">
          <CardPlaceholder />
        </div>
      </div>
    </div>
  );
};

export interface ButtonProps {
  readonly color?: string;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly stylingOff?: boolean;
}

export const CohortExpressionsAndBuilder: React.FC<unknown> = () => {
  return <div className="h-96 text-center">Expressions + Cohort Builder</div>;
};

export interface AppProps {
  readonly name?: ReactNode;
  readonly onClick?: () => void;
}

export const App: React.FC<AppProps> = ({
  name = <LinePlaceholer length={6} />,
  children,
  onClick = () => {
    return;
  },
}: PropsWithChildren<AppProps>) => {
  if (!children) {
    if (isString(name)) {
      children = <Initials name={name} />;
    } else {
      children = <CardPlaceholder />;
    }
  }
  return (
    <button
      className="group h-52 border border-base-lighter px-4 pt-2 pb-4 flex flex-col gap-y-2 bg-base-lightest shadow-md hover:shadow-lg hover:border-accent-cool-darker hover:border-2"
      onClick={onClick}
    >
      <div className="text-center w-full text-lg">{name}</div>
      {children}
    </button>
  );
};

interface LinePlaceholerProps {
  readonly length: number;
}

export const LinePlaceholer: React.FC<LinePlaceholerProps> = ({
  length,
}: LinePlaceholerProps) => {
  return (
    <div className="flex flex-row justify-center">
      <div className={`w-${length * 4} h-6 bg-base-lighter rounded-md`} />
    </div>
  );
};

export const CardPlaceholder: React.FC<unknown> = () => {
  // styles for the SVG X from https://stackoverflow.com/a/56557106
  const color = "gray";
  return (
    <div
      className="h-full w-full border border-base-light"
      style={{
        background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><line x1='0' y1='0' x2='100' y2='100' stroke='${color}' vector-effect='non-scaling-stroke'/><line x1='0' y1='100' x2='100' y2='0' stroke='${color}' vector-effect='non-scaling-stroke'/></svg>")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "100% 100%, auto",
      }}
    ></div>
  );
};

export interface InitialsProps {
  readonly name: string;
}

export const Initials: React.FC<InitialsProps> = ({ name }: InitialsProps) => {
  const initials = name
    .replace(/\W/g, " ")
    .split(" ")
    .map((s) => s[0])
    .join("");
  return (
    <div className="flex flex-row justify-content-center items-center w-full h-full">
      <div className="flex-grow text-8xl text-primary">{initials}</div>
    </div>
  );
};
