import { useRef, useCallback, useState, FC } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { bindProteinPaint } from "@sjcrh/proteinpaint-client";
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
import { DemoText } from "@/components/tailwindComponents";
import { LoadingOverlay } from "@mantine/core";
import {
  SelectSamples,
  SelectSamplesCallBackArg,
  SelectSamplesCallback,
  RxComponentCallbacks,
} from "./sjpp-types";
import { SaveCohortModal } from "@gff/portal-components";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import { isEqual, cloneDeep } from "lodash";
import { cohortActionsHooks } from "../cohortBuilder/CohortManager/cohortActionHooks";
import { INVALID_COHORT_NAMES } from "../cohortBuilder/utils";

const basepath = PROTEINPAINT_API;

interface PpProps {
  chartType: "matrix" | "hierCluster";
  basepath?: string;
}

export const demoFilter = Object.freeze({
  op: "in",
  content: Object.freeze({
    field: "cases.disease_type",
    value: Object.freeze(["Gliomas"]),
  }),
});

export const MatrixWrapper: FC<PpProps> = (props: PpProps) => {
  const isDemoMode = useIsDemoApp();
  // const demoFilter = {
  //   op: "in",
  //   content: { field: "cases.disease_type", value: ["Gliomas"] },
  // };
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode
    ? cloneDeep(demoFilter)
    : buildCohortGqlOperator(currentCohort);
  const userDetails = useFetchUserDetailsQuery();
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
    { skip: !customGeneSetParam?.length },
  );
  const {
    data: geneDetailData,
    isFetching: isGeneFetching,
    requestId: genesRequestId,
  } = genesResponse;

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
  const initArgs = getMatrixTrack(
    props,
    callback,
    matrixCallbacks,
    appCallbacks,
    genesetCallback,
  );

  useDeepCompareEffect(
    () => {
      // debounce until one of these is true
      // otherwise, the userDetails.isFetching changing from false > true > false
      // could trigger unnecessary, wastefule PP-app state update
      if (userDetails?.isSuccess === false && userDetails?.isError === false)
        return;
      if (isGeneFetching) return;
      const data = {
        filter0: filter0 || null,
        userData: userDetails?.data,
        geneDetailData,
      };
      const hasUpdates =
        (data || prevData.current) && !isEqual(prevData.current, data);
      if (hasUpdates) prevData.current = data;
      const rootElem = divRef.current as HTMLElement;

      let updateArgs;
      if (hasUpdates) {
        updateArgs = { filter0: data.filter0 };
        if (lastGeneSetRequestId != genesRequestId) {
          setLastGeneSetRequestId(genesRequestId);
          updateArgs.genes = geneDetailData.hits.map((h) => ({
            gene: h.symbol,
          }));
        }

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
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter0, userDetails, geneDetailData],
  );

  const divRef = useRef();

  const updateFilters = (field: string, operation: Operation) => {
    dispatch(hideModal());
    setCustomGeneSetParam((operation as Includes).operands);
  };
  const existingFiltersHook = () => null;
  return (
    <div className="relative">
      {isDemoMode && <DemoText>Demo showing cases with Gliomas.</DemoText>}
      <div
        ref={divRef}
        className="sjpp-wrapper-root-div"
        //userDetails={userDetails}
      />

      <SaveCohortModal // Show the modal, create a saved cohort when save button is clicked
        opened={showSaveCohortModal}
        onClose={() => setShowSaveCohortModal(false)}
        filters={newCohortFilters}
        hooks={cohortActionsHooks}
        invalidCohortNames={INVALID_COHORT_NAMES}
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

interface MatrixArg {
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  launchGdcMatrix: boolean;
  launchGdcHierCluster: boolean;
  filter0?: any; //FilterSet;
  opts: MatrixArgOpts;
  state?: any;
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
  callback?: SelectSamplesCallback,
  matrixCallbacks?: RxComponentCallbacks,
  appCallbacks?: RxComponentCallbacks,
  genesetCallback?: () => void,
): MatrixArg {
  const arg: MatrixArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    launchGdcMatrix: props.chartType == "matrix",
    launchGdcHierCluster: props.chartType == "hierCluster",
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
