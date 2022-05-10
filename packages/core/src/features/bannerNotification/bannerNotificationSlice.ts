import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import { buildFetchError } from "../gdcapi/gdcapi";

export interface BannerNotification {
  readonly id: string;
  readonly dismissible: boolean;
  readonly level: "INFO" | "WARNING" | "ERROR";
  readonly message: string;
  readonly dismissed?: boolean;
}

const initialState: BannerNotification[] = [];

export const fetchNotifications = createAsyncThunk<
  { data: BannerNotification[] },
  { dispatch: CoreDispatch; state: CoreState }
>("bannerNotifications/fetchNew", async () => {
  //const res = await fetch("https://api.gdc.cancer.gov/v0/notifications");
  const res = await fetch("http://localhost:3050/notifications");

  if (res.ok) {
    return res.json();
  }

  throw await buildFetchError(res);
});

const slice = createSlice({
  name: "bannerNotification",
  initialState,
  reducers: {
    dismissNotification: (
      state: BannerNotification[],
      action: PayloadAction<string>,
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
      const newNotifications = action.payload.data
        .map((notification) => ({ ...notification, dismissed: false }))
        .filter(
          (notification) => !state.map((n) => n.id).includes(notification.id),
        );
      return [...state, ...newNotifications];
    });
  },
});

export const bannerReducer = slice.reducer;
export const { dismissNotification } = slice.actions;

export const selectBanners = (state: CoreState) =>
  state.bannerNotification.filter((banner) => !banner.dismissed);
