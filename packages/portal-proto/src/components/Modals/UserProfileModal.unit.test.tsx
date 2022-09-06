import { render } from "@testing-library/react";
import { UserProfileModal } from "./UserProfileModal";
import * as core from "@gff/core";

class ResizeObserver {
  observe() {
    // do nothing.
  }
  unobserve() {
    // do nothing.
  }
  disconnect() {
    // do nothing.
  }
}

describe("<UserProfileModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("should show no access message when there are not projets assigned to the user. ", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      data: {
        username: "test",
        projects: {
          gdc_ids: {},
        },
      },
    });
    window.ResizeObserver = ResizeObserver;

    const { getByText, queryByTestId } = render(<UserProfileModal openModal />);
    expect(
      getByText(
        "You do not have any access to controlled access data for projects available in the GDC Data Portal.",
      ),
    ).toBeInTheDocument();
    expect(queryByTestId("scrolltable")).toBeNull();
  });

  it("should show no access message when there are not projets assigned to the user. ", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      data: {
        username: "test",
        projects: {
          gdc_ids: { testgc: ["_member_"], "CGCI-HTMCP-CC": ["_member_"] },
        },
      },
    });

    const { getByTestId, queryByText } = render(<UserProfileModal openModal />);
    expect(getByTestId("scrolltable")).toBeInTheDocument();
    expect(
      queryByText(
        "You do not have any access to controlled access data for projects available in the GDC Data Portal.",
      ),
    ).toBeNull();
  });
});
