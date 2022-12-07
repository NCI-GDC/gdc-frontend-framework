import CollapsibleRow from "@/features/shared/CollapsibleRow";
import { Columns } from "@/features/shared/VerticalTable";
import { AnnotationDefaults } from "@gff/core";
import { Row, TableInstance } from "react-table";
import tw from "tailwind-styled-components";
import { SelectAlCasesButton, SelectCaseButton } from "../SelectCasesButton";

interface CellProps {
  value: string[];
  row: Row;
}

export const columnListOrder: Columns[] = [
  {
    id: "selected",
    visible: true,
    columnName: ({ data }: TableInstance): JSX.Element => {
      const caseIds = data.map((x) => x.selected);
      return <SelectAlCasesButton caseIds={caseIds} />;
    },
    Cell: ({ value }: { value: string }): JSX.Element => {
      return <SelectCaseButton caseId={value} />;
    },
    disableSortBy: true,
  },
  {
    id: "cart",
    columnName: "Cart",
    visible: true,
    disableSortBy: true,
  },
  {
    id: "slides",
    columnName: "Slides",
    visible: true,
    disableSortBy: true,
  },

  { id: "case_id", columnName: "Case ID", visible: true },
  { id: "case_uuid", columnName: "Case UUID", visible: false },
  { id: "project_id", columnName: "Project", visible: true },
  { id: "program", columnName: "Program", visible: false },
  { id: "primary_site", columnName: "Primary Site", visible: true },
  { id: "disease_type", columnName: "Disease Type", visible: false },
  {
    id: "primary_diagnosis",
    columnName: "Primary Diagnosis",
    visible: false,
    disableSortBy: true,
  },
  {
    id: "age_at_diagnosis",
    columnName: "Age at Diagnosis",
    visible: false,
    disableSortBy: true,
  },
  { id: "vital_status", columnName: "Vital Status", visible: false },
  { id: "days_to_death", columnName: "Days to Death", visible: false },
  { id: "gender", columnName: "Gender", visible: true },
  { id: "race", columnName: "Race", visible: false },
  { id: "ethnicity", columnName: "Ethnicity", visible: false },
  { id: "files", columnName: "Files", visible: true },
  {
    id: "data_categories",
    columnName: "Data Category",
    visible: true,
    Cell: ({ value, row }: CellProps): JSX.Element => (
      <CollapsibleRow value={value} row={row} label="Data Categories" />
    ),
    disableSortBy: true,
  },
  {
    id: "experimental_strategies",
    columnName: "Experimental Strategy",
    visible: false,
    Cell: ({ value, row }: CellProps): JSX.Element => (
      <CollapsibleRow value={value} row={row} label="Experimental Strategies" />
    ),
    disableSortBy: true,
  },
  {
    id: "annotations",
    columnName: "Annotations",
    visible: true,
    disableSortBy: true,
  },
];

export const getCasesTableAnnotationsLinkParams = (
  annotations: AnnotationDefaults[],
  case_id: string,
): string => {
  if (annotations.length === 0) return null;

  if (annotations.length === 1) {
    return `https://portal.gdc.cancer.gov/annotations/${annotations[0].annotation_id}`;
  }
  return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.case_id","value":["${case_id}"]},"op":"in"}],"op":"and"}`;
};

export const SlideCountsIcon = tw.div<{
  $count?: number;
}>`
${(p: { $count?: number }) =>
  p.$count !== undefined && p.$count > 0 ? "bg-primary" : "bg-base-dark"}
  ${(p: { $count?: number }) =>
    p.$count !== undefined && p.$count > 0
      ? "text-primary-contrast"
      : "text-base-contrast-lighter"}
  inline-flex
  items-center
  w-5
  h-4
  justify-center
  font-heading
  rounded-md
`;
