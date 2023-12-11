import { useEffect, useRef, useCallback, useState, FC } from "react";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  FilterSet,
  PROTEINPAINT_API,
  useUserDetails,
  useCoreDispatch,
  addNewUnsavedCohort,
} from "@gff/core";
import { isEqual } from "lodash";
import { DemoText } from "@/components/tailwindComponents";
import { LoadingOverlay } from "@mantine/core";
import {
  SelectSamples,
  SelectSamplesCallBackArg,
  SelectSamplesCallback,
  getFilters,
  RxComponentCallbacks,
} from "./sjpp-types";

const basepath = PROTEINPAINT_API;

interface PpProps {
  basepath?: string;
}

export const GeneExpressionWrapper: FC<PpProps> = (props: PpProps) => {
  const isDemoMode = useIsDemoApp();
  const defaultFilter = {
    op: "in",
    content: { field: "cases.disease_type", value: ["Gliomas"] },
  };
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode
    ? defaultFilter
    : buildCohortGqlOperator(currentCohort);
  const userDetails = useUserDetails();
  const ppRef = useRef<PpApi>();
  const prevData = useRef<any>();
  const coreDispatch = useCoreDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // TODO: use the CreatCohortModal, similar to how it's done in OncoMatrix
  const callback = useCallback<SelectSamplesCallback>(
    (arg: SelectSamplesCallBackArg) => {
      const filters = getFilters(arg);
      coreDispatch(
        // TODO: option to edit a cohort using ImportCohortModal???
        addNewUnsavedCohort({
          filters,
          message: "newCasesCohort",
          // TODO: improve cohort name constructor
          name: arg.source + ` (n=${arg.samples.length})`,
        }),
      );
    },
    [coreDispatch],
  );

  const callbacks: RxComponentCallbacks = {
    "postRender.gdcGeneExpression": () => setIsLoading(false),
    "error.gdcGeneExpression": () => setIsLoading(false),
  };

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const data = { filter0, userDetails };
      if (isEqual(prevData.current, data)) return;

      prevData.current = data;

      const toolContainer = rootElem.parentNode.parentNode
        .parentNode as HTMLElement;
      toolContainer.style.backgroundColor = "#fff";
      setIsLoading(true);

      if (ppRef.current) {
        ppRef.current.update({ filter0: prevData.current.filter0 });
      } else {
        const pp_holder = rootElem.querySelector(".sja_root_holder");
        if (pp_holder) pp_holder.remove();

        const data = getGeneExpressionTrack(
          props,
          prevData.current.filter0,
          callback,
          callbacks,
        );
        if (!data) return;

        const arg = Object.assign(
          {
            holder: rootElem,
            noheader: true,
            nobox: true,
            hide_dsHandles: true,
          },
          data,
        ) as GeneExpressionArg;

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
      {isDemoMode && <DemoText>Demo showing cases with Gliomas.</DemoText>}
      <div
        ref={divRef}
        style={{ margin: "2em" }}
        className="sjpp-wrapper-root-div"
        //userDetails={userDetails}
      />
      <LoadingOverlay data-testid="loading-spinner" visible={isLoading} />
    </div>
  );
};

interface PpApi {
  update(arg: any): null;
}

interface GeneExpressionArg {
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  launchGdcHierCluster: boolean;
  filter0: FilterSet;
  opts: GeneExpressionArgOpts;
}

interface GeneExpressionArgOpts {
  hierCluster: GeneExpressionArgHierCluster;
}

interface GeneExpressionArgHierCluster {
  allow2selectSamples?: SelectSamples;
  callbacks: RxComponentCallbacks;
}

function getGeneExpressionTrack(
  props: PpProps,
  filter0: any,
  callback?: SelectSamplesCallback,
  callbacks?: RxComponentCallbacks,
) {
  const defaultFilter = null;

  const arg: GeneExpressionArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    launchGdcHierCluster: true,
    filter0: filter0 || defaultFilter,
    opts: {
      hierCluster: {
        allow2selectSamples: {
          buttonText: "Create Cohort",
          attributes: [
            {
              from: "sample",
              to: "cases.case_id",
              convert: true,
            },
          ],
          callback,
        },
        callbacks,
      },
    },
  };

  return arg;
}
