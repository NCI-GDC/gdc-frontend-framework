import {
  buildCreateApi,
  coreModule,
  reactHooksModule,
} from "@reduxjs/toolkit/dist/query/react";
import { useCoreSelector, useCoreStore, useCoreDispatch } from "./hooks";

export const coreCreateApi = buildCreateApi(
  coreModule(),
  reactHooksModule({
    useSelector: useCoreSelector as any,
    useStore: useCoreStore as any,
    useDispatch: useCoreDispatch,
  }),
);
