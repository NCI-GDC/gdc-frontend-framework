import {
  buildCreateApi,
  coreModule,
  reactHooksModule,
  CreateApi,
  ApiModules,
  type Module,
  type ResultDescription,
} from "@reduxjs/toolkit/query/react";
import type { UnknownAction } from "@reduxjs/toolkit";
import { useCoreSelector, useCoreStore, useCoreDispatch } from "./hooks";

const USER_AUTH_TAG = "UserAuth";

export const userAuthTagInvalidators: (() => UnknownAction)[] = [];

const withUserAuthTag =
  (
    providesTags?: ResultDescription<any, any, any, any, any>,
  ): ResultDescription<any, any, any, any, any> =>
  (...args) => [
    ...(typeof providesTags === "function"
      ? providesTags(...args)
      : (providesTags ?? [])),
    USER_AUTH_TAG,
  ];

const userAuthTagModule = (): Module<any> => ({
  name: Symbol(),
  init(api) {
    const taggedApi = api.enhanceEndpoints({ addTagTypes: [USER_AUTH_TAG] });
    userAuthTagInvalidators.push(() =>
      taggedApi.util.invalidateTags([USER_AUTH_TAG]),
    );
    return {
      injectEndpoint(_endpointName, definition) {
        if (definition.type !== "mutation") {
          definition.providesTags = withUserAuthTag(definition.providesTags);
        }
      },
    };
  },
});

const coreHooks = {
  useSelector: useCoreSelector,
  useStore: useCoreStore,
  useDispatch: useCoreDispatch,
};

const coreCreateApi: CreateApi<keyof ApiModules<any, any, any, any>> =
  buildCreateApi(
    coreModule(),
    reactHooksModule({ hooks: coreHooks }),
    userAuthTagModule(),
  );

// for the API that detects user changes, so a user change doesn't refetch it
const coreCreateApiWithoutUserAuthTag: CreateApi<
  keyof ApiModules<any, any, any, any>
> = buildCreateApi(coreModule(), reactHooksModule({ hooks: coreHooks }));

export { coreCreateApi, coreCreateApiWithoutUserAuthTag };
