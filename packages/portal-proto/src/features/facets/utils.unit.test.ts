import { convertFieldToName } from "./utils";

describe("facet name utils", () => {
  test("should return a label from a field name", () => {
    const name = convertFieldToName("cases.project.project_id");
    expect(name).toEqual("Project Id");
  });
  test("should return the name of the facet", () => {
    const name = convertFieldToName("cases.project.project_id");
    expect(name).toEqual("Project Id");
  });
});
