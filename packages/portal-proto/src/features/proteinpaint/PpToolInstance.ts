import { runproteinpaint } from "@sjcrh/proteinpaint-client";
import { isEqual } from "lodash";

export interface PpApi {
  update(arg: any): null;
  staleInstance?: boolean;
  getState?: () => any;
}

export function usePpToolInstance({
  rootElem,
  data,
  prevData,
  ppRef,
  ppPromise,
  debouncedInitialUpdatesTimeout,
  initialFilter0Ref,
  getInitArgs,
  getUpdateArgs,
}) {
  // A PP tool instance may become stale due to new data and/or code version release, and
  // in case a user browser session remained open to an outdated tool view while a new version was published.
  // In dev, tool instance staleness may be triggered by a bundler's hot-module-replacement (works with nextjs + webpack).
  // In prod, this may be detected from data a response header or payload property (TODO).
  if (!ppRef.current?.staleInstance && isEqual(prevData.current, data)) return;

  if (ppRef.current && !ppRef.current?.staleInstance) {
    if (!isEqual(data, prevData.current)) {
      ppRef.current.update(getUpdateArgs());
    }
  } else if (
    ppPromise.current &&
    !ppPromise.current?.staleInstance &&
    !ppRef.current?.staleInstance
  ) {
    // in case another state update comes in when there is already
    // an instance that is being created, debounce to the last update
    // Except: during startup in demo mode, the filter0 is not expected to change,
    // so don't trigger a non-user reactive update right after the initial rendering
    if (debouncedInitialUpdatesTimeout.current)
      clearTimeout(debouncedInitialUpdatesTimeout.current);

    if (!isEqual(data, initialFilter0Ref.current)) {
      debouncedInitialUpdatesTimeout.current = setTimeout(() => {
        ppPromise.current.then(() => {
          // if the filter0 has not changed, the PP matrix app (the engine for gene expression app)
          // will not update unnecessarily
          if (ppRef.current) {
            if (!isEqual(data, initialFilter0Ref.current))
              ppRef.current.update({ filter0: data.filter0 });
          } else console.error("missing ppRef.current");
        });
      }, 20);
    }
  } else {
    // TODO:
    // showing and hiding the overlay should be triggered by components that may take a while to load/render,
    // this wrapper code can show the overlay here since it has supplied postRender callbacks above,
    // but ideally it is the PP-app that triggers both the showing and hiding of the overlay for reliable behavior
    // initialFilter0Ref.current = data;
    const toolContainer = rootElem.parentNode.parentNode
      .parentNode as HTMLElement;
    toolContainer.style.backgroundColor = "#fff";

    const pp_holder = rootElem.querySelector(".sja_root_holder");
    if (pp_holder) pp_holder.remove();

    const arg = Object.assign(
      {
        holder: rootElem,
        noheader: true,
        nobox: true,
        hide_dsHandles: true,
      },
      getInitArgs(),
    );

    // reapply previously rendered state when a stale instance is replaced
    if (ppRef.current?.getState) arg.state = ppRef.current.getState();

    ppPromise.current = runproteinpaint(arg).then((pp) => {
      // the ppRef.current is set after the tool fully renders
      ppRef.current = pp;
      return pp;
    });

    prevData.current = data;
  }
}
