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
  const truncatedLabel = truncateAfterMarker(DNAChange);

  return (
    <>
      {DNAChange ? (
        <Tooltip label={DNAChange} disabled={!DNAChange}>
          <span>
            {isModal && !geneSymbol ? (
              <PopupIconButton
                handleClick={() =>
                  setEntityMetadata({
                    entity_type: "ssms",
                    entity_id: mutationID,
                  })
                }
                label={truncatedLabel}
              />
            ) : (
              <Link
                href={`/ssms/${mutationID}`}
                className="underline text-utility-link"
              >
                {truncatedLabel}
              </Link>
            )}
          </span>
        </Tooltip>
      ) : (
        "--"
      )}
    </>
  );
};

export default SMTableDNAChange;
