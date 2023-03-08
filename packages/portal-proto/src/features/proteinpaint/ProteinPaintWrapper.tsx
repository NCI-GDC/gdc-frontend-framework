import { useEffect, useRef, FC } from "react";
import { runproteinpaint } from "@stjude/proteinpaint-client";
import { v4 as uuidv4 } from "uuid";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  FilterSet,
  PROTEINPAINT_API,
  useUserDetails,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
  DEFAULT_COHORT_ID,
  setActiveCohort,
} from "@gff/core";
import { isEqual, cloneDeep } from "lodash";

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
  const isDemoMode = useIsDemoApp();
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode ? null : buildCohortGqlOperator(currentCohort);
  const { data: userDetails } = useUserDetails();
  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>();

  const coreDispatch = useCoreDispatch();

  const callback = function (arg: SelectSamplesCallBackArg): void {
    const { samples, source } = arg;
    const ids = samples.map((d) => d["case.case_id"]).filter((d) => d && true);
    const filters: FilterSet = {
      mode: "and",
      root: {
        "occurrence.case.case_id": {
          operator: "includes",
          field: "occurrence.case.case_id",
          operands: ids,
        },
      },
    };
    coreDispatch(
      // TODO: option to edit a cohort using ImportCohortModal???
      addNewCohortWithFilterAndMessage({
        filters: filters,
        message: "newCasesCohort",
        // TODO: improve cohort name constructor
        name: source + ` (n=${samples.length})`,
        group:
          ids.length > 1
            ? {
                ids: [...ids],
                field: "occurrence.case.case_id",
                groupId: uuidv4(),
              }
            : undefined,
      }),
    );
  };

  const isRendered = useRef<boolean>(false);
  if (isDemoMode && !isRendered.current) {
    isRendered.current = true;
    coreDispatch(setActiveCohort(DEFAULT_COHORT_ID));
  }

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const data = getLollipopTrack(props, filter0, callback);
      if (!data) return;
      if (isDemoMode) data.geneSymbol = "MYC";
      // compare the argument to runpp to avoid unnecessary render
      if (isEqual(prevArg.current, data)) return;
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
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      props.gene2canonicalisoform,
      props.mds3_ssm2canonicalisoform,
      props.geneSearch4GDCmds3,
      isDemoMode,
      filter0,
      props.userDetails,
    ],
  );

  const divRef = useRef();
  return (
    <div>
      {isDemoMode && (
        <span className="font-heading italic px-2 py-4 mt-4">
          {"Demo showing MYC variants for all GDC."}
        </span>
      )}
      <div
        ref={divRef}
        style={{ margin: "2em" }}
        className="sjpp-wrapper-root-div"
        userDetails={userDetails}
      />
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

type SampleData = {
  "case.case_id"?: string;
};

interface SelectSamplesCallBackArg {
  samples: SampleData[];
  source: string;
}

type SelectSamplesCallback = (samples: SelectSamplesCallBackArg) => void;

interface SelectSamples {
  buttonText: string;
  attributes: string[];
  callback: SelectSamplesCallback;
}

function getLollipopTrack(
  props: PpProps,
  filter0: any,
  callback: SelectSamplesCallback,
) {
  // host in gdc is just a relative url path,
  // using the same domain as the GDC portal where PP is embedded
  const arg: Mds3Arg = {
    host: props.basepath || (basepath as string),
    genome: "hg38", // hardcoded for gdc
    tracks: [
      {
        type: "mds3",
        dslabel: "GDC",
        filter0,
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
