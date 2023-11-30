import { useEffect, useRef, useState, FC } from "react";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
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
}

export const BamDownloadWrapper: FC<PpProps> = (props: PpProps) => {
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
      const isAuthorized = userDetails.username && true;
      setAlertDisplay(isAuthorized ? "none" : "block");
      setRootDisplay(isAuthorized ? "block" : "none");
      if (!isAuthorized) return;

      const data = userDetails?.username ? getBamTrack(props, filter0) : null;

      if (!data) return;
      if (isEqual(prevArg.current, data)) return;
      prevArg.current = data;

      const toolContainer = rootElem.parentNode.parentNode
        .parentNode as HTMLElement;
      toolContainer.style.backgroundColor = "#fff";

      const arg = Object.assign(
        { holder: rootElem, noheader: true, nobox: true, hide_dsHandles: true },
        cloneDeep(data),
      ) as BamArg;

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
    [filter0, userDetails],
  );

  const alertRef = useRef();
  const divRef = useRef();
  return (
    <div>
      <div
        ref={alertRef}
        style={{ margin: "2em", display: `${alertDisplay}` }}
        className="sjpp-wrapper-alert-div"
      >
        <b>Access alert</b>
        <hr />
        <p>Please login to access the Sequence Read visualization tool.</p>
      </div>
      <div
        ref={divRef}
        style={{ margin: "2em", display: `${rootDisplay}` }}
        className="sjpp-wrapper-root-div"
      ></div>
    </div>
  );
};

interface PpApi {
  update(arg: any): null;
}

interface BamArg {
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  gdcbamslice: GdcBamSlice;
  filter0: FilterSet;
  stream2download?: boolean;
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
