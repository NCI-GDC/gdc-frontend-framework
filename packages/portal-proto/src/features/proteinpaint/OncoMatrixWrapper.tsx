import { useEffect, useRef, FC } from "react";
import { runproteinpaint } from "@stjude/proteinpaint-client";
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
import { isEqual, cloneDeep } from "lodash";

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

  const coreDispatch = useCoreDispatch();
  const isRendered = useRef<boolean>(false);
  if (isDemoMode && !isRendered.current) {
    isRendered.current = true;
    const filters: FilterSet = {
      mode: "and",
      root: {
        "cases.disease_type": {
          operator: "includes",
          field: "cases.disease_type",
          operands: ["Gliomas"],
        },
      },
    };

    coreDispatch(
      // TODO: option to edit a cohort using ImportCohortModal???
      addNewCohortWithFilterAndMessage({
        filters,
        message: "demoOncoMatrixCasesCohort",
        // TODO: improve cohort name constructor
        name: `Cases with Gliomas`,
        makeCurrent: true,
      }),
    );
  }

  const userDetails = useUserDetails();
  // to track reusable instance for mds3 skewer track
  const ppRef = useRef<PpApi>();
  const prevArg = useRef<any>();

  useEffect(
    () => {
      const rootElem = divRef.current as HTMLElement;
      const data = getMatrixTrack(props, filter0);

      if (!data) return;
      if (isEqual(prevArg.current, data)) return;
      prevArg.current = data;

      const toolContainer = rootElem.parentNode.parentNode
        .parentNode as HTMLElement;
      toolContainer.style.backgroundColor = "#fff";

      const arg = Object.assign(
        { holder: rootElem, noheader: true, nobox: true, hide_dsHandles: true },
        cloneDeep(data),
      ) as MatrixArg;

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
    [filter0, props.userdetails, isDemoMode],
  );

  const divRef = useRef();
  return (
    <div>
      {isDemoMode && (
        <span className="font-heading italic px-2 py-4 mt-4">
          {"Demo showing cases with Gliomas."}
        </span>
      )}
      <div
        ref={divRef}
        style={{ margin: "2em" }}
        className="sjpp-wrapper-root-div"
        userdetails={userDetails}
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
}

function getMatrixTrack(props: PpProps, filter0: any) {
  // host in gdc is just a relative url path,
  // using the same domain as the GDC portal where PP is embedded
  const defaultFilter = {
    op: "and",
    content: [
      {
        op: "in",
        content: {
          field: "cases.primary_site",
          value: ["breast", "bronchus and lung"],
        },
      },
      {
        op: ">=",
        content: { field: "cases.diagnoses.age_at_diagnosis", value: 10000 },
      },
      {
        op: "<=",
        content: { field: "cases.diagnoses.age_at_diagnosis", value: 20000 },
      },
    ],
  };

  const arg: MatrixArg = {
    host: props.basepath || (basepath as string),
    launchGdcMatrix: true,
    filter0: filter0 || defaultFilter,
  };

  return arg;
}
