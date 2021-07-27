import { GdcApiResponse } from "../gdcapi/gdcapi";
import { fetchProjects, ProjectHit } from "./projectsApi";

describe("projectApi", () => {
  describe("fetchProjects", () => {
    let projects: GdcApiResponse<ProjectHit>;

    beforeAll(async () => {
      projects = await fetchProjects();
    });

    test("should contain no warnings", () => {
      expect(projects?.warnings).toEqual({});
    });

    test("should contain hits", async () => {
      expect(projects?.data?.hits).toBeDefined();
    });

    describe("project hits", () => {
      test("should all have project ids", () => {
        projects.data.hits.forEach((project) =>
          expect(project.project_id).toBeDefined(),
        );
      });

      test("should all have names", () => {
        projects.data.hits.forEach((project) =>
          expect(project.name).toBeDefined(),
        );
      });
    });
  });
});
