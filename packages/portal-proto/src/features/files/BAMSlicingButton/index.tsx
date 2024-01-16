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
import { userCanDownloadFile } from "src/utils/userProjectUtils";

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
      className="font-medium text-sm text-primary bg-base-max hover:bg-primary-darkest hover:text-primary-contrast-darker"
      leftIcon={<FaCut aria-hidden="true" />}
      loading={isActive}
      variant="outline"
      onClick={() => {
        if (username && userCanDownloadFile({ user: userInfo.data, file })) {
          dispatch(showModal({ modal: Modals.BAMSlicingModal }));
        } else if (
          username &&
          !userCanDownloadFile({ user: userInfo.data, file })
        ) {
          dispatch(showModal({ modal: Modals.NoAccessToProjectModal }));
        } else {
          dispatch(showModal({ modal: Modals.NoAccessModal }));
        }
      }}
      data-testid="bamButton"
    >
      {isActive ? "Slicing" : "BAM Slicing"}
    </Button>
  );
};
