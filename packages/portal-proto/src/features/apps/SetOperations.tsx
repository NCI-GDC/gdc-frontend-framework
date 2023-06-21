import React, { FC } from "react";
import SetOperationsApp from "../set-operations/SetOperationsApp";
// import { SetOperationsAppId } from "../set-operations/registerApp";
// import { selectGdcAppById, useCoreSelector } from "@gff/core";
// const SetOperations: FC = () => {
//   const GdcApp = useCoreSelector(() =>
//     selectGdcAppById(SetOperationsAppId),
//   ) as React.ElementType;

const SetOperations: FC = () => {
  return (
    <>
      <SetOperationsApp />
    </>
  );
};

export default SetOperations;
