import { CartFile } from "@gff/core";
import { groupByAccess } from "./utils";

describe("groupByAccess", () => {
  it("user can access open access files", () => {
    const result = groupByAccess(
      [{ access: "open", file_id: "1" }] as CartFile[],
      { username: undefined, projects: { phs_ids: {}, gdc_ids: {} } },
    );
    expect(result).toEqual({
      true: [{ access: "open", file_id: "1", canAccess: true }],
    });
  });

  it("a user that isn't logged in can't access controlled files", () => {
    const result = groupByAccess(
      [{ access: "controlled", file_id: "1" }] as CartFile[],
      { username: undefined, projects: { phs_ids: {}, gdc_ids: {} } },
    );
    expect(result).toEqual({
      false: [{ access: "controlled", file_id: "1", canAccess: false }],
    });
  });

  it("a logged in user can access files in projects they have access to", () => {
    const result = groupByAccess(
      [
        { access: "controlled", file_id: "1", project_id: "CAT" },
        { access: "controlled", file_id: "2", project_id: "DOG" },
      ] as CartFile[],
      {
        username: "user",
        projects: {
          phs_ids: {},
          gdc_ids: { CAT: ["_member_"] },
        },
      },
    );

    expect(result).toEqual({
      true: [
        {
          access: "controlled",
          file_id: "1",
          canAccess: true,
          project_id: "CAT",
        },
      ],
      false: [
        {
          access: "controlled",
          file_id: "2",
          canAccess: false,
          project_id: "DOG",
        },
      ],
    });
  });
});
