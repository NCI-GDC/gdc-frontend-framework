import { CartFile, GdcFile, caseFileType } from "@gff/core";
import { get, omit, pick } from "lodash";
import { HorizontalTableProps } from "../../components/HorizontalTable";
import { JSONObject } from "../types";

/*
formatDataForHorizontalTable searches for data in an object and applies any modifiers provided to the located data. It then outputs data ready for the HorizontalTable component to use
*/
export const formatDataForHorizontalTable = (
  file: GdcFile | JSONObject,
  headersConfig: ReadonlyArray<{
    readonly field: string;
    readonly name: string;
    readonly modifier?: (value: any) => any;
  }>,
): HorizontalTableProps["tableData"] => {
  //match headers with available properties
  return headersConfig.reduce((output, obj) => {
    let value = get(file, obj.field);
    //run modifier if provided on value
    if (obj.modifier) {
      value = obj.modifier(value);
    }
    output.push({
      headerName: obj.name,
      values: [value ? value : "--"],
    });
    return output;
  }, []);
};

type formatImageDetailsInfoFunc = (obj: any) => {
  readonly headerName: string;
  readonly values: readonly (
    | string
    | number
    | boolean
    | readonly string[]
    | JSX.Element
  )[];
}[];

export const formatImageDetailsInfo: formatImageDetailsInfoFunc = (
  obj: any,
) => {
  const headersConfig = [
    {
      field: "file_id",
      name: "File_id",
    },
    {
      field: "submitter_id",
      name: "Submitter_id",
    },
    {
      field: "slide_id",
      name: "Slide_id",
    },
    {
      field: "percent_tumor_nuclei",
      name: "Percent_tumor_nuclei",
    },
    {
      field: "percent_monocyte_infiltration",
      name: "Percent_monocyte_infiltration",
    },
    {
      field: "percent_normal_cells",
      name: "Percent_normal_cells",
    },
    {
      field: "percent_stromal_cells",
      name: "Percent_stromal_cells",
    },
    {
      field: "percent_eosinophil_infiltration",
      name: "Percent_eosinophil_infiltration",
    },
    {
      field: "percent_lymphocyte_infiltration",
      name: "Percent_lymphocyte_infiltration",
    },
    {
      field: "percent_neutrophil_infiltration",
      name: "Percent_neutrophil_infiltration",
    },
    {
      field: "section_location",
      name: "Section_location",
    },
    {
      field: "percent_granulocyte_infiltration",
      name: "Percent_granulocyte_infiltration",
    },
    {
      field: "percent_necrosis",
      name: "Percent_necrosis",
    },
    {
      field: "percent_inflam_infiltration",
      name: "Percent_inflam_infiltration",
    },
    {
      field: "number_proliferating_cells",
      name: "Number_proliferating_cells",
    },
    {
      field: "percent_tumor_cells",
      name: "Percent_tumor_cells",
    },
  ];

  return formatDataForHorizontalTable(obj, headersConfig);
};

type parseSlideDetailsInfoFunc = (file: GdcFile) => {
  readonly headerName: string;
  readonly values: readonly (
    | string
    | number
    | boolean
    | readonly string[]
    | JSX.Element
  )[];
}[];

export const parseSlideDetailsInfo: parseSlideDetailsInfoFunc = (
  file: GdcFile,
) => {
  const slides = file.cases?.[0]?.samples?.[0]?.portions?.[0]?.slides[0];
  const slidesInfo = omit(slides, [
    "created_datetime",
    "updated_datetime",
    "state",
  ]);
  const slideDetailsInfo = { file_id: file.file_id, ...slidesInfo };

  return formatImageDetailsInfo(slideDetailsInfo);
};

export const mapGdcFileToCartFile = (
  files: GdcFile[] | caseFileType[] | undefined,
): CartFile[] =>
  files?.map((file: GdcFile | caseFileType) =>
    pick(file, [
      "access",
      "acl",
      "file_id",
      "file_size",
      "state",
      "project_id",
      "file_name",
    ]),
  );

export const REF_GENOME_EXCLUDED_TYPES = {
  fileType: ["masked_methylation_array"],
  workflow_type: ["Birdseed"],
};

export const shouldDisplayReferenceGenome = (file: GdcFile) => {
  const isIncluded = (type: string, value: string) => {
    return REF_GENOME_EXCLUDED_TYPES[type]?.includes(value);
  };

  return (
    !isIncluded("fileType", file.fileType) &&
    !isIncluded("workflow_type", file?.analysis?.workflow_type)
  );
};
