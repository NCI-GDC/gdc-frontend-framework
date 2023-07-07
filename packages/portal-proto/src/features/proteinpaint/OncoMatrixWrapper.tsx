import { useEffect, useRef, useCallback, FC } from "react";
import { runproteinpaint } from "@sjcrh/proteinpaint-client";
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
} from "@gff/core";
import { isEqual } from "lodash";
import { DemoText } from "../shared/tailwindComponents";
import {
  SelectSamples,
  SelectSamplesCallBackArg,
  SelectSamplesCallback,
  getFilters,
} from "./sjpp-types";

const basepath = PROTEINPAINT_API;

interface PpProps {
  basepath?: string;
}

export const OncoMatrixWrapper: FC<PpProps> = (props: PpProps) => {
  const isDemoMode = useIsDemoApp();
  const defaultFilter = {
    op: "in",
    content: { field: "cases.disease_type", value: ["Gliomas"] },
  };
  const currentCohort = useCoreSelector(selectCurrentCohortFilters);
  const filter0 = isDemoMode
    ? defaultFilter
    : buildCohortGqlOperator(currentCohort);
  const userDetails = useUserDetails();
  const ppRef = useRef<PpApi>();
  const prevData = useRef<any>();
  const coreDispatch = useCoreDispatch();
  const callback = useCallback<SelectSamplesCallback>(
    (arg: SelectSamplesCallBackArg) => {
      const filters = getFilters(arg);
      coreDispatch(
        // TODO: option to edit a cohort using ImportCohortModal???
        addNewCohortWithFilterAndMessage({
          filters,
          message: "newCasesCohort",
          // TODO: improve cohort name constructor
          name: arg.source + ` (n=${arg.samples.length})`,
        }),
      );
    },
    [coreDispatch],
  );

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const data = { filter0, userDetails };
      if (isEqual(prevData.current, data)) return;

      prevData.current = data;

      const toolContainer = rootElem.parentNode.parentNode
        .parentNode as HTMLElement;
      toolContainer.style.backgroundColor = "#fff";

      if (ppRef.current) {
        ppRef.current.update({ filter0: prevData.current.filter0 });
      } else {
        const pp_holder = rootElem.querySelector(".sja_root_holder");
        if (pp_holder) pp_holder.remove();

        const data = getMatrixTrack(props, prevData.current.filter0, callback);
        if (!data) return;

        const arg = Object.assign(
          {
            holder: rootElem,
            noheader: true,
            nobox: true,
            hide_dsHandles: true,
          },
          data,
        ) as MatrixArg;

        runproteinpaint(arg).then((pp) => {
          ppRef.current = pp;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter0, userDetails],
  );

  const divRef = useRef();
  return (
    <div>
      {isDemoMode && <DemoText>Demo showing cases with Gliomas.</DemoText>}
      <div
        ref={divRef}
        style={{ margin: "2em" }}
        className="sjpp-wrapper-root-div"
        //userDetails={userDetails}
      />
    </div>
  );
};

interface PpApi {
  update(arg: any): null;
}

interface MatrixArg {
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  launchGdcMatrix: boolean;
  filter0: FilterSet;
  opts: MatrixArgOpts;
}

interface MatrixArgOpts {
  matrix: MatrixArgOptsMatrix;
}

interface MatrixArgOptsMatrix {
  allow2selectSamples?: SelectSamples;
}

function getMatrixTrack(
  props: PpProps,
  filter0: any,
  callback?: SelectSamplesCallback,
) {
  const defaultFilter = null;

  const arg: MatrixArg = {
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    launchGdcMatrix: true,
    filter0: filter0 || defaultFilter,
    opts: {
      matrix: {
        allow2selectSamples: {
          buttonText: "Create Cohort",
          attributes: ["case.case_id"],
          callback,
        },
      },
    },
  };

  return arg;
}
