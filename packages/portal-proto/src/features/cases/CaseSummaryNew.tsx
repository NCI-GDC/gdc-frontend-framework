import { useCaseSummary } from "@gff/core";
import { LoadingOverlay, Tooltip } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { FaMicroscope, FaShoppingCart } from "react-icons/fa";
import { URLContext } from "src/pages/_app";
import { Biospecimen } from "../biospecimen/Biospecimen";

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
      summary: { experimental_strategies },
    } = data;

    const slideCount = slideCountFromCaseSummary(experimental_strategies);

    let caseSummaryObject = {
      case_uuid: case_id,
      case_id: submitter_id,
      project_name,
      disease_type,
      program_name,
      primary_site,
    };

    // if (!!slideCount) {
    //   const slideImage = {
    //     images: (
    //       <div className="flex">
    //         <Tooltip label="View Slide Image">
    //           <Link
    //             href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${caseId}&selectedId=${selectedSlide[0]?.file_id}`}
    //           >
    //             <a>
    //               <FaMicroscope />
    //             </a>
    //           </Link>
    //         </Tooltip>
    //         <Tooltip label={isFileInCart ? "Remove from Cart" : "Add to Cart"}>
    //           <FaShoppingCart
    //             onClick={() => {
    //               isFileInCart
    //                 ? removeFromCart(selectedSlide, currentCart, dispatch)
    //                 : addToCart(selectedSlide, currentCart, dispatch);
    //             }}
    //             className={isFileInCart ? "text-nci-green" : ""}
    //           />
    //         </Tooltip>
    //       </div>
    //     ),
    //   };
    // }
  };

  return (
    <>
      {!data && isFetching ? (
        <LoadingOverlay visible />
      ) : (
        <>
          <div className="flex flex-col m-auto w-10/12">
            <div ref={targetRef} id="biospecimen">
              <Biospecimen caseId={case_id} bioId={bio_id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
