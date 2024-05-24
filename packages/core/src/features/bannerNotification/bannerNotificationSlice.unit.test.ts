import { getInitialCoreState } from "../../store.unit.test";
import {
  bannerReducer,
  dismissNotification,
  BannerNotification,
  selectBanners,
} from "./bannerNotificationSlice";

describe("banner notfication reducer", () => {
  test("dismiss notification", () => {
    const state = bannerReducer(
      [
        { id: 1, dismissed: false },
        { id: 2, dismissed: false },
      ] as BannerNotification[],
      dismissNotification(1),
    );
    expect(state).toEqual([
      { id: 2, dismissed: false },
      { id: 1, dismissed: true },
    ]);
  });

  test("adds new notifications", () => {
    const state = bannerReducer(
      [
        { id: 1, dismissed: false, components: ["PORTAL_V2"] },
      ] as BannerNotification[],
      {
        type: "bannerNotificationApi/executeQuery/fulfilled",
        payload: [{ id: 2, components: ["API"] }],
        meta: {
          arg: {
            type: "query",
            endpointName: "getBannerNotifications",
            queryCacheKey: "getBannerNotifications(undefined)",
          },
          requestId: "BwKKFNi34O1q0ytRcMRBB",
          requestStatus: "fulfilled",
        },
      },
    );
    expect(state).toEqual([{ id: 2, dismissed: false, components: ["API"] }]);
  });

  test("excludes irrelevant notifications", () => {
    const state = bannerReducer(
      [
        { id: 1, dismissed: false, components: ["PORTAL_V2"] },
      ] as BannerNotification[],
      {
        type: "bannerNotificationApi/executeQuery/fulfilled",
        payload: [
          { id: 1, dismissed: false, components: ["PORTAL_V2"] },
          { id: 2, components: ["OTHER"] },
          { id: 3, components: ["PORTAL"] },
          { id: 4, components: ["LEGACY_API"] },
          { id: 5, components: ["LEGACY_PORTAL"] },
          { id: 6, components: ["SUBMISSION"] },
          { id: 7, components: ["SUBMISSION_API"] },
          { id: 8, components: ["DOCUMENTATION"] },
        ],
        meta: {
          arg: {
            type: "query",
            endpointName: "getBannerNotifications",
            queryCacheKey: "getBannerNotifications(undefined)",
          },
          requestId: "BwKKFNi34O1q0ytRcMRBB",
          requestStatus: "fulfilled",
        },
      },
    );
    expect(state).toEqual([
      { id: 1, dismissed: false, components: ["PORTAL_V2"] },
    ]);
  });

  test("keeps notifications as dismissed", () => {
    const state = bannerReducer(
      [
        { id: 1, dismissed: true, components: ["PORTAL_V2"] },
      ] as BannerNotification[],
      {
        type: "bannerNotificationApi/executeQuery/fulfilled",
        payload: [
          { id: 2, components: ["API"] },
          { id: 1, components: ["PORTAL_V2"] },
        ],
        meta: {
          arg: {
            type: "query",
            endpointName: "getBannerNotifications",
            queryCacheKey: "getBannerNotifications(undefined)",
          },
          requestId: "BwKKFNi34O1q0ytRcMRBB",
          requestStatus: "fulfilled",
        },
      },
    );
    expect(state).toEqual([
      { id: 2, dismissed: false, components: ["API"] },
      { id: 1, dismissed: true, components: ["PORTAL_V2"] },
    ]);
  });
});

describe("select banners", () => {
  const state = getInitialCoreState();

  test("Only select banners user has not dismissed", () => {
    const banners = selectBanners({
      ...state,
      bannerNotification: [
        { id: 1, dismissed: true, end_date: null },
        { id: 2, dismissed: false, end_date: null },
      ] as BannerNotification[],
    });

    expect(banners).toEqual([{ id: 2, dismissed: false, end_date: null }]);
  });

  test("Only select active banners", () => {
    const banners = selectBanners({
      ...state,
      bannerNotification: [
        {
          id: 1,
          dismissed: false,
          end_date: "2220-10-13T22:27:55.342974+00:00",
        },
        {
          id: 2,
          dismissed: false,
          end_date: "2020-10-13T22:27:55.342974+00:00",
        },
      ] as BannerNotification[],
    });

    expect(banners).toEqual([
      { id: 1, dismissed: false, end_date: "2220-10-13T22:27:55.342974+00:00" },
    ]);
  });
});
