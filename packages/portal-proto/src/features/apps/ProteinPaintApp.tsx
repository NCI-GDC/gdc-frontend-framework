import { FC } from "react";
import { PpLolliplot } from "../proteinpaint/PpReactWrapper";

const ProteinPaintApp: FC = () => {
  /*** TODO: determine basepath prop value at runtime ***/
  return <PpLolliplot basepath="https://proteinpaint.stjude.org" />;
};

export default ProteinPaintApp;
