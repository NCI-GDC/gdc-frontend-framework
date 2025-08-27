import React, { useContext } from "react";
import { CircleIcon, CloseIcon } from "src/commonIcons";
import { SelectionScreenContext } from "./context";
import { AppRegistrationEntry } from "./types";

interface AnalysisBreadcrumbsProps {
  readonly registeredApps: AppRegistrationEntry[];
  readonly rightComponent: React.ReactNode;
  readonly onDemoApp: boolean;
  readonly skipSelectionScreen: boolean;
}

const focusStyles =
  "focus-visible:outline-none focus-visible:ring-offset-2 focus:ring-offset-white rounded-md focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-focusColor";

const AnalysisBreadcrumbs: React.FC<AnalysisBreadcrumbsProps> = ({
  registeredApps,
  rightComponent,
  onDemoApp,
  skipSelectionScreen,
}: AnalysisBreadcrumbsProps) => {
  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);
  const appInfo = registeredApps.find((a) => a.id === app);

  const displayAdditionalSteps =
    !skipSelectionScreen && appInfo?.selectionScreen !== undefined;

  return (
    <div className="w-full bg-primary px-4 py-2 flex items-center">
      <button
        onClick={() => setActiveApp && setActiveApp(undefined)}
        className={`bg-base-max text-primary-content-darkest px-2 hover:bg-primary-darkest hover:text-primary-content-lightest rounded-md w-auto h-9 ${focusStyles}`}
        aria-label="Close app"
      >
        <CloseIcon size={20} aria-hidden="true" />
      </button>
      <span
        className={`p-2 mx-2 uppercase text-white ${
          !displayAdditionalSteps ? "font-bold" : ""
        }`}
      >
        {onDemoApp ? `${appInfo?.name} Demo` : appInfo?.name}
      </span>
      {displayAdditionalSteps && (
        <>
          {appInfo?.selectionScreen !== undefined && (
            <>
              <CircleIcon size={8} color="white" role="separator" />
              <span
                className={`p-2 mx-2 uppercase cursor-pointer text-white ${
                  selectionScreenOpen ? "font-bold" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setSelectionScreenOpen && setSelectionScreenOpen(true)
                }
                onKeyDown={(e) =>
                  e.key === "Enter"
                    ? setSelectionScreenOpen && setSelectionScreenOpen(true)
                    : null
                }
              >
                Selection
              </span>
            </>
          )}
          {!selectionScreenOpen && (
            <>
              <CircleIcon size={8} color="white" role="separator" />
              <span className="p-2 mx-2 uppercase font-bold text-white">
                Results
              </span>
            </>
          )}
        </>
      )}
      <div className="ml-auto mr-0">{rightComponent}</div>
    </div>
  );
};

export default AnalysisBreadcrumbs;
