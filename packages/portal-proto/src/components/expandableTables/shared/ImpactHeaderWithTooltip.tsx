import { Tooltip } from "@mantine/core";
import tw from "tailwind-styled-components";

export const ImpactHeaderWithTooltip = (): JSX.Element => {
  const TwIconDiv = tw.div`w-7 h-6 text-base-max rounded-md flex justify-center items-center mx-1`;
  return (
    <Tooltip
      label={
        <div>
          <span>Impact for canonical transcript:</span>
          <div className="flex gap-1">
            <div>
              VEP:
              <div className="flex flex-col gap-2">
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-vep-high">HI</TwIconDiv>
                  high
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-vep-low">LO</TwIconDiv>
                  low
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-vep-moderate">MO</TwIconDiv>
                  moderate
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-vep-modifier">MR</TwIconDiv>
                  modifier
                </span>
              </div>
            </div>
            <div>
              SIFT:
              <div className="flex flex-col gap-2">
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-sift-deleterious">
                    DH
                  </TwIconDiv>
                  deleterious
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-sift-deleterious_low_confidence">
                    DL
                  </TwIconDiv>
                  deleterious_low_confidence
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-sift-tolerated">TO</TwIconDiv>
                  tolerated
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-sift-tolerated_low_confidence">
                    TL
                  </TwIconDiv>
                  tolerated_low_confidence
                </span>
              </div>
            </div>
            <div>
              PolyPhen:
              <div className="flex flex-col gap-2">
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-polyphen-benign">
                    BE
                  </TwIconDiv>
                  benign
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-polyphen-possibly_damaging">
                    PO
                  </TwIconDiv>
                  possibly_damaging
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-polyphen-probably_damaging">
                    PR
                  </TwIconDiv>
                  probably_damaging
                </span>
                <span className="flex gap-1">
                  <TwIconDiv className="bg-impact-polyphen-unknown">
                    UN
                  </TwIconDiv>
                  unknown
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      transition="fade"
      transitionDuration={200}
      multiline
      classNames={{
        tooltip:
          "bg-base-min text-base-contrast-min font-heading text-left p-2",
      }}
    >
      <div className="font-heading text-left whitespace-pre-line">Impact</div>
    </Tooltip>
  );
};
