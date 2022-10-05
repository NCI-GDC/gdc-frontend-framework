import { useEffect, useRef, FC } from "react";
import { runproteinpaint } from "@stjude/proteinpaint-client";
import {
  useCoreSelector,
  selectCurrentCohortFilterSet,
  buildCohortGqlOperator,
  FilterSet,
  PROTEINPAINT_API,
} from "@gff/core";

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
    useCoreSelector(selectCurrentCohortFilterSet),
  );

  // to track reusable instance for mds3 skewer track
  /*** TODO: bam track should return reusable renderer???? ***/
  const ppRef = useRef<PpApi>();

  useEffect(() => {
    const data =
      props.track == "lolliplot"
        ? getLolliplotTrack(props, filter0)
        : props.track == "bam"
        ? getBamTrack(props, filter0)
        : null;

    if (!data) return;
    const rootElem = divRef.current as HTMLElement;
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
  }, [
    props.gene2canonicalisoform,
    props.mds3_ssm2canonicalisoform,
    props.geneSearch4GDCmds3,
    filter0,
  ]);

  const divRef = useRef();
  return <div ref={divRef} />;
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

function getLolliplotTrack(props: PpProps, filter0: any) {
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
