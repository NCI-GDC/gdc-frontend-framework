import { useEffect, useRef, useCallback, FC } from "react";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  FilterSet,
  PROTEINPAINT_API,
  useUserDetails,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
  buildCohortGqlOperator,
  // TODO: uncomment when multibutton once supported in pp-client >2.14.1
  // selectCurrentCohortId,
  // selectCurrentCohortName,
  // useUpdateCohortMutation,
  // setCohortMessage
} from "@gff/core";
//import { GenericCohortModal } from "../cohortBuilder/Modals/GenericCohortModal";
import { isEqual, cloneDeep } from "lodash";
import { DemoText } from "../shared/tailwindComponents";
//import { LoadingOverlay } from "@mantine/core";
import {
  SelectSamples,
  SelectSamplesCallBackArg,
  SelectSamplesCallback,
} from "./sjpp-types";

const basepath = PROTEINPAINT_API;

interface PpProps {
  basepath?: string;
  geneId?: string;
  gene2canonicalisoform?: string;
  ssm_id?: string;
  mds3_ssm2canonicalisoform?: mds3_isoform;
  geneSearch4GDCmds3?: boolean;
}

export const ProteinPaintWrapper: FC<PpProps> = (props: PpProps) => {
  // TODO: uncomment when multibutton once supported in pp-client >2.14.1
  //const [showUpdateCohort, setShowUpdateCohort] = useState(false);
  const isDemoMode = useIsDemoApp();
  //const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));
  //const cohortName = useCoreSelector((state) => selectCurrentCohortName(state));
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode ? null : buildCohortGqlOperator(currentCohort);
  //const [updateCohort, { isLoading: isUpdateCohortLoading }] = useUpdateCohortMutation();
  const { data: userDetails } = useUserDetails();
  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>({});
  const filtersRef = useRef<FilterSet>(null);

  // useCoreDispatch() hook has to be called within a function component
  // so, cannot extract outside of this wrapper component???
  const coreDispatch = useCoreDispatch();
  const callback = useCallback<SelectSamplesCallback>(
    function (arg: SelectSamplesCallBackArg): void {
      const { samples, source } = arg;
      const ids = samples
        .map((d) => d["case.case_id"])
        .filter((d) => d && true);
      filtersRef.current = {
        mode: "and",
        root: {
          "occurrence.case.case_id": {
            operator: "includes",
            field: "occurrence.case.case_id",
            operands: ids,
          },
        },
      };

      // TODO: uncomment when multibutton once supported in pp-client >2.14.1
      // if (button.buttonText === updateBtnText) {
      //   setShowUpdateCohort(true)
      // } else {
      coreDispatch(
        // TODO: option to edit a cohort using ImportCohortModal???
        addNewCohortWithFilterAndMessage({
          filters: filtersRef.current,
          message: "newCasesCohort",
          // TODO: improve cohort name constructor
          name: source + ` (n=${samples.length})`,
        }),
      );
      //}
    },
    [coreDispatch],
  );

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const data = getLollipopTrack(props, filter0, callback);
      if (!data) return;
      if (isDemoMode) data.geneSymbol = "MYC";
      // compare the argument to runpp to avoid unnecessary render
      if ((data || prevArg.current) && isEqual(prevArg.current, data)) return;
      prevArg.current = data;

      const toolContainer = rootElem.parentNode.parentNode
        .parentNode as HTMLElement;
      toolContainer.style.backgroundColor = "#fff";

      const arg = Object.assign(
        { holder: rootElem, noheader: true, nobox: true, hide_dsHandles: true },
        cloneDeep(data),
      ) as Mds3Arg;

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
    [
      props.gene2canonicalisoform,
      props.mds3_ssm2canonicalisoform,
      props.geneSearch4GDCmds3,
      isDemoMode,
      filter0,
      userDetails,
    ],
  );

  const divRef = useRef();
  return (
    <div>
      {/*isUpdateCohortLoading && <LoadingOverlay visible />*/}
      {isDemoMode && (
        <DemoText>Demo showing MYC variants for all GDC.</DemoText>
      )}
      <div
        ref={divRef}
        style={{ margin: "2em" }}
        className="sjpp-wrapper-root-div"
        //userDetails={userDetails}
      />
      {/* // TODO: uncomment when multibutton once supported in pp-client >2.14.1
        showUpdateCohort && (
        <GenericCohortModal
          title="Save Cohort"
          opened
          onClose={() => setShowUpdateCohort(false)}
          actionText="Save"
          mainText={
            <>
              Are you sure you want to save <b>{cohortName}</b>? This will
              overwrite your previously saved changes.
            </>
          }
          subText={<>You cannot undo this action.</>}
          onActionClick={async () => {
            setShowUpdateCohort(false);
            const filters = Object.keys(filtersRef.current.root).length > 0
              ? buildCohortGqlOperator(filtersRef.current)
              : {}; console.log(156, {filters, current: filtersRef.current})

            const updateBody = {
              id: cohortId,
              name: cohortName,
              type: "static",
              filters
            };

            await updateCohort(updateBody)
              .unwrap()
              .then(() =>
                coreDispatch(
                  setCohortMessage(`savedCohort|${cohortName}|${cohortId}`),
                ),
              )
              .catch(() =>
                coreDispatch(setCohortMessage("error|saving|allId")),
              );
          }}
        />
      )*/}
    </div>
  );
};

interface Mds3Arg {
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  genome: string;
  gene2canonicalisoform?: string;
  mds3_ssm2canonicalisoform?: mds3_isoform;
  geneSearch4GDCmds3?: boolean;
  geneSymbol?: string;
  tracks: Track[];
}

interface Track {
  type: string;
  dslabel: string;
  filter0: FilterSet;
  allow2selectSamples?: SelectSamples;
}

interface mds3_isoform {
  ssm_id: string;
  dslabel: string;
}

interface PpApi {
  update(arg: any): null;
}

//const updateBtnText = 'Update Cohort';

function getLollipopTrack(
  props: PpProps,
  filter0: any,
  callback: SelectSamplesCallback,
) {
  // host in gdc is just a relative url path,
  // using the same domain as the GDC portal where PP is embedded
  /*const buttons = [{
    buttonText: "Create Cohort",
    attributes: ["case.case_id"],
    callback
  }]

  if (filter0) {
    buttons.unshift({
      buttonText: updateBtnText,
      attributes: ["case.case_id"],
      callback
    })
  }*/

  const arg: Mds3Arg = {
    host: props.basepath || (basepath as string),
    genome: "hg38", // hardcoded for gdc
    tracks: [
      {
        type: "mds3",
        dslabel: "GDC",
        filter0,
        // allow2selectSamples: { buttons },
        allow2selectSamples: {
          buttonText: "Create Cohort",
          attributes: ["case.case_id"],
          callback,
        },
      },
    ],
  };

  if (props.geneId) {
    arg.gene2canonicalisoform = props.geneId;
  } else if (props.ssm_id) {
    arg.mds3_ssm2canonicalisoform = {
      dslabel: "GDC",
      ssm_id: props.ssm_id,
    };
  } else {
    arg.geneSearch4GDCmds3 = true;
  }

  return arg;
}
