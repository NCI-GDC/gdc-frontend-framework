import { truncateAfterMarker } from "../utils";
import { Tooltip } from "@mantine/core";
import Link from "next/link";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { Dispatch, SetStateAction } from "react";
import { entityMetadataType } from "src/utils/contexts";

const SMTableDNAChange = ({
  DNAChange,
  mutationID,
  isModal,
  geneSymbol,
  setEntityMetadata,
}: {
  DNAChange: string;
  mutationID: string;
  isModal: boolean;
  geneSymbol: string;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}): JSX.Element => {
  const originalLabel = DNAChange;
  const label = originalLabel
    ? truncateAfterMarker(originalLabel, 8)
    : originalLabel;
  const ssmsId = mutationID;

  return (
    <div className="font-content">
      {label !== "" ? (
        <Tooltip label={originalLabel} disabled={!originalLabel?.length}>
          {isModal && !geneSymbol ? (
            <PopupIconButton
              handleClick={() =>
                setEntityMetadata({
                  entity_type: "ssms",
                  entity_id: ssmsId,
                })
              }
              label={label}
            />
          ) : (
            <Link href={`/ssms/${ssmsId}`}>
              <a className="underline text-utility-link">{label}</a>
            </Link>
          )}
        </Tooltip>
      ) : (
        <div className="text-lg ml-3">--</div>
      )}
    </div>
  );
};

export default SMTableDNAChange;
