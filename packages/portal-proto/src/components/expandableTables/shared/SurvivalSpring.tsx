import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";

interface SurvivalSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: any;
  handleSurvival: (symbol: string, name: string, gene: string) => any;
}

const SurvivalSpring: React.VFC<SurvivalSpringProps> = ({
  isActive,
  icon,
  selected,
  handleSurvival,
}: SurvivalSpringProps) => {
  return <>hi survival</>;
};

export default SurvivalSpring;
