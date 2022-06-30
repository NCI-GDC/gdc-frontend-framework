import { FC } from "react";
import { PpBam } from "../proteinpaint/PpReactWrapper";

const SequenceReadApp: FC = () => {
  // !!! TODO: may determine basepath prop value at runtime !!!
  return <PpBam basepath="https://proteinpaint.stjude.org" />;
};

export default SequenceReadApp;
