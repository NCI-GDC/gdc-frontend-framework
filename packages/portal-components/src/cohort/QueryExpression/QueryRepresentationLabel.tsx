import React, { useState, useEffect } from "react";
import { QueryExpressionHooks } from "./types";

interface QueryRepresentationLabelProps {
  readonly field: string;
  readonly value: string;
  readonly hooks: QueryExpressionHooks;
}

const QueryRepresentationLabel: React.FC<QueryRepresentationLabelProps> = ({
  field,
  value,
  hooks,
}: QueryRepresentationLabelProps) => {
  const [formattedValue, setFormattedValue] = useState("...");

  const formatValue = hooks.useFormatValue();

  useEffect(() => {
    formatValue(value, field).then((v: string) => {
      setFormattedValue(v);
    });
  }, []);

  return <>{formattedValue}</>;
};

export default QueryRepresentationLabel;
