import {
  buildCreateApi,
  coreModule,
  reactHooksModule,
  CreateApi,
  ApiModules,
} from "@reduxjs/toolkit/query/react";
import { useCoreSelector, useCoreStore, useCoreDispatch } from "./hooks";

const coreCreateApi: CreateApi<keyof ApiModules<any, any, any, any>> =
  buildCreateApi(
    coreModule(),
    reactHooksModule({
      useSelector: useCoreSelector as any,
      useStore: useCoreStore as any,
      useDispatch: useCoreDispatch,
    }),
  );

export { coreCreateApi };
