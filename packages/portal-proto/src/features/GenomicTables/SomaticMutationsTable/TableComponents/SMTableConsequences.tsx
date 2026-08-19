import { fieldNameToTitle } from "@gff/core";
import React, { JSX } from "react";

const SMTableConsequences = ({
  consequences,
}: {
  consequences: string;
}): JSX.Element => (
  <span className="font-content text-left">
    {!consequences
      ? "--"
      : fieldNameToTitle(
          consequences?.replace("_variant", "").replace("_", " "),
        )}
  </span>
);

export default SMTableConsequences;
