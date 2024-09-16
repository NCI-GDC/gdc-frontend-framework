import { useRef, FC, useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { LoadingOverlay } from "@mantine/core";
import { isEqual } from "lodash";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  PROTEINPAINT_API,
  useFetchUserDetailsQuery,
  buildCohortGqlOperator,
} from "@gff/core";

import { RxComponentCallbacks } from "./sjpp-types";

const basepath = PROTEINPAINT_API;

interface PpProps {
  basepath?: string;
}

export const ScRNAseqWrapper: FC<PpProps> = (props: PpProps) => {
  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>({});
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = buildCohortGqlOperator(currentCohort);
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
        filter0,
        rootElem,
        scRNAseqCallbacks,
        appCallbacks,
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
      <div
        ref={divRef}
        style={{ margin: "2em" }}
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
