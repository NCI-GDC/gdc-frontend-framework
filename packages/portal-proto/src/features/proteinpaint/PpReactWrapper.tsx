import React from "react";
import { findDOMNode } from "react-dom";
import { runproteinpaint } from "@stjude/proteinpaint-client";

// !!! TODO: may determine basepath prop value at runtime !!!
const basepath: string = "https://proteinpaint.stjude.org"; // '/auth/api/custom/proteinpaint'

class PpReact extends React.Component<any, any> {
  currentData: object;

  constructor(props) {
    super(props);
    this.state = {};
    this.currentData = {};
  }
  componentDidMount() {
    this.runpp();
  }
  componentDidUpdate() {
    this.runpp();
  }
  render() {
    return <div />;
  }
  runpp() {
    const data = this.getTrack();
    // do not cause unnecessary re-render if the track argument
    // is the same as the last render
    if (deepEqual(data, this.currentData)) return;
    this.currentData = data;
    const rootElem = findDOMNode(this) as HTMLElement;
    const pp_holder = rootElem.querySelector(".sja_root_holder");
    if (pp_holder) pp_holder.remove();

    const arg = Object.assign(
      { holder: rootElem, noheader: true, nobox: true },
      JSON.parse(JSON.stringify(data)),
    );
    runproteinpaint(arg);
  }
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

export class PpLolliplot extends PpReact<any, any> {
  getTrack() {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    const arg: Mds3Arg = {
      host: this.props.basepath || (basepath as string),
      genome: "hg38", // hardcoded for gdc
      //gene: data.gene,
      tracks: [
        {
          type: "mds3",
          dslabel: "GDC",
        },
      ],
    };

    if (this.props.geneId) {
      arg.gene2canonicalisoform = this.props.geneId;
    } else if (this.props.ssm_id) {
      arg.mds3_ssm2canonicalisoform = {
        dslabel: "GDC",
        ssm_id: this.props.ssm_id,
      };
    } else {
      arg.geneSearch4GDCmds3 = true;
    }

    return arg;
  }
}

interface BamArg {
  host: string;
  gdcbamslice: boolean;
}

export class PpBam extends PpReact<any, any> {
  getTrack() {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    const arg: BamArg = {
      host: this.props.basepath || (basepath as string),
      gdcbamslice: true,
    };

    return arg;
  }
}

function deepEqual(x, y) {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) {
      return false;
    }

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else {
        return false;
      }
    }
    return true;
  } else return false;
}
