import { PropsWithChildren, ReactNode, useEffect } from "react";
// TODO: uncomment during PEAR-845
// import { useRouter } from "next/router";
import {
  isString,
  useCoreSelector,
  useCoreDispatch,
  fetchNotifications,
  selectBanners,
  fetchUserDetails,
  selectCurrentModal,
  Modals,
} from "@gff/core";
import Banner from "@/components/Banner";
import { Button } from "@mantine/core";
// TODO: uncomment during PEAR-845
// import { useTour } from "@reactour/tour";
// import steps from "../../features/tour/steps";
import { Header } from "./Header";
import { GeneralErrorModal } from "@/components/Modals/GeneraErrorModal";
import { Footer } from "./Footer";
import { UserProfileModal } from "@/components/Modals/UserProfileModal";
import { SessionExpireModal } from "@/components/Modals/SessionExpireModal";
import { NoAccessModal } from "@/components/Modals/NoAccessModal";
import { FirstTimeModal } from "@/components/Modals/FirstTimeModal";

interface UserFlowVariedPagesProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath?: string;
  readonly Options?: React.FC<unknown>;
}

export const UserFlowVariedPages: React.FC<UserFlowVariedPagesProps> = ({
  headerElements,
  indexPath = "/",
  Options,
  children,
}: PropsWithChildren<UserFlowVariedPagesProps>) => {
  // TODO: uncomment during PEAR-845
  // const { setSteps } = useTour();
  // const router = useRouter();
  const dispatch = useCoreDispatch();
  const modal = useCoreSelector((state) => selectCurrentModal(state));

  useEffect(() => {
    // TODO: uncomment during PEAR-845
    // setSteps(steps[router.pathname]);
    dispatch(fetchUserDetails());
    dispatch(fetchNotifications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const banners = useCoreSelector((state) => selectBanners(state));
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-base-max">
      <header className="flex-none bg-base-max sticky top-0 z-[300]">
        {banners.map((banner) => (
          <Banner {...banner} key={banner.id} />
        ))}
        <Header {...{ headerElements, indexPath, Options }} />
      </header>
      <main
        data-tour="full_page_content"
        className="flex flex-grow flex-col overflow-x-hidden overflow-y-hidden"
        id="main"
      >
        {modal === Modals.GeneralErrorModal && <GeneralErrorModal openModal />}
        {modal === Modals.UserProfileModal && <UserProfileModal openModal />}
        {modal === Modals.SessionExpireModal && (
          <SessionExpireModal openModal />
        )}
        {modal === Modals.NoAccessModal && <NoAccessModal openModal />}
        {modal === Modals.FirstTimeModal && <FirstTimeModal openModal />}
        {children}
      </main>
      <footer className="flex-none">
        <Footer />
      </footer>
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
