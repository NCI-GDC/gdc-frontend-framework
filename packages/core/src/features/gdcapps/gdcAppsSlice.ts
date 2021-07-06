import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ComponentType } from "react";
import { CoreState } from "../../store";
import { lookupGdcApp, registerGdcApp } from "./gdcAppRegistry";

export interface GdcAppsState {
  readonly gdcApps: Readonly<Record<string, GdcAppMetadata>>;
  readonly currentAppId?: string;
}

export interface GdcAppMetadata {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly requiredEntityTypes: ReadonlyArray<EntityType>;
}

export interface GdcAppWithMetadata extends GdcAppMetadata {
  readonly GdcApp: ComponentType;
}

export type EntityType = "case" | "gene" | "ssm" | "cnv" | "file";

const initialState: GdcAppsState = {
  gdcApps: {},
};

const slice = createSlice({
  name: "gdcapps",
  initialState,
  reducers: {
    addGdcApp: (state, action: PayloadAction<GdcAppWithMetadata>) => {
      const { id, GdcApp } = action.payload;
      const metadata: Pick<GdcAppWithMetadata, keyof GdcAppMetadata> =
        action.payload;

      state.gdcApps[id] = {
        ...metadata,
        // need to turn a ReadonlyArray into a mutable array for immer's WritableDraft
        requiredEntityTypes: [...metadata.requiredEntityTypes],
      };
      registerGdcApp(id, GdcApp);
    },
  },
});

export const gdcAppReducer = slice.reducer;

export const { addGdcApp } = slice.actions;

export const selectGdcAppIds = (state: CoreState) =>
  Object.keys(state.gdcApps.gdcApps);

export const selectAllGdcAppMetadata = (state: CoreState) => Object.values(state.gdcApps.gdcApps);

export const selectGdcAppMetadataById = (state: CoreState, appId: string) => state.gdcApps.gdcApps[appId];

export const selectGdcAppById = (appId: string) => lookupGdcApp(appId);