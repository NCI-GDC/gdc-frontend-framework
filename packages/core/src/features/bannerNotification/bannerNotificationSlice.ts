import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import { buildFetchError } from "../gdcapi/gdcapi";

export interface BannerNotification {
  readonly id: number;
  readonly dismissible: boolean;
  readonly level: "INFO" | "WARNING" | "ERROR";
  readonly components: string[];
  readonly message: string;
  readonly dismissed?: boolean;
  readonly end_date: string | null;
}

const initialState: BannerNotification[] = [];

export const fetchNotifications = createAsyncThunk<
  BannerNotification[],
  { dispatch: CoreDispatch; state: CoreState }
>("bannerNotifications/fetchNew", async () => {
  const res = await fetch("https://api.gdc.cancer.gov/v0/notifications");
  const loginRes = await fetch(
    "https://api.gdc.cancer.gov/v0/login-notifications",
  );

  if (!res.ok) {
    throw await buildFetchError(res);
  }

  const results = await res.json();
  const newNotifications = results.data;

  if (loginRes.ok) {
    const loginResults = await loginRes.json();
    newNotifications.push(...loginResults.data);
  }

  return newNotifications;
});

const slice = createSlice({
  name: "bannerNotification",
  initialState,
  reducers: {
    dismissNotification: (
      state: BannerNotification[],
      action: PayloadAction<number>,
    ) => {
      const notification = {
        ...state.find((banner) => banner.id === action.payload),
        dismissed: true,
      } as BannerNotification;
      return [
        ...state.filter((banner) => banner.id !== action.payload),
        notification,
      ];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const newNotifications = action.payload
        .filter(
          (notification) =>
            !state.map((n) => n.id).includes(notification.id) &&
            (notification.components.includes("PORTAL") ||
              notification.components.includes("API") ||
              notification.components.includes("LOGIN")),
        )
        .map((notification) => ({ ...notification, dismissed: false }));

      return [...state, ...newNotifications];
    });
  },
});

export const bannerReducer = slice.reducer;
export const { dismissNotification } = slice.actions;

export const selectBanners = (state: CoreState): BannerNotification[] =>
  state.bannerNotification.filter(
    (banner) =>
      !banner.dismissed &&
      (banner.end_date === null || new Date(banner.end_date) >= new Date()),
  );
