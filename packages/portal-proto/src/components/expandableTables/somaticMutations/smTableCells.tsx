import { Tooltip } from "@mantine/core";
import { Impact } from "./types";
import { humanify } from "src/utils";
import { truncate } from "lodash";
import { Dispatch, SetStateAction } from "react";
import { entityMetadataType } from "src/utils/contexts";

export const ProteinChange = ({
  proteinChange,
  isModal,
  setEntityMetadata,
}: {
  proteinChange: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  isModal: boolean;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}): JSX.Element => {
  const { symbol = "", aaChange = "" } = proteinChange;
  return (
    <div className="flex flex-row w-max justify-start font-content text-xs">
      {isModal ? (
        <button
          className="text-utility-link underline text-xs mx-0.5"
          onClick={() =>
            setEntityMetadata({
              entity_type: "genes",
              entity_id: proteinChange.geneId,
              entity_name: symbol,
            })
          }
        >
          {symbol}
        </button>
      ) : (
        <span className="mx-0.5">{symbol}</span>
      )}
      <Tooltip label={aaChange}>
        <span className="mx-0.5">
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
      <span className={`mx-0.5 font-content text-xs`}>
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
  const twIconStyles = `w-7 h-6 text-white font-bold border rounded-md flex justify-center items-center`;
  const blankIconStyles = `w-7 h-6 text-black font-bold flex justify-center items-center`;
  return (
    <>
      <Tooltip label={`VEP Impact: ${vepImpact}`} disabled={!vepImpact.length}>
        <div className={`text-xs`}>
          {vepImpact === "HIGH" ? (
            <div className={`${twIconStyles} bg-red-500`}>HI</div>
          ) : vepImpact === "MODERATE" ? (
            <div className={`${twIconStyles} bg-gray-500`}>MO</div>
          ) : vepImpact === "LOW" ? (
            <div className={`${twIconStyles} bg-green-500`}>LO</div>
          ) : vepImpact === "MODIFIER" ? (
            <div className={`${twIconStyles} bg-gray-500`}>MR</div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>--</div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`SIFT Impact: ${siftImpact} / SIFT Score: ${siftScore}`}
        disabled={!siftImpact.length || siftScore === null}
      >
        <div className={`text-xs mx-0.5 align-middle`}>
          {siftImpact === "deleterious" ? (
            <div className={`${twIconStyles} bg-red-500`}>DH</div>
          ) : siftImpact === "deleterious_low_confidence" ? (
            <div className={`${twIconStyles} bg-gray-500`}>DL</div>
          ) : siftImpact === "tolerated" ? (
            <div className={`${twIconStyles} bg-gray-500`}>TO</div>
          ) : siftImpact === "tolerated_low_confidence" ? (
            <div className={`${twIconStyles} bg-green-500`}>TL</div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>--</div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`PolyPhen Impact: ${polyphenImpact} / PolyPhen Score: ${polyphenScore}`}
        disabled={!polyphenImpact.length || polyphenScore === null}
      >
        <div className={`text-xs`}>
          {polyphenImpact === "benign" ? (
            <div className={`${twIconStyles} bg-green-500`}>BE</div>
          ) : polyphenImpact === "probably_damaging" ? (
            <div className={`${twIconStyles} bg-red-500`}>PR</div>
          ) : polyphenImpact === "possibly_damaging" ? (
            <div className={`${twIconStyles} bg-gray-500`}>PO</div>
          ) : polyphenImpact === "unknown" ? (
            <div className={`${twIconStyles} bg-gray-500`}>UN</div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>--</div>
          )}
        </div>
      </Tooltip>
    </>
  );
};
