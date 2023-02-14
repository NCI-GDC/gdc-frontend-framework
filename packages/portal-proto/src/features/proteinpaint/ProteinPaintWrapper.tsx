import { useEffect, useRef, FC } from "react";
import { runproteinpaint } from "@stjude/proteinpaint-client";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  FilterSet,
  PROTEINPAINT_API,
  useUserDetails,
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
  const filter0 = buildCohortGqlOperator(
    useCoreSelector(selectCurrentCohortFilters),
  );
  const { data: userDetails } = useUserDetails();
  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>();

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const data = getLollipopTrack(props, filter0);

      if (!data) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      props.gene2canonicalisoform,
      props.mds3_ssm2canonicalisoform,
      props.geneSearch4GDCmds3,
      filter0,
      userDetails,
    ],
  );

  const divRef = useRef();
  return (
    <div>
      <div
        ref={divRef}
        style={{ margin: "32px" }}
        className="sjpp-wrapper-root-div"
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

interface SelectSamples {
  buttonText: string;
  attributes: string[];
  callback(samples: string[]): void;
}

function selectSamplesCallBack(samples: string[]) {
  /*** TODO: create a new cohort using the case set id list (samples) ***/
  console.log("selected", samples);
}

function getLollipopTrack(props: PpProps, filter0: any) {
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
          buttonText: "Select samples",
          attributes: ["sample_id"],
          callback: selectSamplesCallBack,
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
