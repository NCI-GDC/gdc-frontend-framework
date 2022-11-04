import { Tooltip } from "@mantine/core";
import { Impact } from "./types";
import { humanify } from "src/utils";

export const ProteinChange = ({
  proteinChange,
}: {
  proteinChange: {
    symbol: string;
    aaChange: string;
  };
}): JSX.Element => {
  const { symbol = "", aaChange = "" } = proteinChange;
  return (
    <div className={`flex flex-row w-max m-auto text-xs`}>
      <span className={`mx-0.5`}>{symbol}</span>
      <Tooltip label={aaChange}>
        <span className={`mx-0.5`}>{aaChange}</span>
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
      <div className={`flex flex-row w-max m-auto text-xs`}>
        <span className={`mx-0.5 font-bold`}>
          {humanify({ term: consequences?.split("_")[0] }) ?? ``}
        </span>
      </div>
    </>
  );
};

export const Impacts = ({ impact }: { impact: Impact }): JSX.Element => {
  const { polyphenImpact, polyphenScore, siftImpact, siftScore, vepImpact } =
    impact;
  const twIconStyles = `w-7 h-7 text-white font-bold border rounded-md text-center`;
  const blankIconStyles = `w-7 h-7 text-black font-bold text-center`;
  return (
    <div
      className={`flex flex-row m-auto w-max h-max items-center content-center`}
    >
      <Tooltip label={`VEP Impact: ${vepImpact}`} disabled={!vepImpact.length}>
        <div className={`text-xs`}>
          {vepImpact === "HIGH" ? (
            <div className={`${twIconStyles} bg-red-500`}>
              <div className={`mt-1`}>{"HI"}</div>
            </div>
          ) : vepImpact === "MODERATE" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"MO"}</div>
            </div>
          ) : vepImpact === "LOW" ? (
            <div className={`${twIconStyles} bg-green-500`}>
              <div className={`mt-1`}>{"LOW"}</div>
            </div>
          ) : vepImpact === "MODIFIER" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"MO"}</div>
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>
              <div className={`mt-1`}>{"_"}</div>
            </div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`SIFT Impact: ${siftImpact} / SIFT Score: ${siftScore}`}
        disabled={!siftImpact.length || siftScore === null}
      >
        <div className={`text-xs`}>
          {siftImpact === "deleterious" ? (
            <div className={`${twIconStyles} bg-red-500`}>
              <div className={`mt-1`}>{"DH"}</div>
            </div>
          ) : siftImpact === "deleterious_low_confidence" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"DL"}</div>
            </div>
          ) : siftImpact === "tolerated" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"TO"}</div>
            </div>
          ) : siftImpact === "tolerated_low_confidence" ? (
            <div className={`${twIconStyles} bg-green-500`}>
              <div className={`mt-1`}>{"TL"}</div>
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>
              <div className={`mb-2`}>{"_"}</div>
            </div>
          )}
        </div>
      </Tooltip>
      <Tooltip
        label={`PolyPhen Impact: ${polyphenImpact} / PolyPhen Score: ${polyphenScore}`}
        disabled={!polyphenImpact.length || polyphenScore === null}
      >
        <div className={`text-xs`}>
          {polyphenImpact === "benign" ? (
            <div className={`${twIconStyles} bg-green-500`}>
              <div className={`mt-1`}>{"BE"}</div>
            </div>
          ) : polyphenImpact === "probably_damaging" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"PO"}</div>
            </div>
          ) : polyphenImpact === "uknown" ? (
            <div className={`${twIconStyles} bg-gray-500`}>
              <div className={`mt-1`}>{"UN"}</div>
            </div>
          ) : (
            <div className={`${blankIconStyles} bg-inherit`}>
              <div className={`mb-2`}>{"_"}</div>
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
};
