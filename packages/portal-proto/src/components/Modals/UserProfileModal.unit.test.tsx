import { render } from "@testing-library/react";
import { UserProfileModal } from "./UserProfileModal";
import * as core from "@gff/core";

describe("<UserProfileModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
    jest
      .spyOn(core, "useLazyGetBannerNotificationsQuery")
      .mockImplementation(jest.fn().mockReturnValue([jest.fn()]));
  });

  it("should show no access message when there are not projets assigned to the user. ", () => {
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValue({
      data: {
        data: {
          username: "test",
          projects: {
            gdc_ids: {},
          },
        },
        status: 200,
      },
    } as any);

    const { getByTestId, queryByTestId } = render(
      <UserProfileModal openModal />,
    );
    expect(getByTestId("warningText")).toBeInTheDocument();
    expect(queryByTestId("scrolltable")).toBeNull();
  });

  it("should show no access message when there are not projets assigned to the user. ", () => {
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValue({
      data: {
        data: {
          username: "test",
          projects: {
            gdc_ids: { testgc: ["_member_"], "CGCI-HTMCP-CC": ["_member_"] },
          },
        },
        status: 200,
      },
    } as any);

    const { getByTestId, queryByTestId } = render(
      <UserProfileModal openModal />,
    );
    expect(getByTestId("scrolltable")).toBeInTheDocument();
    expect(queryByTestId("warningText")).toBeNull();
  });

  test("should show Session Expire modal when user details returns 401", async () => {
    jest
      .spyOn(core, "useLazyFetchUserDetailsQuery")
      .mockImplementation(jest.fn().mockReturnValue([jest.fn()]));
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValue({
      data: {
        data: null,
        status: 401,
      },
    } as any);

    const { getByText } = render(<UserProfileModal openModal />);

    expect(getByText("Your session has expired. Please login."));
  });
});
