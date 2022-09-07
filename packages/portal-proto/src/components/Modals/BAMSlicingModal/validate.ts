import { processBAMSliceInput } from "./BAMSlicingModal";
import { referenceSequenceNames } from "./GRCh38.d1.vd1";

export const validateBamInput = (value: string): string => {
  if (!value) return "You have not entered any coordinates. Please try again.";
  const processedValue = processBAMSliceInput(value);
  if (Object.keys(processedValue).length === 0)
    return "You have entered invalid coordinates. Please try again.";

  const refSeqs = referenceSequenceNames.split("\n");
  const flag = processedValue.regions.some((region) => {
    if (!region) return true;
    //eslint-disable-next-line
    if (!/^[a-zA-Z0-9\_\-]+(:([0-9]+)?(-[0-9]+)?)?$/.test(region)) return true;

    const splittedRegion = region.split(":");
    if (
      !refSeqs.find((refSeq) => refSeq === splittedRegion[0]) &&
      splittedRegion[0] !== "unmapped"
    )
      return true;
    if (splittedRegion.length > 1 && !splittedRegion[1]) return true;
    const numVals = splittedRegion.length > 1 && splittedRegion[1].split("-");
    if (numVals.length > 2) return true;
    if (numVals.length === 2 && Number(numVals[0]) > Number(numVals[1]))
      return true;
  });

  if (flag) return "You have entered invalid coordinates. Please try again.";

  return null;
};
