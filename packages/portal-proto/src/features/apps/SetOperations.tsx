import React, { FC } from "react";
import { SetOperationsAppId } from "../set-operations/registerApp";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
const SetOperations: FC = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(SetOperationsAppId),
  ) as React.ElementType;

  return (
    <>
      <GdcApp />
    </>
  );
};

export default SetOperations;
