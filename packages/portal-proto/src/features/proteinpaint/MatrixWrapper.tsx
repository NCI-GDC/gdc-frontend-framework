import { useRef, useCallback, useState, FC } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  FilterSet,
  PROTEINPAINT_API,
  useFetchUserDetailsQuery,
  useCoreDispatch,
  useCreateCaseSetFromValuesMutation,
  useGetGenesQuery,
  Operation,
  Includes,
  showModal,
  hideModal,
  Modals,
  selectCurrentModal,
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
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";

const basepath = PROTEINPAINT_API;

interface PpProps {
  chartType: "matrix" | "hierCluster";
  basepath?: string;
}

export const MatrixWrapper: FC<PpProps> = (props: PpProps) => {
  const isDemoMode = useIsDemoApp();
  const defaultFilter = {
    op: "in",
    content: { field: "cases.disease_type", value: ["Gliomas"] },
  };
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode
    ? defaultFilter
    : buildCohortGqlOperator(currentCohort);
  const userDetails = useFetchUserDetailsQuery();

  const ppRef = useRef<PpApi>();
  const ppPromise = useRef<Promise<PpApi>>();
  const initialFilter0Ref = useRef<any>();
  const debouncedInitialUpdatesTimeout =
    useRef<ReturnType<typeof setTimeout>>();
  const prevData = useRef<any>();
  const coreDispatch = useCoreDispatch();
  const [showSaveCohortModal, setShowSaveCohortModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createSet, response] = useCreateCaseSetFromValuesMutation();
  const [newCohortFilters, setNewCohortFilters] =
    useState<FilterSet>(undefined);
  const [customGeneSetParam, setCustomGeneSetParam] = useState(null);
  const [lastGeneSetRequestId, setLastGeneSetRequestId] = useState(undefined);

  const dispatch = useCoreDispatch();
  const modal = useCoreSelector((state) => selectCurrentModal(state));

  const callback = useCallback<SelectSamplesCallback>(
    (arg: SelectSamplesCallBackArg) => {
      const cases = arg.samples.map((d) => d["cases.case_id"]);
      if (cases.length > 1) {
        createSet({ values: cases, intent: "portal", set_type: "frozen" });
      } else {
        setNewCohortFilters({
          mode: "and",
          root: {
            "cases.case_id": {
              operator: "includes",
              field: "cases.case_id",
              operands: cases,
            },
          },
        });
        setShowSaveCohortModal(true);
      }
    },
    [createSet],
  );

  // a set for the new cohort is created, now show the save cohort modal
  useDeepCompareEffect(() => {
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
      setShowSaveCohortModal(true);
    }
  }, [response.isSuccess, coreDispatch, response.data]);

  const genesResponse = useGetGenesQuery(
    {
      request: {
        filters: {
          op: "in",
          content: {
            field: "genes.gene_id",
            value: customGeneSetParam,
          },
        },
        fields: ["gene_id", "symbol"],
        size: 1000,
        //from: currentPage * PAGE_SIZE,
        //sortBy,
      },
      fetchAll: false,
    },
    { skip: !customGeneSetParam },
  );
  const {
    data: geneDetailData,
    isFetching: isGeneFetching,
    requestId: genesRequestId,
  } = genesResponse;
  //console.log(130, 'geneDetailData', geneDetailData, 'isGeneSuccess', isGeneSuccess, genesResponse);

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
  const genesetCallback = (/*{callback}*/) => {
    dispatch(showModal({ modal: Modals.LocalGeneSetModal }));
    // TODO: pass the gene set to the callback
  };

  useDeepCompareEffect(
    () => {
      // debounce until one of these is true
      // otherwise, the userDetails.isFetching changing from false > true > false
      // could trigger unnecessary, wastefule PP-app state update
      if (userDetails?.isSuccess === false && userDetails?.isError === false)
        return;
      if (isGeneFetching) return;

      const rootElem = divRef.current as HTMLElement;
      const data = { filter0, userData: userDetails?.data, geneDetailData };
      // TODO: ignore the cohort filter changes in demo mode, or combine with demo filter ???
      // data.filter0 = defaultFilter
      if (isEqual(prevData.current, data)) return;

      if (ppRef.current) {
        if (!isEqual(data, prevData.current)) {
          if (lastGeneSetRequestId != genesRequestId) {
            setLastGeneSetRequestId(genesRequestId);
            ppRef.current.update({
              genes: geneDetailData.hits.map((h) => ({ gene: h.symbol })),
            });
          } else {
            ppRef.current.update({ filter0: data.filter0 });
          }
        }
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
          genesetCallback,
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
    [filter0, userDetails, geneDetailData],
  );

  const divRef = useRef();

  const updateFilters = (field: string, operation: Operation) => {
    dispatch(hideModal());
    setCustomGeneSetParam((operation as Includes).operands[0]);
  };
  const existingFiltersHook = () => null;
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
        opened={showSaveCohortModal}
        onClose={() => setShowSaveCohortModal(false)}
        filters={newCohortFilters}
      />

      <GeneSetModal
        opened={modal === Modals.LocalGeneSetModal}
        modalTitle="Use a previously saved gene set"
        inputInstructions="Enter one or more gene identifiers in the field below or upload a file to create a gene set."
        selectSetInstructions="Select one or more sets below to use as an OncoMatrix gene set."
        updateFilters={updateFilters}
        existingFiltersHook={existingFiltersHook}
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
  launchGdcHierCluster: boolean;
  filter0: FilterSet;
  opts: MatrixArgOpts;
}

interface MatrixArgOpts {
  app: MatrixArgOptsApp;
  matrix?: MatrixArgOptsMatrix;
  hierCluster?: MatrixArgOptsMatrix;
}

interface MatrixArgOptsApp {
  callbacks?: RxComponentCallbacks;
}

interface MatrixArgOptsMatrix {
  allow2selectSamples?: SelectSamples;
  callbacks?: RxComponentCallbacks;
  customInputs?: {
    geneset?: {
      label: string;
      showInput: () => void;
    }[];
  };
}

function getMatrixTrack(
  props: PpProps,
  filter0: any,
  callback?: SelectSamplesCallback,
  matrixCallbacks?: RxComponentCallbacks,
  appCallbacks?: RxComponentCallbacks,
  genesetCallback?: () => void,
) {
  const defaultFilter = null;
  const arg: MatrixArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    launchGdcMatrix: props.chartType == "matrix",
    launchGdcHierCluster: props.chartType == "hierCluster",
    filter0: filter0 || defaultFilter,
    opts: {
      app: {
        callbacks: appCallbacks,
      },
      [props.chartType]: {
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
        customInputs: {
          geneset: [
            {
              label: "Load Gene Sets",
              showInput: genesetCallback,
            },
          ],
        },
      },
    },
  };

  return arg;
}
