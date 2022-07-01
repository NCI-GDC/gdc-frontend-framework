import { useEffect, useRef } from "react";
import { runproteinpaint } from "@stjude/proteinpaint-client";
import { isEqual } from "lodash";

// !!! TODO: may determine basepath prop value at runtime !!!
const basepath = "https://proteinpaint.stjude.org"; // '/auth/api/custom/proteinpaint'

export function ProteinPaintWrapper(props) {
  let currentData;

  useEffect(() => {
    const data =
      props.track == "lolliplot"
        ? getLolliplotTrack(props)
        : props.track == "bam"
        ? getBamTrack(props)
        : null;

    if (!data) return;
    // do not cause unnecessary re-render if the track argument
    // is the same as the last render
    if (isEqual(data, currentData)) return;
    currentData = data;
    const rootElem = ref.current as HTMLElement;
    const pp_holder = rootElem.querySelector(".sja_root_holder");
    if (pp_holder) pp_holder.remove();

    const arg = Object.assign(
      { holder: rootElem, noheader: true, nobox: true },
      JSON.parse(JSON.stringify(data)),
    );
    runproteinpaint(arg);
  });

  const ref = useRef();
  return <div ref={ref} />;
}

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
}

interface mds3_isoform {
  ssm_id: string;
  dslabel: string;
}

function getLolliplotTrack(props) {
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
      },
    ],
  };

  if (props.geneId) {
    arg.gene2canonicalisoform = this.props.geneId;
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
  gdcbamslice: boolean;
}

function getBamTrack(props) {
  // host in gdc is just a relative url path,
  // using the same domain as the GDC portal where PP is embedded
  const arg: BamArg = {
    host: props.basepath || (basepath as string),
    gdcbamslice: true,
  };

  return arg;
}
