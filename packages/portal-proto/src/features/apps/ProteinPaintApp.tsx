import { FC } from "react";
import { runproteinpaint } from "@stjude/proteinpaint-client";

const ProteinPaintApp: FC = () => {
  const PpLolliplot = runproteinpaint.wrappers.getPpLolliplot();
  return <PpLolliplot basepath="https://proteinpaint.stjude.org" />;
};

export default ProteinPaintApp;
