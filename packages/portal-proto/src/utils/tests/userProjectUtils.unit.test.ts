import {
  isUserProject,
  userCanDownloadFile,
  userCanDownloadFiles,
  intersectsWithFileAcl,
} from "../userProjectUtils";

const projectLessUser = {
  username: "iamprojectless",
  projects: {
    phs_ids: {},
    gdc_ids: {},
  },
};

const user = {
  username: "TEST_USER",
  projects: {
    phs_ids: {
      TEST: [
        "read",
        "create",
        "update",
        "download",
        "release",
        "_member_",
        "read_report",
        "delete",
      ],
    },
    gdc_ids: {
      "TCGA-TEST": [
        "read",
        "create",
        "update",
        "release",
        "download",
        "_member_",
        "read_report",
        "delete",
      ],
      "TCGA-LUAD": [
        "read",
        "create",
        "update",
        "release",
        "download",
        "_member_",
        "read_report",
        "delete",
      ],
      "TCGA-LAML": [
        "read",
        "create",
        "update",
        "release",
        "download",
        "_member_",
        "read_report",
        "delete",
      ],
    },
  },
};

const TESTCase = {
  case_id: "test",
  submitter_id: "test",
  project: {
    disease_type: "test",
    name: "test",
    primary_site: "test",
    releasable: true,
    released: true,
    state: "test",
    project_id: "TCGA-TEST",
  },
};

const LUADCase = {
  case_id: "test",
  submitter_id: "test",
  project: {
    disease_type: "test",
    name: "test",
    primary_site: "test",
    releasable: true,
    released: true,
    state: "test",
    project_id: "TCGA-LUAD",
  },
};

const KIRPCase = {
  case_id: "test",
  submitter_id: "test",
  project: {
    disease_type: "test",
    name: "test",
    primary_site: "test",
    releasable: true,
    released: true,
    state: "test",
    project_id: "TCGA-KIRP",
  },
};

const KIRCCase = {
  case_id: "test",
  submitter_id: "test",
  project: {
    disease_type: "test",
    name: "test",
    primary_site: "test",
    releasable: true,
    released: true,
    state: "test",
    project_id: "TCGA-KIRC",
  },
};

const TESTFile = {
  id: "test",
  cases: [TESTCase],
  md5sum: "test",
  platform: "Illumina",
  project_id: "TCGA-TEST",
  state: "released",
  submitterId: "test",
  updatedDatetime: "2022-02-09T12:11:12.781445-06:00",
  access: "controlled" as const,
  acl: ["TEST"],
  createdDatetime: "2022-02-07T00:28:05.547703-06:00",
  data_category: "Sequencing Reads",
  dataRelease: "32.0 - 34.0",
  data_type: "Aligned Reads" as const,
  data_format: "BAM" as const,
  file_id: "test",
  file_name: "test.bam",
  file_size: 25470970387,
  fileType: "aligned_reads" as const,
  version: "2",
};

const LUADFile = {
  id: "test",
  cases: [LUADCase],
  md5sum: "test",
  platform: "Illumina",
  project_id: "TCGA-TEST",
  state: "submitted",
  submitterId: "test",
  updatedDatetime: "2022-02-09T12:11:12.781445-06:00",
  access: "controlled" as const,
  acl: ["TEST", "NOT IN"],
  createdDatetime: "2022-02-07T00:28:05.547703-06:00",
  data_category: "Sequencing Reads",
  dataRelease: "32.0 - 34.0",
  data_type: "Aligned Reads" as const,
  data_format: "BAM" as const,
  file_id: "test",
  file_name: "test.bam",
  file_size: 25470970387,
  fileType: "aligned_reads" as const,
  version: "2",
};

const KIRPFile = {
  id: "test",
  cases: [KIRPCase],
  md5sum: "test",
  platform: "Illumina",
  project_id: "TCGA-KIRP",
  state: "released",
  submitterId: "test",
  updatedDatetime: "2022-02-09T12:11:12.781445-06:00",
  access: "open" as const,
  acl: ["NOT IN"],
  createdDatetime: "2022-02-07T00:28:05.547703-06:00",
  data_category: "Sequencing Reads",
  dataRelease: "32.0 - 34.0",
  data_type: "Aligned Reads" as const,
  data_format: "BAM" as const,
  file_id: "test",
  file_name: "test.bam",
  file_size: 25470970387,
  fileType: "aligned_reads" as const,
  version: "2",
};

const KIRCFile = {
  id: "test",
  cases: [KIRCCase],
  md5sum: "test",
  platform: "Illumina",
  project_id: "TCGA-KIRC",
  state: "released",
  submitterId: "test",
  updatedDatetime: "2022-02-09T12:11:12.781445-06:00",
  access: "controlled" as const,
  acl: ["NOT IN"],
  createdDatetime: "2022-02-07T00:28:05.547703-06:00",
  data_category: "Sequencing Reads",
  dataRelease: "32.0 - 34.0",
  data_type: "Aligned Reads" as const,
  data_format: "BAM" as const,
  file_id: "test",
  file_name: "test.bam",
  file_size: 25470970387,
  fileType: "aligned_reads" as const,
  version: "2",
};

const MultipleProjectFile = {
  id: "test",
  cases: [KIRPCase, TESTCase, KIRCCase],
  md5sum: "test",
  platform: "Illumina",
  project_id: "TCGA-TEST",
  state: "uploaded",
  submitterId: "test",
  updatedDatetime: "2022-02-09T12:11:12.781445-06:00",
  access: "controlled" as const,
  acl: ["TEST"],
  createdDatetime: "2022-02-07T00:28:05.547703-06:00",
  data_category: "Sequencing Reads",
  dataRelease: "32.0 - 34.0",
  data_type: "Aligned Reads" as const,
  data_format: "BAM" as const,
  file_id: "test",
  file_name: "test.bam",
  file_size: 25470970387,
  fileType: "aligned_reads" as const,
  version: "2",
};

describe("isUserProject", () => {
  it("should return false for project less user", () => {
    expect(
      isUserProject({
        user: projectLessUser,
        file: TESTFile,
      }),
    ).toBe(false);
  });

  it("with only one project", () => {
    expect(
      isUserProject({
        user,
        file: TESTFile,
      }),
    ).toBe(true);
    expect(
      isUserProject({
        user,
        file: KIRPFile,
      }),
    ).toBe(false);
  });
  it("with more than one project, only one of them needs to be in gdc_ids", () => {
    expect(
      isUserProject({
        user,
        file: MultipleProjectFile,
      }),
    ).toBe(true);
  });
});

describe("intersectsWithFileAcl", () => {
  it("should detect _member_ role phsids_ has intersection with file.acl", () => {
    expect(intersectsWithFileAcl({ user, file: TESTFile })).toBe(true);
    expect(intersectsWithFileAcl({ user, file: LUADFile })).toBe(true);
    expect(intersectsWithFileAcl({ user, file: KIRPFile })).toBe(false);
  });
});

describe("userCanDownloadFiles", () => {
  it("should work on files with projects", () => {
    expect(userCanDownloadFiles({ user, files: [KIRPFile] })).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [TESTFile],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [KIRPFile],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [TESTFile, KIRCFile],
      }),
    ).toBe(false);
    expect(
      userCanDownloadFiles({
        user,
        files: [TESTFile, LUADFile],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          { ...TESTFile, access: "open" },
          { ...KIRPFile, access: "open" },
        ],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          { ...TESTFile, access: "controlled" },
          { ...KIRPFile, access: "controlled" },
        ],
      }),
    ).toBe(false);
  });

  it("should work on files with no projects", () => {
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            ...TESTFile,
            cases: undefined,
            state: "submitted",
            acl: ["TEST"],
          },
        ],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            ...TESTFile,
            cases: undefined,
            state: "submitted",
            acl: ["TEST"],
          },
          {
            ...KIRPFile,
            cases: undefined,
            state: "submitted",
            access: "controlled" as const,
          },
        ],
      }),
    ).toBe(false);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            ...TESTFile,
            cases: undefined,
            state: "uploaded",
            acl: ["TEST"],
          },
        ],
      }),
    ).toBe(true);
    expect(
      userCanDownloadFiles({
        user,
        files: [
          {
            ...TESTFile,
            project_id: undefined,
            cases: undefined,
            state: "submitted",
            acl: ["NOT IN"],
          },
        ],
      }),
    ).toBe(false);
  });
});

describe("userCanDownloadFile", () => {
  it("works on a single file", () => {
    expect(
      userCanDownloadFile({
        user,
        file: {
          ...TESTFile,
          state: "submitted",
          acl: ["TEST"],
        },
      }),
    ).toBe(true);
    expect(
      userCanDownloadFile({
        user,
        file: {
          ...KIRCFile,
          state: "submitted",
          acl: ["NOT-IN"],
        },
      }),
    ).toBe(false);
  });

  it("should not throw when user has no projects", () => {
    expect(
      userCanDownloadFile({
        user: projectLessUser,
        file: TESTFile,
      }),
    ).toBe(false);
    expect(
      userCanDownloadFile({
        user: projectLessUser,
        file: { ...TESTFile, access: "open" },
      }),
    ).toBe(true);
  });
});
