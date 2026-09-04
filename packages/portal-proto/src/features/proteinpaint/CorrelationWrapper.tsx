import { useRef, useState, FC } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { bindProteinPaint } from "@sjcrh/proteinpaint-client";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  PROTEINPAINT_API,
  useFetchUserDetailsQuery,
} from "./coreAdapter";
import { DemoText } from "@/components/tailwindComponents";
import { LoadingOverlay } from "@mantine/core";
import { RxComponentCallbacks } from "./sjpp-types";
import { isEqual, cloneDeep } from "lodash";

const basepath = PROTEINPAINT_API;

interface PpProps {
  basepath?: string;
}

export const demoFilter = Object.freeze({
  op: "in",
  content: Object.freeze({
    field: "cases.project.project_id",
    value: Object.freeze(["TCGA-LGG"]),
  }),
});

export const CorrelationWrapper: FC<PpProps> = (props: PpProps) => {
  const isDemoMode = useIsDemoApp();
  const demoFilter = {
    op: "in",
    content: { field: "cases.project.project_id", value: ["TCGA-LGG"] },
  };
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode
    ? cloneDeep(demoFilter)
    : buildCohortGqlOperator(currentCohort);
  const userDetails = useFetchUserDetailsQuery();
  const prevData = useRef<any>(null);
  const toolApp = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showLoadingOverlay = () => setIsLoading(true);
  const hideLoadingOverlay = () => setIsLoading(false);
  const matrixCallbacks: RxComponentCallbacks = {
    "postRender.gdcCorrelation": hideLoadingOverlay,
    "error.gdcCorrelation": hideLoadingOverlay,
  };
  const appCallbacks: RxComponentCallbacks = {
    "preDispatch.gdcCorrelation": showLoadingOverlay,
    "error.gdcCorrelation": hideLoadingOverlay,
    "postRender.gdcCorrelation": hideLoadingOverlay,
  };
  const initArgs = getCorrelationTrack(
    props,
    matrixCallbacks,
    appCallbacks,
    isDemoMode,
  );

  useDeepCompareEffect(
    () => {
      // debounce until one of these is true
      // otherwise, the userDetails.isFetching changing from false > true > false
      // could trigger unnecessary, wastefule PP-app state update
      if (userDetails?.isSuccess === false && userDetails?.isError === false)
        return;

      const data = {
        filter0: filter0 || null,
        userData: userDetails?.data,
      };
      const hasUpdates =
        (data || prevData.current) && !isEqual(prevData.current, data);
      if (hasUpdates) prevData.current = data;
      const rootElem = divRef.current as HTMLElement;

      let updateArgs;
      if (hasUpdates) {
        updateArgs = { filter0: data.filter0 };

        // TODO:
        // showing and hiding the overlay should be triggered by components that may take a while to load/render,
        // this wrapper code can show the overlay here since it has supplied postRender callbacks above,
        // but ideally it is the PP-app that triggers both the showing and hiding of the overlay for reliable behavior
        const toolContainer = rootElem.parentNode.parentNode
          .parentNode as HTMLElement;
        toolContainer.style.backgroundColor = "#fff";
      }

      Object.assign(initArgs, {
        holder: rootElem,
        noheader: true,
        nobox: true,
        hide_dsHandles: true,
        filter0: data.filter0,
      });

      // bindProteinPaint() handles rapid update requests/race condition,
      // so no need to include debouncing and promise code in this wrapper
      // TODO: will revert to using runproteinpaint() once these advanced capabilities
      // are merged into it
      bindProteinPaint({
        rootElem,
        initArgs,
        updateArgs,
        isStale() {
          // new data has replaced this one, will prevent unnecessary render
          // in case of race condition
          return prevData.current != data;
        },
      }).then?.((_app) => {
        toolApp.current = _app;
      });

      return () => {
        if (!toolApp.current || window.location.href.includes("Correlation"))
          return;
        // cancel unnecessary network requests when this tool app is hidden
        toolApp.current.triggerAbort();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter0, userDetails?.data],
  );

  const divRef = useRef(null);
  return (
    <div className="relative">
      {isDemoMode && (
        <DemoText>
          Demo showing correlation of survival with IDH1 Mutation/CNV (TCGA-LGG
          project).
        </DemoText>
      )}
      <div
        ref={divRef}
        className="sjpp-wrapper-root-div"
        style={{ minHeight: "440px" }}
        //userDetails={userDetails}
      />

      <LoadingOverlay
        data-testid="loading-spinner"
        visible={isLoading}
        zIndex={0}
      />
    </div>
  );
};

interface CorrelationArg {
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  launchGdcCorrelation: boolean;
  filter0?: any; //FilterSet;
  opts: {
    [appOrComponentName: string]: {
      callbacks?: {
        [eventName: string]: () => void;
      };
    };
  };
  state?: any;
}

function getCorrelationTrack(
  props: PpProps,
  matrixCallbacks?: RxComponentCallbacks,
  appCallbacks?: RxComponentCallbacks,
  isDemoMode?: boolean,
): CorrelationArg {
  const arg: CorrelationArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    launchGdcCorrelation: true,
    opts: {
      app: {
        callbacks: appCallbacks,
      },
    },
  };

  if (isDemoMode) {
    arg.state = {
      plots: [
        {
          chartType: "survival",
          term: {
            id: "Overall Survival",
          },
          term2: {
            term: {
              type: "geneVariant",
              id: "IDH1",
              name: "IDH1",
            },
          },
        },
      ],
    };
  }

  return arg;
}
