import { GdcFile, UserInfo } from "@gff/core";
import { get, intersection } from "lodash";

export const isUserProject = ({
  file,
  user,
}: {
  file: GdcFile;
  user: UserInfo;
}): boolean => {
  if (!user) {
    return false;
  }
  const projectIds = Array.from(
    new Set([
      // ...(file.cases.project || []).map((p) => p.project_id || p),
      ...(file.cases || []).map((e) => e.project.project_id),
    ]),
  );

  const gdcIds = Object.keys(get(user, "projects.gdc_ids", {}));
  console.log(intersection(projectIds, gdcIds));
  return intersection(projectIds, gdcIds).length !== 0;
};

export const fileInCorrectState = (file: GdcFile): boolean =>
  file.state === "submitted";

export const intersectsWithFileAcl = ({
  file,
  user,
}: {
  file: GdcFile;
  user: UserInfo;
}): boolean =>
  intersection(
    Object.keys(get(user, "projects.phs_ids", {})).filter(
      (p) => user.projects.phs_ids[p].indexOf("_member_") !== -1,
    ) || [],
    file.acl,
  ).length !== 0;

export const userCanDownloadFiles = ({
  files,
  user,
}: {
  files: GdcFile[];
  user: UserInfo;
}): boolean =>
  files.every((file) => {
    if (file.access === "open") {
      return true;
    }

    if (file.access === "controlled" && !user) {
      return false;
    }

    if (
      isUserProject({
        file,
        user,
      }) ||
      (intersectsWithFileAcl({
        file,
        user,
      }) &&
        fileInCorrectState(file))
    ) {
      return true;
    }

    return false;
  });

export const userCanDownloadFile = ({
  file,
  user,
}: {
  user: UserInfo;
  file: GdcFile;
}): boolean =>
  userCanDownloadFiles({
    files: [file],
    user,
  });
