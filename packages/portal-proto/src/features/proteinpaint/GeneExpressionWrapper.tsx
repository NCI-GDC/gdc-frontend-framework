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
  useCreateCaseSetFromValuesMutation,
} from "@gff/core";
import { isEqual } from "lodash";
import { DemoText } from "@/components/tailwindComponents";
import { LoadingOverlay } from "@mantine/core";
import {
  SelectSamples,
  SelectSamplesCallBackArg,
  SelectSamplesCallback,
  RxComponentCallbacks,
} from "./sjpp-types";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";

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
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createSet, response] = useCreateCaseSetFromValuesMutation();
  const [newCohortFilters, setNewCohortFilters] =
    useState<FilterSet>(undefined);

  const callback = useCallback<SelectSamplesCallback>(
    (arg: SelectSamplesCallBackArg) => {
      const cases = arg.samples.map((d) => d["cases.case_id"]);
      if (cases.length > 1) {
        createSet({ values: cases });
      }
    },
    [createSet],
  );

  // a set for the new cohort is created, now show the save cohort modal
  useEffect(() => {
    if (response.isSuccess) {
      const filters: FilterSet = {
        mode: "and",
        root: {
          "cases.case_id": {
            operator: "includes",
            field: "cases.case_id",
            operands: [`set_id:${response.data}`],
          },
        },
      };
      setNewCohortFilters(filters);
      setShowSaveCohort(true);
    }
  }, [response.isSuccess, coreDispatch, response.data]);

  const geneExpCallbacks: RxComponentCallbacks = {
    "postRender.gdcGeneExpression": () => setIsLoading(false),
    "error.gdcGeneExpression": () => setIsLoading(false),
  };

  const appCallbacks: RxComponentCallbacks = {
    "preDispatch.gdcPlotApp": () => {
      setIsLoading(true);
    },
    "error.gdcPlotApp": () => setIsLoading(false),
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
          geneExpCallbacks,
          appCallbacks,
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
    <div className="relative">
      {isDemoMode && <DemoText>Demo showing cases with Gliomas.</DemoText>}
      <div
        ref={divRef}
        style={{ margin: "2em" }}
        className="sjpp-wrapper-root-div"
        //userDetails={userDetails}
      />

      <SaveCohortModal // Show the modal, create a saved cohort when save button is clicked
        onClose={() => setShowSaveCohort(false)}
        opened={showSaveCohort}
        // opened={showSaveCohort && newCohortFilters} check if newCohortFilters is needed
        filters={newCohortFilters}
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
  app?: {
    callbacks?: RxComponentCallbacks;
  };
}

interface GeneExpressionArgHierCluster {
  allow2selectSamples?: SelectSamples;
  callbacks?: RxComponentCallbacks;
}

function getGeneExpressionTrack(
  props: PpProps,
  filter0: any,
  callback?: SelectSamplesCallback,
  geneExpCallbacks?: RxComponentCallbacks,
  appCallbacks?: RxComponentCallbacks,
) {
  const defaultFilter = null;

  const arg: GeneExpressionArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    launchGdcHierCluster: true,
    filter0: filter0 || defaultFilter,
    opts: {
      app: {
        callbacks: appCallbacks,
      },
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
        callbacks: geneExpCallbacks,
      },
    },
  };

  return arg;
}
