import SingleAppsPage from "src/pages/analysis_page";
import { render } from "test-utils";
import { useRouter } from "next/router";
import { REGISTERED_APPS } from "@/features/user-flow/workflow/registeredApps";

jest.mock("@/features/cohortBuilder/hooks", () => ({
  useSetupInitialCohorts: jest.fn(() => true),
}));

it.each(REGISTERED_APPS)("matches snapshot for $id app", ({ id }) => {
  (useRouter as jest.Mock).mockReturnValueOnce({
    ...useRouter(),
    query: { app: id },
    asPath: `/analysis/${id}`,
  });

  const { container } = render(<SingleAppsPage />);
  expect(container).toMatchSnapshot();
});
