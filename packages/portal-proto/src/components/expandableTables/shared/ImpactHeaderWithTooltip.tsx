import { Tooltip } from "@mantine/core";
import tw from "tailwind-styled-components";

const ImpactHeaderWithTooltip = (): JSX.Element => {
  const TwIconDiv = tw.div`w-7 h-6 text-base-max rounded-md flex justify-center items-center mx-1`;
  const TwSpanParent = tw.span`flex gap-1`;
  const TwSpanFontNormal = tw.span`font-normal`;
  return (
    <Tooltip
      label={
        <div>
          <span className="font-normal">Impact for canonical transcript:</span>
          <div className="flex gap-1">
            <div>
              VEP
              <div className="flex flex-col gap-2 mt-1">
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-vep-high">HI</TwIconDiv>
                  <TwSpanFontNormal>high</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-vep-low">LO</TwIconDiv>
                  <TwSpanFontNormal>low</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-vep-moderate">MO</TwIconDiv>
                  <TwSpanFontNormal>moderate</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-vep-modifier">MR</TwIconDiv>
                  <TwSpanFontNormal>modifier</TwSpanFontNormal>
                </TwSpanParent>
              </div>
            </div>
            <div>
              SIFT
              <div className="flex flex-col gap-2 mt-1">
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-sift-deleterious">
                    DH
                  </TwIconDiv>
                  <TwSpanFontNormal>deleterious</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-sift-deleterious_low_confidence">
                    DL
                  </TwIconDiv>
                  <TwSpanFontNormal>
                    deleterious_low_confidence
                  </TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-sift-tolerated">TO</TwIconDiv>
                  <TwSpanFontNormal>tolerated</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-sift-tolerated_low_confidence">
                    TL
                  </TwIconDiv>

                  <TwSpanFontNormal>tolerated_low_confidence</TwSpanFontNormal>
                </TwSpanParent>
              </div>
            </div>
            <div>
              PolyPhen
              <div className="flex flex-col gap-2 mt-1">
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-polyphen-benign">
                    BE
                  </TwIconDiv>
                  <TwSpanFontNormal>benign</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-polyphen-possibly_damaging">
                    PO
                  </TwIconDiv>
                  <TwSpanFontNormal>possibly_damaging</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-polyphen-probably_damaging">
                    PR
                  </TwIconDiv>

                  <TwSpanFontNormal>probably_damaging</TwSpanFontNormal>
                </TwSpanParent>
                <TwSpanParent>
                  <TwIconDiv className="bg-impact-polyphen-unknown">
                    UN
                  </TwIconDiv>
                  <TwSpanFontNormal>unknown</TwSpanFontNormal>
                </TwSpanParent>
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

export default ImpactHeaderWithTooltip;
