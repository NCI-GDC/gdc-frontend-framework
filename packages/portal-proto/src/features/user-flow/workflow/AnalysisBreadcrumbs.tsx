import React, { useContext } from "react";
import { MdClose, MdCircle } from "react-icons/md";
import { Button } from "@mantine/core";
import { SelectionScreenContext } from "./AnalysisWorkspace";
import { REGISTERED_APPS } from "./registeredApps";

interface AnalysisBreadcrumbsProps {
  readonly rightComponent?: React.ReactElement;
  readonly onDemoApp?: boolean;
}

const AnalysisBreadcrumbs: React.FC<AnalysisBreadcrumbsProps> = ({
  rightComponent,
  onDemoApp,
}: AnalysisBreadcrumbsProps) => {
  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);
  const appInfo = REGISTERED_APPS.find((a) => a.id === app);

  const displayAdditionalSteps =
    !onDemoApp && appInfo?.selectionScreen !== undefined;

  return (
    <div className="w-full bg-primary px-4 py-2 flex items-center ">
      <Button
        onClick={() => setActiveApp(undefined)}
        className="bg-base-max text-primary-content-darkest px-2"
        aria-label="Close app"
      >
        <MdClose size={20} />
      </Button>
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
              <MdCircle size={8} color="white" />
              <span
                className={`p-2 mx-2 uppercase cursor-pointer text-white ${
                  selectionScreenOpen ? "font-bold" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectionScreenOpen(true)}
                onKeyDown={(e) =>
                  e.key === "Enter" ? setSelectionScreenOpen(true) : null
                }
              >
                Selection
              </span>
            </>
          )}
          {!selectionScreenOpen && (
            <>
              <MdCircle size={8} color="white" />
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
