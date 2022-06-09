import {
  ClinicalDataAnalysis,
  CohortComparison,
  GeneExpression,
  OncoGrid,
  ProteinPaint,
  SetOperations,
  SingleCellRnaSeq,
  SomaticMutations,
} from "../apps/Apps";
import React, { useState } from "react";

const CohortApps: React.FC = () => {
  const [, setShowAppModal] = useState(false);
  const [, setSelectedApp] = useState("");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-gray-100">
      <OncoGrid
        onClick={() => {
          setSelectedApp("OncoGrid");
          setShowAppModal(true);
        }}
      />
      <SingleCellRnaSeq
        onClick={() => {
          setSelectedApp("scRNA-Seq");
          setShowAppModal(true);
        }}
      />
      <GeneExpression
        onClick={() => {
          setSelectedApp("Gene Expression");
          setShowAppModal(true);
        }}
      />
      <ProteinPaint
        onClick={() => {
          setSelectedApp("ProteinPaint");
          setShowAppModal(true);
        }}
      />

      <SetOperations
        onClick={() => {
          setSelectedApp("Set Operations");
          setShowAppModal(true);
        }}
      />
      <CohortComparison
        onClick={() => {
          setSelectedApp("Cohort Comparison");
          setShowAppModal(true);
        }}
      />
      <ClinicalDataAnalysis
        onClick={() => {
          setSelectedApp("Clinical Data Analysis");
          setShowAppModal(true);
        }}
      />

      <SomaticMutations
        onClick={() => {
          setSelectedApp("Somatic Mutations");
          setShowAppModal(true);
        }}
      />

      {/* {[undefined, undefined, undefined].map((name, i) => (
          <App
            key={`${name}-${i}`}
            name={name}
            onClick={() => {
              setSelectedApp(name);
              setShowAppModal(true);
            }}
          />
        ))} */}
    </div>
  );
};

export default CohortApps;
