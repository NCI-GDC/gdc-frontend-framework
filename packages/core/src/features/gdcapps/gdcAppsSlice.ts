import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import { lookupGdcApp } from "./gdcAppRegistry";

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

export type EntityType = "case" | "gene" | "ssm" | "cnv" | "file";

const initialState: GdcAppsState = {
  gdcApps: {},
};

const slice = createSlice({
  name: "gdcapps",
  initialState,
  reducers: {
    addGdcAppMetadata: (state, action: PayloadAction<GdcAppMetadata>) => {
      const {id, requiredEntityTypes} = action.payload;

      state.gdcApps[id] = {
        ...action.payload,
        // need to turn a ReadonlyArray into a mutable array for immer's WritableDraft
        requiredEntityTypes: [...requiredEntityTypes],
      };
    },
  },
});

export const gdcAppReducer = slice.reducer;

export const { addGdcAppMetadata } = slice.actions;

export const selectGdcAppIds = (state: CoreState) =>
  Object.keys(state.gdcApps.gdcApps);

export const selectAllGdcAppMetadata = (state: CoreState) => Object.values(state.gdcApps.gdcApps);

export const selectGdcAppMetadataById = (state: CoreState, appId: string) => state.gdcApps.gdcApps[appId];

export const selectGdcAppById = (appId: string) => lookupGdcApp(appId);