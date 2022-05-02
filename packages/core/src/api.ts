import {
  buildCreateApi,
  coreModule,
  reactHooksModule,
} from "@reduxjs/toolkit/dist/query/react";
import { useCoreSelector, useCoreStore, useCoreDispatch } from "./hooks";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const coreCreateApi = buildCreateApi(
  coreModule(),
  reactHooksModule({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useSelector: useCoreSelector,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useStore: useCoreStore,
    useDispatch: useCoreDispatch,
  }),
);
