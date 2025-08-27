import React, { useState, useEffect } from "react";

interface FormattedFilterLabelProps {
  readonly field: string;
  readonly value: string;
  readonly useFormatValue: () => (
    value: string,
    field: string,
  ) => Promise<string>;
}

const FormattedFilterLabel: React.FC<FormattedFilterLabelProps> = ({
  field,
  value,
  useFormatValue,
}: FormattedFilterLabelProps) => {
  const [formattedValue, setFormattedValue] = useState("...");

  const formatValue = useFormatValue();

  useEffect(() => {
    formatValue(value, field).then((v: string) => {
      setFormattedValue(v);
    });
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{formattedValue}</>;
};

export default FormattedFilterLabel;
