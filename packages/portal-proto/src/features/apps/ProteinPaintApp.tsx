import useIsDemoApp from "@/hooks/useIsDemoApp";
import { FC } from "react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";

const ProteinPaintApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return isDemoMode ? (
    <div>Yet to be build</div>
  ) : (
    <ProteinPaintWrapper track="lollipop" />
  );
};

export default ProteinPaintApp;
