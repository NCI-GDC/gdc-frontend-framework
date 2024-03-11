import React, { FC } from "react";
import { AnnotationBrowserAppId } from "@/features/annotations/registerApp";
import { selectGdcAppById, useCoreSelector } from "@gff/core";

const AnnotationBrowser: FC = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(AnnotationBrowserAppId),
  ) as React.ElementType;

  return <GdcApp></GdcApp>;
};

export default AnnotationBrowser;
