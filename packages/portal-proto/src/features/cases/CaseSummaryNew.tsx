import { SummaryCard } from "@/components/Summary/SummaryCard";
import SummaryCount from "@/components/Summary/SummaryCount";
import { useCaseSummary } from "@gff/core";
import { Button, LoadingOverlay, Tooltip } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FaFile, FaMicroscope, FaShoppingCart, FaEdit } from "react-icons/fa";
import { URLContext } from "src/pages/_app";
import { Biospecimen } from "../biospecimen/Biospecimen";
import { humanify } from "../biospecimen/utils";
import { addToCart } from "../cart/updateCart";
import { formatDataForHorizontalTable } from "../files/utils";
export const CaseSummaryNew = ({
  case_id,
  bio_id,
}: {
  case_id: string;
  bio_id: string;
}): JSX.Element => {
  const { data, isFetching } = useCaseSummary({
    filters: {
      content: {
        field: "case_id",
        value: case_id,
      },
      op: "=",
    },
    fields: [
      "files.file_id",
      "files.data_type",
      "files.acl",
      "files.state",
      "files.access",
      "files.file_size",
      "case_id",
      "submitter_id",
      "project.name",
      "disease_type",
      "project.project_id",
      "primary_site",
      "project.program.name",
      "summary.file_count",
      "summary.data_categories.file_count",
      "summary.data_categories.data_category",
      "summary.experimental_strategies.experimental_strategy",
      "summary.experimental_strategies.file_count",
      "annotations.annotation_id",
    ],
  });

  console.log("data: ", data);
  const { prevPath } = useContext(URLContext);

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  useEffect(() => {
    if (prevPath?.includes("MultipleImageViewerPage")) {
      scrollIntoView();
    }
  }, [prevPath, scrollIntoView]);

  const slideCountFromCaseSummary = (
    experimental_strategies: Array<{
      experimental_strategy: string;
      file_count: number;
    }>,
  ): number => {
    const slideTypes = ["Diagnostic Slide", "Tissue Slide"];
    return (experimental_strategies || []).reduce(
      (slideCount, { file_count, experimental_strategy }) =>
        slideTypes.includes(experimental_strategy)
          ? slideCount + file_count
          : slideCount,
      0,
    );
  };

  const filesCountTotal = data?.files.length;
  const annotationsCountTotal = data?.annotations
    ? data?.annotations?.length
    : 0;
  console.log(filesCountTotal, annotationsCountTotal);

  const getAnnotationsLinkParams = (
    annotations: typeof data.annotations,
  ): string | null => {
    if (!annotations) return null;
    if (annotations.length === 1) {
      return `/annotations/${annotations[0].annontation_id}`;
    } else if (annotations.length > 1) {
      return "";
    }
  };

  const formatDataForCaseSummary = () => {
    const {
      case_id,
      submitter_id,
      project: {
        project_id,
        name: project_name,
        program: { name: program_name },
      },
      disease_type,
      primary_site,
      files,
      summary: { experimental_strategies },
    } = data;

    const slideCount = slideCountFromCaseSummary(experimental_strategies);

    const imageFiles = files?.filter(
      (file) => file.data_type === "Slide Image",
    );

    console.log("imageFiles: ", imageFiles);

    let caseSummaryObject: Record<string, any> = {
      case_uuid: case_id,
      case_id: submitter_id,
      project: (
        <Link href={`/projects/${project_id}`}>
          <a className="underline text-nci-blue"> {project_id}</a>
        </Link>
      ),
      project_name,
      disease_type,
      program_name,
      primary_site,
    };

    if (!!slideCount && imageFiles.length > 0) {
      const images = (
        <div className="flex">
          <Tooltip label="View Slide Image">
            <Link
              href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${case_id}`}
            >
              <a className="flex gap-1 cursor-pointer">
                <FaMicroscope className="mt-0.5" />
                <span>({slideCount})</span>
              </a>
            </Link>
          </Tooltip>
          <Tooltip label={"Add to Cart"}>
            <FaShoppingCart
              className="mt-0.5"
              onClick={() => {
                // addToCart(imageFiles, currentCart, dispatch);
              }}
              // className={isFileInCart ? "text-nci-green" : ""}
            />
          </Tooltip>
        </div>
      );

      caseSummaryObject = {
        ...caseSummaryObject,
        images,
      };
    }
    const headersConfig = Object.keys(caseSummaryObject).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(caseSummaryObject, headersConfig);
  };

  return (
    <>
      {!data && isFetching ? (
        <LoadingOverlay visible />
      ) : data ? (
        <>
          <div className="flex flex-col mx-auto mt-5 w-10/12">
            <div className="flex flex-col gap-3">
              <Button leftIcon={<FaShoppingCart />} className="self-end	">
                Add all files to the cart
              </Button>
              <div className="flex">
                <div className="flex- 1 w-10/12">
                  <SummaryCard tableData={formatDataForCaseSummary()} />
                </div>
                <div className="flex-1 w-2/12">
                  <SummaryCount
                    title="files"
                    count={filesCountTotal.toLocaleString()}
                    Icon={FaFile}
                  />
                  <SummaryCount
                    title="annotations"
                    count={annotationsCountTotal.toLocaleString()}
                    Icon={FaEdit}
                    href={getAnnotationsLinkParams(data.annotations)}
                  />
                </div>
              </div>
            </div>

            <div ref={targetRef} id="biospecimen">
              <Biospecimen caseId={case_id} bioId={bio_id} />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
