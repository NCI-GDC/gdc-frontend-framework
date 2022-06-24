import { PropsWithChildren, ReactNode, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu } from "@mantine/core";
import {
  isString,
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  fetchNotifications,
  selectBanners,
  useTotalCounts,
  useFacetDictionary,
} from "@gff/core";
import {
  MdOutlineLogin as LoginIcon,
  MdShoppingCart as CartIcon,
  MdOutlineApps as AppsIcon,
  MdSearch as SearchIcon,
  MdOutlineTour as TourIcon,
} from "react-icons/md";
import Banner from "@/components/Banner";
import { Button, LoadingOverlay } from "@mantine/core";
import { useTour } from "@reactour/tour";
import steps from "../../features/tour/steps";

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
  const { setSteps } = useTour();
  const router = useRouter();
  const dispatch = useCoreDispatch();

  useEffect(() => {
    setSteps(steps[router.pathname]);
    dispatch(fetchNotifications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const banners = useCoreSelector((state) => selectBanners(state));
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-nci-gray-lightest">
      <div className="sticky top-0 z-50">
        {banners.map((banner) => (
          <Banner {...banner} key={banner.id} />
        ))}
      </div>
      <header className="flex-none bg-white">
        <Header {...{ headerElements, indexPath, Options }} />
      </header>
      <main data-tour="full_page_content" className="flex-grow flex flex-col">
        {children}
      </main>
      <footer className="flex-none">
        <Footer />
      </footer>
    </div>
  );
};

interface HeaderProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
  readonly indexPath: string;
  readonly Options?: React.FC<unknown>;
}

const Header: React.FC<HeaderProps> = ({
  headerElements,
  indexPath,
  Options = () => <div />,
}: HeaderProps) => {
  const { setIsOpen } = useTour();
  const currentCart = useCoreSelector((state) => selectCart(state));
  const { isSuccess: totalSuccess } = useTotalCounts(); // request total counts and facet dictionary
  const { isSuccess: dictSuccess } = useFacetDictionary();
  return (
    <div className="px-6 py-3 border-b border-gdc-grey-lightest">
      <div className="flex flex-row flex-wrap divide-x divide-gray-300 items-center">
        <LoadingOverlay visible={!(totalSuccess || dictSuccess)} />
        <div className="flex-none w-64 h-nci-logo mr-2 relative">
          {/* There's some oddities going on here that need to be explained.  When a
          <Link> wraps an <Image>, react complains it's expecting a reference to be
          passed along. A popular fix is to wrap the child with an empty anchor tag.
          This causes an accessibility problem because empty anchors confuse screen
          readers. The button tag satisfies both react's requirements and a11y
          requirements.  */}
          <Link href={indexPath}>
            <button>
              <Image
                src="/NIH_GDC_DataPortal-logo.svg"
                layout="fill"
                objectFit="contain"
              />
            </button>
          </Link>
        </div>
        {headerElements.map((element, i) => (
          <div key={i} className="px-2">
            {typeof element === "string" ? (
              <span className="font-semibold">{element}</span>
            ) : (
              element
            )}
          </div>
        ))}
        <div className="flex-grow"></div>
        <div className="w-64">
          <Options />
        </div>

        <div className="flex flex-row items-center align-middle flex-nowrap">
          <div
            className={
              "flex flex-row opacity-60 hover:opacity-100 transition-opacity items-center mx-2 "
            }
          >
            <SearchIcon size="24px" />{" "}
          </div>
          <div
            className={
              "flex flex-row opacity-60 hover:opacity-100 transition-opacity items-center mx-2 "
            }
          >
            <LoginIcon className="mr-1" size="24px" /> Login{" "}
          </div>
          <div
            className={
              "flex flex-row opacity-60 hover:opacity-100 transition-opacity  items-center mx-2"
            }
          >
            <CartIcon size="24px" /> Cart ({currentCart.length})
          </div>

          <Menu
            withArrow
            className={"opacity-60 hover:opacity-100 transition-opacity mx-2"}
            control={
              <button className="p-0">
                <AppsIcon className="mt-2" size="24px" />
              </button>
            }
          >
            <Menu.Item onClick={() => setIsOpen(true)}>
              <TourIcon size="2.5em" />
              <div className="text-center text-sm pt-1">{"Tour"}</div>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col bg-nci-blumine justify-center text-center p-4 text-white">
      <div>Site Home | Policies | Accessibility | FOIA | Support</div>
      <div>
        U.S. Department of Health and Human Services | National Institutes of
        Health | National Cancer Institute | USA.gov
      </div>
      <div>NIH... Turning Discovery Into Health ®</div>
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
    <div className="h-52 border pt-2 px-4 pb-4 bg-white">
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
      className="group h-52 border border-nci-gray-lighter px-4 pt-2 pb-4 flex flex-col gap-y-2 bg-white shadow-md hover:shadow-lg hover:border-nci-blumine-darker hover:border-2"
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
      <div className={`w-${length * 4} h-6 bg-gray-200 rounded-md`} />
    </div>
  );
};

export const CardPlaceholder: React.FC<unknown> = () => {
  // styles for the SVG X from https://stackoverflow.com/a/56557106
  const color = "gray";
  return (
    <div
      className="h-full w-full border border-nci-gray-light"
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
      <div className="flex-grow text-8xl text-gdc-blue">{initials}</div>
    </div>
  );
};
