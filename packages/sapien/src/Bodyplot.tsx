/* @flow */

import React from "react";
import { createHumanBody } from "./sapien";
import type { TConfig } from "./types";

const Bodyplot = (props: TConfig) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <div>{createHumanBody(props)}</div>;
};

export default Bodyplot;
