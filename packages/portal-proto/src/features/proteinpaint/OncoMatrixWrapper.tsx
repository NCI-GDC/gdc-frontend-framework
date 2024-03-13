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

export const OncoMatrixWrapper: FC<PpProps> = (props: PpProps) => {
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
  const ppPromise = useRef<Promise<PpApi>>();
  const initialFilter0Ref = useRef<any>();
  const debouncedInitialUpdatesTimeout =
    useRef<ReturnType<typeof setTimeout>>();
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

  const showLoadingOverlay = () => setIsLoading(true);
  const hideLoadingOverlay = () => setIsLoading(false);
  const matrixCallbacks: RxComponentCallbacks = {
    "postRender.gdcOncoMatrix": hideLoadingOverlay,
    "error.gdcOncoMatrix": hideLoadingOverlay,
  };
  const appCallbacks: RxComponentCallbacks = {
    "preDispatch.gdcPlotApp": showLoadingOverlay,
    "error.gdcPlotApp": hideLoadingOverlay,
    "postRender.gdcPlotApp": hideLoadingOverlay,
  };

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      // debounce until one of these is true
      // otherwise, the userDetails.isFetching changing from false > true > false
      // could trigger unnecessary, wastefule PP-app state update
      if (userDetails?.isSuccess === false && userDetails?.isError === false)
        return;
      const data = { filter0, userData: userDetails?.data };
      // TODO: ignore the cohort filter changes in demo mode, or combine with demo filter ???
      // data.filter0 = defaultFilter
      if (isEqual(prevData.current, data)) return;

      if (ppRef.current) {
        if (!isEqual(data, prevData.current))
          ppRef.current.update({ filter0: data.filter0 });
      } else if (ppPromise.current) {
        // in case another state update comes in when there is already
        // an instance that is being created, debounce to the last update
        // Except: during startup in demo mode, the filter0 is not expecect to change,
        // so don't trigger a non-user reactive update right after the initial rendering
        if (debouncedInitialUpdatesTimeout.current)
          clearTimeout(debouncedInitialUpdatesTimeout.current);

        if (!isEqual(data, initialFilter0Ref.current)) {
          debouncedInitialUpdatesTimeout.current = setTimeout(() => {
            ppPromise.current.then(() => {
              // if the filter0 has not changed, the PP matrix app (the engine for gene expression app)
              // will not update unnecessarily
              if (ppRef.current) {
                if (!isEqual(data, initialFilter0Ref.current))
                  ppRef.current.update({ filter0: data.filter0 });
              } else console.error("missing ppRef.current");
            });
          }, 20);
        }
      } else {
        // TODO:
        // showing and hiding the overlay should be triggered by components that may take a while to load/render,
        // this wrapper code can show the overlay here since it has supplied postRender callbacks above,
        // but ideally it is the PP-app that triggers both the showing and hiding of the overlay for reliable behavior
        initialFilter0Ref.current = data;
        const toolContainer = rootElem.parentNode.parentNode
          .parentNode as HTMLElement;
        toolContainer.style.backgroundColor = "#fff";

        const pp_holder = rootElem.querySelector(".sja_root_holder");
        if (pp_holder) pp_holder.remove();

        const matrixArgs = getMatrixTrack(
          props,
          data.filter0,
          callback,
          matrixCallbacks,
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
          matrixArgs,
        ) as MatrixArg;

        ppPromise.current = runproteinpaint(arg).then((pp) => {
          // the ppRef.current is set after the tool fully renders
          ppRef.current = pp;
          return pp;
        });
      }

      prevData.current = data;
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
        opened={showSaveCohort}
        onClose={() => setShowSaveCohort(false)}
        filters={newCohortFilters}
      />

      <LoadingOverlay
        data-testid="loading-spinner"
        visible={isLoading}
        zIndex={0}
      />
    </div>
  );
};

interface PpApi {
  update(arg: any): null;
}

interface MatrixArg {
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  launchGdcMatrix: boolean;
  filter0: FilterSet;
  opts: MatrixArgOpts;
}

interface MatrixArgOpts {
  app: MatrixArgOptsApp;
  matrix: MatrixArgOptsMatrix;
}

interface MatrixArgOptsApp {
  callbacks?: RxComponentCallbacks;
}

interface MatrixArgOptsMatrix {
  allow2selectSamples?: SelectSamples;
  callbacks?: RxComponentCallbacks;
}

function getMatrixTrack(
  props: PpProps,
  filter0: any,
  callback?: SelectSamplesCallback,
  matrixCallbacks?: RxComponentCallbacks,
  appCallbacks?: RxComponentCallbacks,
) {
  const defaultFilter = null;

  const arg: MatrixArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    launchGdcMatrix: true,
    filter0: filter0 || defaultFilter,
    opts: {
      app: {
        callbacks: appCallbacks,
      },
      matrix: {
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
        callbacks: matrixCallbacks,
      },
    },
  };

  return arg;
}
