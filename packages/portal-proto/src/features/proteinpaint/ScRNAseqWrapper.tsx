import { useRef, FC, useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { LoadingOverlay } from "@mantine/core";
import { isEqual, cloneDeep } from "lodash";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  PROTEINPAINT_API,
  useFetchUserDetailsQuery,
  buildCohortGqlOperator,
} from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { DemoText } from "@/components/tailwindComponents";

import { RxComponentCallbacks } from "./sjpp-types";

const basepath = PROTEINPAINT_API;

interface PpProps {
  basepath?: string;
}

const DEMO_sample = "2409";
const DEMO_experimentID = "9f155433-3c2e-4b67-a452-eb32f06c93f7";
const DEMO_projectID = "BEATAML1.0-COHORT";

export const demoFilter = Object.freeze({
  op: "in",
  content: Object.freeze({
    field: "cases.submitter_id",
    value: Object.freeze([DEMO_sample]),
  }),
});

// filters={"op":"in","content":{"field":"file_id","value":"df80679e-c4d3-487b-934c-fcc782e5d46e"}}
// &fields=file_size,experimental_strategy,associated_entities.entity_submitter_id,associated_entities.entity_type,associated_entities.case_id,cases.samples.sample_type

export const ScRNAseqWrapper: FC<PpProps> = (props: PpProps) => {
  const isDemoMode = useIsDemoApp();
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode
    ? cloneDeep(demoFilter)
    : buildCohortGqlOperator(currentCohort);
  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>({});
  const userDetails = useFetchUserDetailsQuery();
  const [isLoading, setIsLoading] = useState(false);
  const showLoadingOverlay = () => setIsLoading(true);
  const hideLoadingOverlay = () => setIsLoading(false);
  const scRNAseqCallbacks: RxComponentCallbacks = {
    "postRender.gdcScRNAseq": hideLoadingOverlay,
    "error.gdcScRNAseq": hideLoadingOverlay,
  };
  const appCallbacks: RxComponentCallbacks = {
    "preDispatch.gdcPlotApp": showLoadingOverlay,
    "error.gdcPlotApp": hideLoadingOverlay,
    "postRender.gdcPlotApp": hideLoadingOverlay,
  };

  useDeepCompareEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const arg = getScRNAseqArg(
        props,
        filter0, //isDemoMode ? null : filter0,
        rootElem,
        scRNAseqCallbacks,
        appCallbacks,
        isDemoMode,
      );
      if (!arg) return;

      // compare the argument to runpp to avoid unnecessary render
      if ((arg || prevArg.current) && isEqual(prevArg.current, arg)) return;
      prevArg.current = arg;

      const toolContainer = rootElem.parentNode.parentNode
        .parentNode as HTMLElement;
      toolContainer.style.backgroundColor = "#fff";

      if (ppRef.current) {
        ppRef.current.update(arg);
      } else {
        const pp_holder = rootElem.querySelector(".sja_root_holder");
        if (pp_holder) pp_holder.remove();
        runproteinpaint(arg).then((pp) => {
          ppRef.current = pp;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter0, userDetails],
  );

  const divRef = useRef();
  return (
    <div>
      {isDemoMode && (
        <DemoText>
          Demo showing data for Case {DEMO_sample}, Project {DEMO_projectID} .
        </DemoText>
      )}
      <div
        ref={divRef}
        className="sjpp-wrapper-root-div"
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

interface ScRNAseqArg {
  holder?: Element;
  host: string;
  launchGdcScRNAseq: true;
  genome?: string;
  filter0: any;
  noheader: true;
  nobox: true;
  hide_dsHandles: true;
  state?: {
    plots?: {
      chartType: "singleCellPlot";
      sample?: string;
      experimentID?: string;
      activeTab?: number;
    }[];
  };
  opts: ScRNAseqArgOpts;
}
interface ScRNAseqArgOpts {
  app: ScRNAseqArgOptsApp;
  singleCellPlot: ScRNAseqArgOptsApp;
}

interface ScRNAseqArgOptsApp {
  callbacks?: RxComponentCallbacks;
}

interface PpApi {
  update(arg: any): null;
}

function getScRNAseqArg(
  props: PpProps,
  filter0: any,
  holder: Element,
  scRNAseqCallbacks?: RxComponentCallbacks,
  appCallbacks?: RxComponentCallbacks,
  isDemoMode?: boolean,
) {
  const arg: ScRNAseqArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    filter0: filter0 || null,
    launchGdcScRNAseq: true,
    holder,
    noheader: true,
    nobox: true,
    hide_dsHandles: true,
    state: !isDemoMode
      ? undefined
      : {
          plots: [
            {
              chartType: "singleCellPlot",
              sample: DEMO_sample,
              experimentID: DEMO_experimentID,
              activeTab: 2,
            },
          ],
        },
    opts: {
      app: {
        callbacks: appCallbacks,
      },
      singleCellPlot: {
        callbacks: scRNAseqCallbacks,
      },
    },
  };

  return arg;
}
