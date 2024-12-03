import { render } from "test-utils";
import { UserProfileModal } from "./UserProfileModal";
import {
  useFetchUserDetailsQuery,
  useLazyFetchUserDetailsQuery,
} from "@gff/core";
jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useGetBannerNotificationsQuery: jest
    .fn()
    .mockImplementation(jest.fn().mockReturnValue([jest.fn()])),
  useFetchUserDetailsQuery: jest.fn(),
  useLazyFetchUserDetailsQuery: jest.fn(),
}));

describe("<UserProfileModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show no access message when there are not projets assigned to the user. ", () => {
    jest.mocked(useFetchUserDetailsQuery).mockReturnValue({
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
    jest.mocked(useFetchUserDetailsQuery).mockReturnValue({
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
      .mocked(useLazyFetchUserDetailsQuery)
      .mockImplementation(jest.fn().mockReturnValue([jest.fn()]));
    jest.mocked(useFetchUserDetailsQuery).mockReturnValue({
      data: {
        data: null,
        status: 401,
      },
    } as any);

    const { getByText } = render(<UserProfileModal openModal />);

    expect(getByText("Your session has expired. Please login."));
  });
});
