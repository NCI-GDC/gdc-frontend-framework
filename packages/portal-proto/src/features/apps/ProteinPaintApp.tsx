import { useRouter } from "next/router";
import { FC } from "react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";

const ProteinPaintApp: FC = () => {
  const {
    query: { demoMode },
  } = useRouter();
  const isDemoMode = demoMode === "true" ? true : false;

  return isDemoMode ? (
    <div>Yet to be build</div>
  ) : (
    <ProteinPaintWrapper track="lollipop" />
  );
};

export default ProteinPaintApp;
