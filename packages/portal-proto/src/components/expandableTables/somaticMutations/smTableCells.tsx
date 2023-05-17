import { Dispatch, SetStateAction } from "react";
import { Tooltip } from "@mantine/core";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { entityMetadataType } from "src/utils/contexts";
import { Impact } from "./types";
import { humanify } from "src/utils";
import { truncate } from "lodash";
import Link from "next/link";

export const ProteinChange = ({
  proteinChange,
  shouldLink,
  shouldOpenModal,
  setEntityMetadata,
}: {
  proteinChange: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  shouldOpenModal: boolean;
  shouldLink: boolean;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}): JSX.Element => {
  const { symbol = "", aaChange = "" } = proteinChange;
  return (
    <div className="flex font-content">
      {shouldOpenModal ? (
        <PopupIconButton
          customStyle="text-utility-link underline mx-0.5 font-content self-center"
          handleClick={() =>
            setEntityMetadata({
              entity_type: "genes",
              entity_id: proteinChange.geneId,
            })
          }
          label={symbol}
        />
      ) : shouldLink ? (
        <Link href={`/genes/${proteinChange.geneId}`}>
          <a className="underline text-utility-link">{symbol}</a>
        </Link>
      ) : (
        <span className="mx-0.5">{symbol}</span>
      )}
      <Tooltip label={aaChange}>
        <span className="mx-0.5 self-center">
          {truncate(aaChange == "" ? "--" : aaChange, {
            length: 12,
          })}
        </span>
      </Tooltip>
    </div>
  );
};

export const Consequences = ({
  consequences,
}: {
  consequences: string;
}): JSX.Element => {
  return (
    <>
      <span className="mx-0.5 font-content text">
        {humanify({
          term: consequences?.replace("_variant", "").replace("_", " "),
        }) ?? ``}
      </span>
    </>
  );
};

export const Impacts = ({ impact }: { impact: Impact }): JSX.Element => {
  const { polyphenImpact, polyphenScore, siftImpact, siftScore, vepImpact } =
    impact;
  const twIconStyles =
    "w-7 h-6 text-base-max font-bold font-content border rounded-md flex justify-center items-center";
  const blankIconStyles = "w-7 h-6 font-bold flex justify-center items-center";

  return (
    <>
      <Tooltip label={`VEP Impact: ${vepImpact}`} disabled={!vepImpact.length}>
        <div className="text-xs">
          {vepImpact === "HIGH" ? (
            <div className={`${twIconStyles} bg-impact-vep-high`}>HI</div>
          ) : vepImpact === "MODERATE" ? (
            <div className={`${twIconStyles} bg-impact-vep-moderate`}>MO</div>
          ) : vepImpact === "LOW" ? (
            <div className={`${twIconStyles} bg-impact-vep-low`}>LO</div>
          ) : vepImpact === "MODIFIER" ? (
            <div className={`${twIconStyles} bg-impact-vep-modifier`}>MR</div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>--</div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`SIFT Impact: ${siftImpact} / SIFT Score: ${siftScore}`}
        disabled={!siftImpact.length || siftScore === null}
      >
        <div className="text-xs mx-0.5 align-middle">
          {siftImpact === "deleterious" ? (
            <div className={`${twIconStyles} bg-impact-sift-deleterious`}>
              DH
            </div>
          ) : siftImpact === "deleterious_low_confidence" ? (
            <div
              className={`${twIconStyles} bg-impact-sift-deleterious_low_confidence`}
            >
              DL
            </div>
          ) : siftImpact === "tolerated" ? (
            <div className={`${twIconStyles} bg-impact-sift-tolerated`}>TO</div>
          ) : siftImpact === "tolerated_low_confidence" ? (
            <div
              className={`${twIconStyles} bg-impact-sift-tolerated_low_confidence`}
            >
              TL
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>--</div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`PolyPhen Impact: ${polyphenImpact} / PolyPhen Score: ${polyphenScore}`}
        disabled={!polyphenImpact.length || polyphenScore === null}
      >
        <div className="text-xs">
          {polyphenImpact === "benign" ? (
            <div className={`${twIconStyles} bg-impact-polyphen-benign`}>
              BE
            </div>
          ) : polyphenImpact === "probably_damaging" ? (
            <div
              className={`${twIconStyles} bg-impact-polyphen-probably_damaging`}
            >
              PR
            </div>
          ) : polyphenImpact === "possibly_damaging" ? (
            <div
              className={`${twIconStyles} bg-impact-polyphen-possibly_damaging`}
            >
              PO
            </div>
          ) : polyphenImpact === "unknown" ? (
            <div className={`${twIconStyles} bg-impact-polyphen-unknown]`}>
              UN
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>--</div>
          )}
        </div>
      </Tooltip>
    </>
  );
};
