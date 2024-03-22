import { useEffect, useRef, useCallback, useState, FC } from "react";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  FilterSet,
  PROTEINPAINT_API,
  useFetchUserDetailsQuery,
  useCoreDispatch,
  buildCohortGqlOperator,
  useCreateCaseSetFromValuesMutation,
} from "@gff/core";
import { isEqual, cloneDeep } from "lodash";
import { DemoText } from "@/components/tailwindComponents";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";
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
  const isDemoMode = useIsDemoApp();
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode ? null : buildCohortGqlOperator(currentCohort);
  const userDetails = useFetchUserDetailsQuery();

  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>({});
  const coreDispatch = useCoreDispatch();
  const [showSaveCohort, setShowSaveCohort] = useState(false);
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
      {isDemoMode && (
        <DemoText>Demo showing MYC variants for all GDC.</DemoText>
      )}
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

function getLollipopTrack(
  props: PpProps,
  filter0: any,
  callback: SelectSamplesCallback,
) {
  const arg: Mds3Arg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
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
          attributes: [
            { from: "sample_id", to: "cases.case_id", convert: true },
          ],
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
