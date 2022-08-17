import {
  useCoreDispatch,
  useCoreSelector,
  selectUserDetailsInfo,
  showModal,
  Modals,
  GdcFile,
  UserInfo,
} from "@gff/core";
import { Button } from "@mantine/core";
import { get, intersection } from "lodash";
import { FaCut } from "react-icons/fa";

const isUserProject = ({ file, user }: { file: GdcFile; user: UserInfo }) => {
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

const fileInCorrectState = (file: GdcFile): boolean =>
  file.state === "submitted";

const intersectsWithFileAcl = ({
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

const userCanDownloadFiles = ({
  files,
  user,
}: {
  files: GdcFile[];
  user: UserInfo;
}) =>
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

const userCanDownloadFile = ({
  file,
  user,
}: {
  user: UserInfo;
  file: GdcFile;
}) =>
  userCanDownloadFiles({
    files: [file],
    user,
  });

export const BAMSlicingButton = ({
  isActive,
  file,
}: {
  isActive: boolean;
  file: GdcFile;
}) => {
  const dispatch = useCoreDispatch();
  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));
  const { username } = userInfo?.data || {};
  return (
    <Button
      className="text-nci-gray-lightest bg-nci-blue hover:bg-nci-blue-darker "
      leftIcon={<FaCut />}
      loading={isActive}
      onClick={() => {
        if (username && userCanDownloadFile({ user: userInfo.data, file })) {
          dispatch(showModal(Modals.BAMSlicingModal));
        } else {
          dispatch(showModal(Modals.NoAccessModal));
        }
      }}
    >
      {isActive ? "Slicing" : "BAM Slicing"}
    </Button>
  );
};
