import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { createSlice, PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
import { GDC_APP_API_AUTH } from "../../constants";
import { coreCreateApi } from "src/coreCreateApi";

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

const fetchNotifications = async () => {
  const res = await fetch(`${GDC_APP_API_AUTH}/notifications`);
  const loginRes = await fetch(`${GDC_APP_API_AUTH}/login-notifications`);

  if (!res.ok) {
    return { error: res };
  }

  const results = await res.json();
  const newNotifications = results.data;

  if (loginRes.ok) {
    const loginResults = await loginRes.json();
    return { data: [...newNotifications, ...loginResults.data] };
  }

  return { data: newNotifications };
};

const bannerNotificationApiSlice = coreCreateApi({
  reducerPath: "bannerNotificationApi",
  baseQuery: fetchNotifications,
  endpoints: (builder) => ({
    getBannerNotifications: builder.query<BannerNotification[], void>({
      query: () => {},
    }),
  }),
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
    builder.addMatcher(
      isAnyOf(
        bannerNotificationApiSlice.endpoints.getBannerNotifications
          .matchFulfilled,
      ),
      (state, action) => {
        const newNotifications = action.payload
          .filter(
            (notification) =>
              notification.components.includes("PORTAL_V2") ||
              notification.components.includes("API") ||
              notification.components.includes("LOGIN"),
          )
          .map(
            (notification) =>
              state.find((n) => n.id === notification.id) ?? {
                ...notification,
                dismissed: false,
              },
          );

        return newNotifications;
      },
    );
  },
});

export const bannerReducer = slice.reducer;
export const { dismissNotification } = slice.actions;

export const selectBanners = (state: CoreState): BannerNotification[] =>
  state.bannerNotification.filter(
    (banner: Pick<BannerNotification, "dismissed" | "end_date">) =>
      !banner.dismissed &&
      (banner.end_date === null || new Date(banner.end_date) >= new Date()),
  );

export const {
  useGetBannerNotificationsQuery,
  useLazyGetBannerNotificationsQuery,
} = bannerNotificationApiSlice;

export const bannerNotificationApiSliceMiddleware =
  bannerNotificationApiSlice.middleware as Middleware;
export const bannerNotificationApiSliceReducerPath: string =
  bannerNotificationApiSlice.reducerPath;
export const bannerNotificationApiReducer: Reducer =
  bannerNotificationApiSlice.reducer as Reducer;
