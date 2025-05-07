import { FC } from "react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";

const CnvSegmentApp: FC = () => {
  return <ProteinPaintWrapper hardcodeCnvOnly={1} />;
};

export default CnvSegmentApp;
