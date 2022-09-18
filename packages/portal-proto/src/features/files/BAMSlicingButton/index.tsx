import {
  useCoreDispatch,
  useCoreSelector,
  selectUserDetailsInfo,
  showModal,
  Modals,
  GdcFile,
} from "@gff/core";
import { Button } from "@mantine/core";
import { FaCut } from "react-icons/fa";
import { userCanDownloadFile } from "../../../utils/userProjectUtils";

export const BAMSlicingButton = ({
  isActive,
  file,
}: {
  isActive: boolean;
  file: GdcFile;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));
  const { username } = userInfo?.data || {};
  return (
    <Button
      className="text-base-lightest bg-primary hover:bg-primary-darker"
      leftIcon={<FaCut />}
      loading={isActive}
      onClick={() => {
        if (username && userCanDownloadFile({ user: userInfo.data, file })) {
          dispatch(showModal(Modals.BAMSlicingModal));
        } else if (
          username &&
          !userCanDownloadFile({ user: userInfo.data, file })
        ) {
          dispatch(showModal(Modals.NoAccessToProjectModal));
        } else {
          dispatch(showModal(Modals.NoAccessModal));
        }
      }}
      data-testid="bamButton"
    >
      {isActive ? "Slicing" : "BAM Slicing"}
    </Button>
  );
};
