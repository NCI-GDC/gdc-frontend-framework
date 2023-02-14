import { getInitialCoreState } from "../../store.unit.test";
import {
  bannerReducer,
  dismissNotification,
  BannerNotification,
  fetchNotifications,
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
        { id: 1, dismissed: false, components: ["PORTAL"] },
      ] as BannerNotification[],
      {
        type: fetchNotifications.fulfilled,
        payload: [{ id: 2, components: ["API"] }],
      },
    );
    expect(state).toEqual([{ id: 2, dismissed: false, components: ["API"] }]);
  });

  test("excludes irrelevant notifications", () => {
    const state = bannerReducer(
      [
        { id: 1, dismissed: false, components: ["PORTAL"] },
      ] as BannerNotification[],
      {
        type: fetchNotifications.fulfilled,
        payload: [
          { id: 1, dismissed: false, components: ["PORTAL"] },
          { id: 2, components: ["OTHER"] },
        ],
      },
    );
    expect(state).toEqual([
      { id: 1, dismissed: false, components: ["PORTAL"] },
    ]);
  });

  test("keeps notifications as dismissed", () => {
    const state = bannerReducer(
      [
        { id: 1, dismissed: true, components: ["PORTAL"] },
      ] as BannerNotification[],
      {
        type: fetchNotifications.fulfilled,
        payload: [
          { id: 2, components: ["API"] },
          { id: 1, components: ["PORTAL"] },
        ],
      },
    );
    expect(state).toEqual([
      { id: 2, dismissed: false, components: ["API"] },
      { id: 1, dismissed: true, components: ["PORTAL"] },
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
