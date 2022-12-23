import { useEffect, useRef, useState, FC } from "react";
import { runproteinpaint } from "@stjude/proteinpaint-client";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  FilterSet,
  PROTEINPAINT_API,
  useUserDetails,
} from "@gff/core";
import { isEqual } from "lodash";

const basepath = PROTEINPAINT_API;

interface PpProps {
  track: string;
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
  const [alertDisplay, setAlertDisplay] = useState("none");
  const [rootDisplay, setRootDisplay] = useState("none");

  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>();

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const isAuthorized = props.track != "bam" || userDetails.username;
      setAlertDisplay(isAuthorized ? "none" : "block");
      setRootDisplay(isAuthorized ? "block" : "none");
      if (!isAuthorized) return;

      const data =
        props.track == "lollipop"
          ? getLollipopTrack(props, filter0)
          : props.track == "bam" && userDetails?.username
          ? getBamTrack(props, filter0)
          : props.track == "matrix"
          ? getMatrixTrack(props, filter0)
          : null;

      if (!data) return;
      if (isEqual(prevArg.current, data)) return;
      prevArg.current = data;

      const toolContainer = rootElem.parentNode.parentNode
        .parentNode as HTMLElement;
      toolContainer.style.backgroundColor = "#fff";

      const arg = Object.assign(
        { holder: rootElem, noheader: true, nobox: true, hide_dsHandles: true },
        JSON.parse(JSON.stringify(data)),
      ) as PpArg;

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

  const alertRef = useRef();
  const divRef = useRef();
  return (
    <div>
      <div
        ref={alertRef}
        style={{ margin: "32px", display: `${alertDisplay}` }}
        className="sjpp-wrapper-alert-div"
      >
        <b>Access alert</b>
        <hr />
        <p>Please login to access the Sequence Read visualization tool.</p>
      </div>
      <div
        ref={divRef}
        style={{ margin: "32px", display: `${rootDisplay}` }}
        className="sjpp-wrapper-root-div"
      ></div>
    </div>
  );
};

interface Mds3Arg {
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
}

interface mds3_isoform {
  ssm_id: string;
  dslabel: string;
}

interface PpArg extends Mds3Arg, BamArg {}

interface PpApi {
  update(arg: any): null;
}

function getLollipopTrack(props: PpProps, filter0: any) {
  // host in gdc is just a relative url path,
  // using the same domain as the GDC portal where PP is embedded
  const arg: Mds3Arg = {
    host: props.basepath || (basepath as string),
    genome: "hg38", // hardcoded for gdc
    //gene: data.gene,
    tracks: [
      {
        type: "mds3",
        dslabel: "GDC",
        filter0,
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

interface BamArg {
  host: string;
  gdcbamslice: GdcBamSlice;
  filter0: FilterSet;
}

type GdcBamSlice = {
  hideTokenInput: boolean;
};

function getBamTrack(props: PpProps, filter0: any) {
  // host in gdc is just a relative url path,
  // using the same domain as the GDC portal where PP is embedded
  const arg: BamArg = {
    host: props.basepath || (basepath as string),
    gdcbamslice: {
      hideTokenInput: true,
    },
    filter0,
  };

  return arg;
}

interface MatrixArg {
  host: string;
  launchGdcMatrix: boolean;
  filter0: FilterSet;
}

function getMatrixTrack(props: PpProps, filter0: any) {
  // host in gdc is just a relative url path,
  // using the same domain as the GDC portal where PP is embedded
  const arg: MatrixArg = {
    host: props.basepath || (basepath as string),
    launchGdcMatrix: true,
    filter0,
  };

  return arg;
}
