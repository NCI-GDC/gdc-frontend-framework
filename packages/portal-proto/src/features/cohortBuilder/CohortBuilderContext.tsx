import React, { createContext, useState, PropsWithChildren } from "react";

const CohortBuilderSummaryContext = createContext(null);

const CohortBuilderSummaryContextProvider: React.FC<
  PropsWithChildren<unknown>
> = ({ children }: PropsWithChildren<unknown>) => {
  const [summaryFields, setSummaryFields] = useState([
    "primary_site",
    "demographic.gender",
    "disease_type",
    "diagnoses.tissue_or_organ_of_origin",
  ]);

  return (
    <CohortBuilderSummaryContext.Provider
      value={{ summaryFields, setSummaryFields }}
    >
      {children}
    </CohortBuilderSummaryContext.Provider>
  );
};

export { CohortBuilderSummaryContext, CohortBuilderSummaryContextProvider };
